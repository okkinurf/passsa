use keyring::Entry;
use serde::Serialize;
use serde_json::{json, Value};
use std::fs;
use std::io::{BufRead, BufReader, BufWriter, Write};
use std::path::PathBuf;
use std::process::{Child, ChildStdin, ChildStdout, Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{
    AppHandle, Emitter, LogicalSize, Manager, State, WebviewUrl, WebviewWindow,
    WebviewWindowBuilder,
};
use tauri_plugin_autostart::ManagerExt as AutostartManagerExt;
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};
use tauri_plugin_opener::OpenerExt;

const KEYRING_SERVICE: &str = "id.passsa.desktop";
#[cfg(not(debug_assertions))]
const KEYRING_ACCOUNT: &str = "local-runtime-encryption-key-v1";
#[cfg(debug_assertions)]
const KEYRING_ACCOUNT: &str = "local-runtime-encryption-key-v1-dev";
const RPC_MAX_BYTES: usize = 1_048_576;

#[derive(Debug, Serialize)]
struct AppInfo {
    name: &'static str,
    version: &'static str,
    runtime: &'static str,
    desktop_only: bool,
}

struct BackendRuntime {
    child: Child,
    input: BufWriter<ChildStdin>,
    output: BufReader<ChildStdout>,
    request_id: u64,
    quick_access_enabled: bool,
}

#[derive(Clone)]
struct BackendState {
    runtime: Arc<Mutex<BackendRuntime>>,
    clipboard_generation: Arc<AtomicU64>,
    selected_file: Arc<Mutex<Option<(FilePurpose, PathBuf)>>>,
    quick_access_theme: Arc<Mutex<Option<QuickAccessTheme>>>,
}

#[derive(Clone, Serialize)]
struct QuickAccessTheme {
    theme: String,
    palette: String,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum FilePurpose {
    Export,
    Import,
}

#[tauri::command]
fn app_info() -> AppInfo {
    AppInfo {
        name: "PassSa",
        version: env!("CARGO_PKG_VERSION"),
        runtime: "tauri-v2",
        desktop_only: true,
    }
}

#[tauri::command]
fn platform_capabilities() -> Vec<&'static str> {
    vec![
        "local-authentication",
        "encrypted-local-vault",
        "two-factor-authentication",
        "google-drive-sync",
        "s3-sync",
        "cross-platform-clipboard",
        "windows-macos-linux",
    ]
}

fn allowed_backend_channel(channel: &str) -> bool {
    matches!(
        channel,
        "auth:register"
            | "auth:login"
            | "auth:dev-bypass-status"
            | "auth:dev-bypass-login"
            | "auth:google-start"
            | "auth:google-complete"
            | "auth:2fa-copy-setup-key"
            | "auth:2fa-complete"
            | "auth:2fa-status"
            | "auth:2fa-setup-start"
            | "auth:2fa-disable"
            | "auth:direct-login-status"
            | "auth:direct-login-enable"
            | "auth:direct-login-disable"
            | "auth:direct-login-unlock"
            | "auth:session"
            | "auth:logout"
            | "auth:lock"
            | "auth:hello-status"
            | "auth:hello-enable"
            | "auth:hello-disable"
            | "auth:hello-unlock"
            | "auth:change-password"
            | "window:set-mode"
            | "window:set-theme"
            | "settings:get-app"
            | "settings:set-app"
            | "vault:export"
            | "vault:import"
            | "sync:now"
            | "sync:info"
            | "sync:disconnect"
            | "s3:info"
            | "s3:connect"
            | "s3:sync-now"
            | "s3:disconnect"
            | "vault:list"
            | "vault:get"
            | "vault:totp-codes"
            | "vault:add"
            | "vault:update"
            | "vault:favorite"
            | "vault:delete"
            | "vault:restore"
            | "vault:purge"
            | "vault:bulk-update"
            | "vault:bulk-delete"
            | "vault:bulk-restore"
            | "vault:bulk-purge"
            | "vault:copy-entry"
            | "vault:copy-totp"
            | "vault:copy"
            | "category:list"
            | "category:icons"
            | "category:create"
            | "category:update"
            | "category:delete"
            | "quick-access:list"
            | "quick-access:totp-codes"
            | "quick-access:clear-recent"
            | "quick-access:toggle-pin"
            | "quick-access:get-note"
            | "quick-access:use-note"
            | "quick-access:open-item"
            | "quick-access:copy"
    )
}

