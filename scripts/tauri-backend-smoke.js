const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const runtimeDir = path.join(root, '.tauri', 'runtime');
const nodePath = path.join(runtimeDir, process.platform === 'win32' ? 'node.exe' : 'node');
const launcherPath = path.join(runtimeDir, 'launcher.cjs');

async function main() {
  const profileDir = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-tauri-smoke-'));
  const child = spawn(nodePath, [launcherPath, '--passsa-tauri-backend'], {
    cwd: runtimeDir,
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  });
  const lines = readline.createInterface({ input: child.stdout, crlfDelay: Infinity });
  const stderr = [];
  child.stderr.on('data', (chunk) => stderr.push(chunk.toString('utf8')));
  const pending = new Map();
  let gracefulShutdown = true;
  let nextId = 0;
  let readyResolve;
  let readyReject;
  const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });

  lines.on('line', (line) => {
    let message;
    try { message = JSON.parse(line); }
    catch { return readyReject(new Error('Backend sidecar mengirim JSON yang tidak valid.')); }
    if (message.type === 'ready') return readyResolve();
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message));
    else waiter.resolve(message);
  });
  child.once('error', readyReject);
  child.once('exit', (code) => {
    const detail = stderr.join('').slice(-2000);
    readyReject(new Error(`Backend sidecar berhenti sebelum siap (exit ${code}). ${detail}`));
    for (const waiter of pending.values()) waiter.reject(new Error('Backend sidecar berhenti.'));
    pending.clear();
  });

  const request = (channel, ...args) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    child.stdin.write(`${JSON.stringify({ id, channel, args })}\n`, (error) => {
      if (error) { pending.delete(id); reject(error); }
    });
  });

  try {
    child.stdin.write(`${JSON.stringify({
      packaged: false,
      devBypassEnabled: true,
      userDataDir: profileDir,
      secureStorageKeyHex: crypto.randomBytes(32).toString('hex'),
    })}\n`);
    let startupTimer;
    try {
      await Promise.race([
        ready,
        new Promise((_, reject) => { startupTimer = setTimeout(() => reject(new Error('Backend sidecar startup timeout.')), 30_000); }),
      ]);
    } finally {
      clearTimeout(startupTimer);
    }

    const username = `tauri-smoke-${crypto.randomUUID().slice(0, 8)}`;
    const password = `PassSa-${crypto.randomBytes(18).toString('base64url')}`;
    const registered = await request('auth:register', { username, password });
    assert.equal(registered.result?.ok, true, 'registrasi lokal harus berhasil');

    const session = await request('auth:session');
    assert.equal(session.result?.username, username, 'sesi harus aktif setelah registrasi');

    const created = await request('vault:add', {
      type: 'login',
      title: 'Tauri bridge smoke test',
      username: 'smoke-user',
      password: 'not-a-real-credential',
      url: 'https://example.invalid',
    });
    assert.equal(created.result?.ok, true, 'vault item harus dapat dibuat');

    const items = await request('vault:list');
    assert.ok(items.result?.some((item) => item.title === 'Tauri bridge smoke test'), 'vault item harus dapat dibaca');

    const copied = await request('vault:copy-entry', created.result.item.id, 'password');
    assert.equal(copied.clipboardText, 'not-a-real-credential', 'copy harus melewati sidecar ke batas clipboard native');

    const locked = await request('auth:lock');
    assert.equal(locked.result?.ok, true, 'vault harus dapat dikunci');
    assert.equal(await request('auth:session').then((response) => response.result), null, 'sesi harus ditutup setelah lock');
    assert.equal((await request('auth:dev-bypass-status')).result?.enabled, true, 'bypass hanya aktif saat bootstrap development mengizinkannya');
    const bypass = await request('auth:dev-bypass-login');
    assert.equal(bypass.result?.ok, true, 'sesi development harus dapat dibuka tanpa login');
    assert.equal(bypass.result?.user?.username, 'developer', 'bypass memakai akun khusus development');
    console.log('Tauri backend smoke lulus: registrasi lokal, sesi, CRUD vault, copy boundary, lock, dan login bypass development.');
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = new Promise((resolve) => child.once('exit', () => resolve(true)));
      child.stdin.end();
      let shutdownTimer;
      gracefulShutdown = await Promise.race([
        exited,
        new Promise((resolve) => { shutdownTimer = setTimeout(() => resolve(false), 5_000); }),
      ]);
      clearTimeout(shutdownTimer);
      if (!gracefulShutdown) {
        child.kill();
        await new Promise((resolve) => {
          if (child.exitCode !== null || child.signalCode !== null) resolve();
          else child.once('exit', resolve);
        });
      }
    }
    lines.close();
    await fs.rm(profileDir, { recursive: true, force: true });
  }
  assert.equal(gracefulShutdown, true, 'backend sidecar harus berhenti saat saluran parent ditutup, tanpa meninggalkan proses yatim');
}

main().catch((error) => {
  console.error(`Tauri backend smoke gagal: ${error.message}`);
  process.exitCode = 1;
});
