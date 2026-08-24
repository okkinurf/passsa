use serde::Serialize;

#[derive(Debug, Serialize)]
struct AppInfo {
    name: &'static str,
    version: &'static str,
    runtime: &'static str,
    mobile_ready: bool,
}

#[tauri::command]
fn app_info() -> AppInfo {
    AppInfo {
        name: "PassSa",
        version: env!("CARGO_PKG_VERSION"),
        runtime: "tauri-v2",
        mobile_ready: true,
    }
}

#[tauri::command]
fn platform_capabilities() -> Vec<&'static str> {
    vec![
        "encrypted-vault-contract",
        "responsive-web-frontend",
        "platform-capability-boundary",
    ]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![app_info, platform_capabilities])
        .run(tauri::generate_context!())
        .expect("error while running PassSa Tauri application");
}