fn encode_hex(bytes: &[u8]) -> String {
    const HEX: &[u8; 16] = b"0123456789abcdef";
    let mut encoded = String::with_capacity(bytes.len() * 2);
    for byte in bytes {
        encoded.push(HEX[(byte >> 4) as usize] as char);
        encoded.push(HEX[(byte & 0x0f) as usize] as char);
    }
    encoded
}

fn decode_hex(value: &str) -> Option<Vec<u8>> {
    if value.len() != 64 || value.len() % 2 != 0 {
        return None;
    }
    (0..value.len())
        .step_by(2)
        .map(|index| u8::from_str_radix(&value[index..index + 2], 16).ok())
        .collect()
}

fn load_or_create_secure_key() -> Option<String> {
    let entry = Entry::new(KEYRING_SERVICE, KEYRING_ACCOUNT).ok()?;
    match entry.get_password() {
        Ok(existing) if decode_hex(&existing).is_some() => Some(existing),
        Ok(_) => None,
        Err(keyring::Error::NoEntry) => {
            let mut bytes = [0_u8; 32];
            bytes[..16].copy_from_slice(uuid::Uuid::new_v4().as_bytes());
            bytes[16..].copy_from_slice(uuid::Uuid::new_v4().as_bytes());
            let key = encode_hex(&bytes);
            bytes.fill(0);
            entry.set_password(&key).ok()?;
            Some(key)
        }
        Err(_) => None,
    }
}

fn data_directory(app: &AppHandle) -> Result<PathBuf, String> {
    if cfg!(debug_assertions) {
        return Ok(std::env::temp_dir().join(format!(
            "PassSa-Tauri-Dev-{}-{}",
            std::process::id(),
            uuid::Uuid::new_v4()
        )));
    }
    let config_root = app
        .path()
        .config_dir()
        .map_err(|error| format!("Folder data aplikasi tidak tersedia: {error}"))?;
    // Keep the Electron profile untouched until its OS-bound encrypted files
    // have a deliberate migration path. The Tauri profile is independently
    // protected by the platform credential store.
    Ok(config_root.join("PassSa Tauri"))
}

fn runtime_directory(app: &AppHandle) -> Result<PathBuf, String> {
    if cfg!(debug_assertions) {
        return Ok(PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .ok_or("Folder proyek tidak tersedia.")?
            .join(".tauri")
            .join("runtime"));
    }
    Ok(app
        .path()
        .resource_dir()
        .map_err(|error| format!("Folder runtime aplikasi tidak tersedia: {error}"))?
        .join("passsa-runtime"))
}

fn spawn_backend(app: &AppHandle) -> Result<BackendRuntime, String> {
    let runtime_dir = runtime_directory(app)?;
    let data_dir = data_directory(app)?;
    fs::create_dir_all(&data_dir)
        .map_err(|error| format!("Folder data PassSa gagal dibuat: {error}"))?;

    let node_name = if cfg!(target_os = "windows") {
        "node.exe"
    } else {
        "node"
    };
    let node_path = runtime_dir.join(node_name);
    let launcher_path = runtime_dir.join("launcher.cjs");
    if !node_path.is_file()
        || !launcher_path.is_file()
        || !runtime_dir.join("backend.cjs").is_file()
    {
        return Err("Runtime Node PassSa belum disiapkan. Jalankan npm run tauri:prepare lalu build kembali.".into());
    }

    let mut child = Command::new(&node_path)
        // Resolve the entrypoint from the runtime working directory. On some
        // Windows Node distributions, an absolute drive-letter script argument
        // is parsed as `C:` after process creation.
        .arg("launcher.cjs")
        .arg("--passsa-tauri-backend")
        .current_dir(&runtime_dir)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|error| format!("Backend PassSa gagal dijalankan: {error}"))?;
    let child_input = child
        .stdin
        .take()
        .ok_or("Saluran input backend tidak tersedia.")?;
    let child_output = child
        .stdout
        .take()
        .ok_or("Saluran output backend tidak tersedia.")?;
    let mut input = BufWriter::new(child_input);
    let mut output = BufReader::new(child_output);

    let bootstrap = json!({
        "packaged": !cfg!(debug_assertions),
        "devBypassEnabled": cfg!(debug_assertions),
        "userDataDir": data_dir,
        "secureStorageKeyHex": load_or_create_secure_key(),
    });
    serde_json::to_writer(&mut input, &bootstrap).map_err(|error| error.to_string())?;
    input.write_all(b"\n").map_err(|error| error.to_string())?;
    input.flush().map_err(|error| error.to_string())?;

    let mut ready_line = String::new();
    output
        .read_line(&mut ready_line)
        .map_err(|error| format!("Backend PassSa tidak merespons: {error}"))?;
    if ready_line.len() > RPC_MAX_BYTES {
        let _ = child.kill();
        return Err("Respons awal backend PassSa terlalu besar.".into());
    }
    let ready: Value = serde_json::from_str(&ready_line)
        .map_err(|_| "Backend PassSa mengirim respons awal yang tidak valid.".to_string())?;
    if ready.get("type").and_then(Value::as_str) != Some("ready") {
        let _ = child.kill();
        return Err("Backend PassSa belum siap menerima permintaan.".into());
    }

    let quick_access_enabled = ready
        .get("quickAccessEnabled")
        .and_then(Value::as_bool)
        .unwrap_or(true);
    Ok(BackendRuntime {
        child,
        input,
        output,
        request_id: 0,
        quick_access_enabled,
    })
}

fn write_clipboard_and_expire(
    app: AppHandle,
    clipboard_generation: Arc<AtomicU64>,
    text: &str,
) -> Result<(), String> {
    let expected = text.to_owned();
    app.clipboard()
        .write_text(expected.clone())
        .map_err(|error| format!("Gagal menyalin ke clipboard: {error}"))?;
    let generation = clipboard_generation.fetch_add(1, Ordering::SeqCst) + 1;
    thread::spawn(move || {
        thread::sleep(Duration::from_secs(30));
        if clipboard_generation.load(Ordering::SeqCst) != generation {
            return;
        }
        if matches!(app.clipboard().read_text(), Ok(ref current) if current == &expected) {
            let _ = app.clipboard().clear();
        }
    });
    Ok(())
}

#[tauri::command]
async fn backend_request(
    app: AppHandle,
    state: State<'_, BackendState>,
    channel: String,
    mut args: Vec<Value>,
) -> Result<Value, String> {
    if !allowed_backend_channel(&channel) {
        return Err("Operasi ini tidak diizinkan.".into());
    }
    if channel == "vault:export" || channel == "vault:import" {
        let expected = if channel == "vault:export" {
            FilePurpose::Export
        } else {
            FilePurpose::Import
        };
        let selected = state
            .selected_file
            .lock()
            .map_err(|_| "Pemilihan file tidak tersedia.".to_string())?
            .take();
        let Some((_, path)) = selected.filter(|(purpose, _)| *purpose == expected) else {
            return Err("Pilih file melalui dialog PassSa terlebih dahulu.".into());
        };
        let input = args
            .first_mut()
            .and_then(Value::as_object_mut)
            .ok_or_else(|| "Parameter transfer file tidak valid.".to_string())?;
        input.insert(
            "filePath".into(),
            Value::String(path.to_string_lossy().into_owned()),
        );
    }
    let backend = state.runtime.clone();
    let generation = state.clipboard_generation.clone();
    tauri::async_runtime::spawn_blocking(move || {
        let mut backend = backend
            .lock()
            .map_err(|_| "Backend PassSa sedang tidak tersedia.".to_string())?;
        if backend
            .child
            .try_wait()
            .map_err(|error| error.to_string())?
            .is_some()
        {
            return Err("Backend PassSa telah berhenti. Tutup lalu buka kembali aplikasi.".into());
        }
        backend.request_id = backend.request_id.saturating_add(1);
        let id = backend.request_id;
        let request = json!({ "id": id, "channel": channel, "args": args });
        let encoded = serde_json::to_vec(&request).map_err(|error| error.to_string())?;
        if encoded.len() > RPC_MAX_BYTES {
            return Err("Permintaan PassSa terlalu besar.".into());
        }
        backend
            .input
            .write_all(&encoded)
            .map_err(|error| error.to_string())?;
        backend
            .input
            .write_all(b"\n")
            .map_err(|error| error.to_string())?;
        backend.input.flush().map_err(|error| error.to_string())?;

        let mut response_line = String::new();
        backend
            .output
            .read_line(&mut response_line)
            .map_err(|error| format!("Backend PassSa gagal merespons: {error}"))?;
        if response_line.len() > RPC_MAX_BYTES {
            return Err("Respons backend PassSa terlalu besar.".into());
        }
        let response: Value = serde_json::from_str(&response_line)
            .map_err(|_| "Respons backend PassSa tidak valid.".to_string())?;
        if response.get("id").and_then(Value::as_u64) != Some(id) {
            return Err("Urutan respons backend PassSa tidak cocok.".into());
        }
        if let Some(error) = response
            .get("error")
            .and_then(|value| value.get("message"))
            .and_then(Value::as_str)
        {
            return Err(error.to_owned());
        }

        if response.get("clearClipboard").and_then(Value::as_bool) == Some(true) {
            generation.fetch_add(1, Ordering::SeqCst);
            app.clipboard()
                .clear()
                .map_err(|error| format!("Gagal membersihkan clipboard: {error}"))?;
        }
        if let Some(text) = response.get("clipboardText").and_then(Value::as_str) {
            write_clipboard_and_expire(app.clone(), generation.clone(), text)?;
        }
        if let Some(events) = response.get("events").and_then(Value::as_array) {
            for event in events {
                let Some(name) = event.get("event").and_then(Value::as_str) else {
                    continue;
                };
                let payload = event.get("payload").cloned().unwrap_or(Value::Null);
                if name == "quick-access:refresh" || name == "quick-access:theme" {
                    if let Some(quick_window) = app.get_webview_window("quick_access") {
                        let _ = quick_window.emit(name, payload);
                    }
                } else {
                    let _ = app.emit(name, payload);
                }
            }
        }
        Ok(response.get("result").cloned().unwrap_or(Value::Null))
    })
    .await
    .map_err(|error| format!("Backend PassSa gagal dijalankan: {error}"))?
}

fn window(app: &AppHandle) -> Result<WebviewWindow, String> {
    app.get_webview_window("main")
        .ok_or_else(|| "Jendela PassSa belum tersedia.".to_string())
}

#[tauri::command]
fn window_minimize(app: AppHandle) -> Result<(), String> {
    window(&app)?.minimize().map_err(|error| error.to_string())
}

#[tauri::command]
fn window_toggle_maximize(app: AppHandle) -> Result<bool, String> {
    let window = window(&app)?;
    if window.is_maximized().map_err(|error| error.to_string())? {
        window.unmaximize().map_err(|error| error.to_string())?;
        Ok(false)
    } else {
        window.maximize().map_err(|error| error.to_string())?;
        Ok(true)
    }
}

#[tauri::command]
fn window_close(app: AppHandle) -> Result<(), String> {
    window(&app)?.close().map_err(|error| error.to_string())
}

#[tauri::command]
fn set_window_mode(app: AppHandle, mode: String) -> Result<(), String> {
    let window = window(&app)?;
    let (width, height, min_width, min_height) = if mode == "vault" {
        (1120, 760, 860, 620)
    } else {
        (520, 580, 480, 520)
    };
    if window.is_maximized().map_err(|error| error.to_string())? {
        window.unmaximize().map_err(|error| error.to_string())?;
    }
    window
        .set_min_size(Some(LogicalSize::new(min_width, min_height)))
        .map_err(|error| error.to_string())?;
    window
        .set_size(LogicalSize::new(width, height))
        .map_err(|error| error.to_string())?;
    window.center().map_err(|error| error.to_string())
}

#[tauri::command]
async fn pick_vault_export_file(
    app: AppHandle,
    state: State<'_, BackendState>,
    format: String,
) -> Result<bool, String> {
    let is_csv = format == "csv";
    let (title, name, extension) = if is_csv {
        ("Ekspor CSV PassSa", "PassSa-vault.csv", "csv")
    } else {
        (
            "Ekspor backup terenkripsi PassSa",
            "PassSa-vault.passsa",
            "passsa",
        )
    };
    let selection = app
        .dialog()
        .file()
        .set_title(title)
        .set_file_name(name)
        .add_filter(
            if is_csv {
                "CSV"
            } else {
                "Backup terenkripsi PassSa"
            },
            &[extension],
        )
        .blocking_save_file();
    let Some(selection) = selection else {
        return Ok(false);
    };
    let path = selection
        .into_path()
        .map_err(|error| format!("Lokasi ekspor tidak valid: {error}"))?;
    *state
        .selected_file
        .lock()
        .map_err(|_| "Pemilihan file tidak tersedia.".to_string())? =
        Some((FilePurpose::Export, path));
    Ok(true)
}

#[tauri::command]
async fn pick_vault_import_file(
    app: AppHandle,
    state: State<'_, BackendState>,
    mode: String,
) -> Result<bool, String> {
    let selection = app
        .dialog()
        .file()
        .set_title("Pilih file backup PassSa atau CSV")
        .add_filter("Backup PassSa atau CSV", &["passsa", "csv"])
        .blocking_pick_file();
    let Some(selection) = selection else {
        return Ok(false);
    };
    let path = selection
        .into_path()
        .map_err(|error| format!("File import tidak valid: {error}"))?;
    let replace = mode == "replace";
    let confirmed = app
        .dialog()
        .message(if replace {
            "Import mode ganti akan menggantikan item aktif di vault PassSa. Lanjutkan?"
        } else {
            "PassSa akan membaca file yang dipilih dan menggabungkan item yang belum ada. Lanjutkan?"
        })
        .title(if replace { "Konfirmasi ganti vault" } else { "Konfirmasi import" })
        .buttons(MessageDialogButtons::OkCancelCustom("Lanjutkan".into(), "Batal".into()))
        .blocking_show();
    if !confirmed {
        return Ok(false);
    }
    *state
        .selected_file
        .lock()
        .map_err(|_| "Pemilihan file tidak tersedia.".to_string())? =
        Some((FilePurpose::Import, path));
    Ok(true)
}

fn create_quick_access_window(app: &AppHandle) -> Result<WebviewWindow, String> {
    if let Some(window) = app.get_webview_window("quick_access") {
        return Ok(window);
    }
    let window = WebviewWindowBuilder::new(
        app,
        "quick_access",
        WebviewUrl::App("quick-access.html".into()),
    )
    .title("PassSa Quick Access")
    .inner_size(420.0, 560.0)
    .min_inner_size(360.0, 300.0)
    .max_inner_size(520.0, 720.0)
    .decorations(false)
    .transparent(true)
    .resizable(false)
    .skip_taskbar(true)
    .always_on_top(true)
    .visible(false)
    .center()
    .build()
    .map_err(|error| format!("Jendela Quick Access gagal dibuat: {error}"))?;
    let window_to_hide = window.clone();
    window.on_window_event(move |event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            let _ = window_to_hide.hide();
        }
    });
    Ok(window)
}

fn toggle_quick_access(app: &AppHandle) -> Result<(), String> {
    let window = create_quick_access_window(app)?;
    if window.is_visible().unwrap_or(false) {
        window.hide().map_err(|error| error.to_string())?;
    } else {
        let theme = app
            .state::<BackendState>()
            .quick_access_theme
            .lock()
            .ok()
            .and_then(|theme| theme.clone());
        if let Some(theme) = theme {
            let _ = window.emit("quick-access:theme", theme);
        }
        window.show().map_err(|error| error.to_string())?;
        window.set_focus().map_err(|error| error.to_string())?;
        let _ = window.emit("quick-access:refresh", ());
    }
    Ok(())
}

#[tauri::command]
fn set_quick_access_theme(
    app: AppHandle,
    state: State<'_, BackendState>,
    theme: String,
    palette: String,
) -> Result<QuickAccessTheme, String> {
    let theme = if theme == "dark" { "dark" } else { "light" }.to_string();
    let palette = match palette.as_str() {
        "rose" | "ocean" | "forest" | "violet" | "sunset" | "amber" | "teal" | "indigo"
        | "coral" | "slate" => palette,
        _ => "rose".to_string(),
    };
    let selected = QuickAccessTheme { theme, palette };
    *state
        .quick_access_theme
        .lock()
        .map_err(|_| "Preferensi tema Quick Access tidak tersedia.".to_string())? =
        Some(selected.clone());
    if let Some(window) = app.get_webview_window("quick_access") {
        let _ = window.emit("quick-access:theme", selected.clone());
    }
    Ok(selected)
}

#[tauri::command]
fn quick_access_theme(state: State<'_, BackendState>) -> Result<Option<QuickAccessTheme>, String> {
    state
        .quick_access_theme
        .lock()
        .map(|theme| theme.clone())
        .map_err(|_| "Preferensi tema Quick Access tidak tersedia.".to_string())
}

#[tauri::command]
fn hide_quick_access(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("quick_access") {
        window.hide().map_err(|error| error.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn set_quick_access_enabled(
    app: AppHandle,
    state: State<'_, BackendState>,
    enabled: bool,
) -> Result<Value, String> {
    let registered = if enabled {
        if app.global_shortcut().is_registered("Alt+Shift+P") {
            true
        } else {
            app.global_shortcut().register("Alt+Shift+P").is_ok()
        }
    } else {
        let _ = app.global_shortcut().unregister("Alt+Shift+P");
        false
    };
    if let Ok(mut runtime) = state.runtime.lock() {
        runtime.quick_access_enabled = enabled;
    }
    Ok(json!({ "ok": true, "quickAccessEnabled": enabled, "quickAccessRegistered": registered }))
}

#[tauri::command]
fn quick_access_status(app: AppHandle, state: State<'_, BackendState>) -> Result<Value, String> {
    let enabled = state
        .runtime
        .lock()
        .map_err(|_| "Backend PassSa sedang tidak tersedia.".to_string())?
        .quick_access_enabled;
    Ok(json!({
        "enabled": enabled,
        "registered": app.global_shortcut().is_registered("Alt+Shift+P"),
    }))
}

#[tauri::command]
fn startup_status(app: AppHandle) -> Result<bool, String> {
    app.autolaunch()
        .is_enabled()
        .map_err(|error| format!("Status startup tidak tersedia: {error}"))
}

#[tauri::command]
fn set_startup_enabled(app: AppHandle, enabled: bool) -> Result<bool, String> {
    let result = if enabled {
        app.autolaunch().enable()
    } else {
        app.autolaunch().disable()
    };
    result.map_err(|error| format!("Pengaturan startup gagal disimpan: {error}"))?;
    app.autolaunch()
        .is_enabled()
        .map_err(|error| format!("Status startup tidak tersedia: {error}"))
}

#[tauri::command]
fn open_external_destination(app: AppHandle, destination: String) -> Result<(), String> {
    let url = match destination.as_str() {
        "repository" => "https://github.com/okkinurf/passsa",
        "releases" => "https://github.com/okkinurf/passsa/releases",
        _ => return Err("Tujuan tautan tidak dikenal.".to_string()),
    };
    app.opener()
        .open_url(url, None::<&str>)
        .map_err(|error| format!("Tautan tidak dapat dibuka: {error}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let shortcut_plugin = tauri_plugin_global_shortcut::Builder::new()
        .with_handler(|app, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                if let Err(error) = toggle_quick_access(app) {
                    eprintln!("PassSa Quick Access tidak dapat dibuka: {error}");
                }
            }
        })
        .build();
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(shortcut_plugin)
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .setup(|app| {
            let runtime = spawn_backend(&app.handle()).map_err(std::io::Error::other)?;
            let quick_access_enabled = runtime.quick_access_enabled;
            app.manage(BackendState {
                runtime: Arc::new(Mutex::new(runtime)),
                clipboard_generation: Arc::new(AtomicU64::new(0)),
                selected_file: Arc::new(Mutex::new(None)),
                quick_access_theme: Arc::new(Mutex::new(None)),
            });
            create_quick_access_window(&app.handle()).map_err(std::io::Error::other)?;
            if quick_access_enabled && app.global_shortcut().register("Alt+Shift+P").is_err() {
                eprintln!("PassSa: shortcut Alt+Shift+P sedang digunakan aplikasi lain.");
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            app_info,
            platform_capabilities,
            backend_request,
            window_minimize,
            window_toggle_maximize,
            window_close,
            set_window_mode,
            pick_vault_export_file,
            pick_vault_import_file,
            hide_quick_access,
            set_quick_access_theme,
            quick_access_theme,
            set_quick_access_enabled,
            quick_access_status,
            startup_status,
            set_startup_enabled,
            open_external_destination
        ])
        .run(tauri::generate_context!())
        .expect("error while running PassSa Tauri application");
}
