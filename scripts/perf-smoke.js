const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const os = require('node:os');

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.disableHardwareAcceleration();
app.setPath('userData', path.join(os.tmpdir(), `passsa-perf-${process.pid}`));

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function waitFor(win, expression, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await win.webContents.executeJavaScript(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timeout performance smoke: ${expression}`);
}

app.whenReady().then(async () => {
  const itemCount = 1000;
  process.env.PASSA_E2E_ITEMS = String(itemCount);
  const win = new BrowserWindow({
    show: false,
    width: 1120,
    height: 760,
    webPreferences: {
      preload: path.join(__dirname, 'e2e-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  try {
    await win.loadFile(path.join(__dirname, '..', 'src', 'index.html'));
    // A hidden Chromium window throttles requestAnimationFrame to roughly 1 Hz,
    // which would measure the test harness rather than the visible app.
    win.showInactive();
    await win.webContents.executeJavaScript(`
      document.querySelector('#username').value = 'qa@example.test';
      document.querySelector('#password').value = 'password-qa';
      document.querySelector('#auth-form').requestSubmit();
    `);
    await waitFor(win, "!document.querySelector('#vault-view').classList.contains('hidden')");
    const result = await win.webContents.executeJavaScript(`(async () => {
      try {
      const input = document.querySelector('#search-input');
      const samples = [];
      const queries = ['entry', 'benchmark', 'qa-9', 'generated', 'tidak-ada'];
      const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
      for (const query of queries) {
        const start = performance.now();
        input.value = query;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await nextFrame();
        await nextFrame();
        samples.push({ query, duration: performance.now() - start, rows: document.querySelectorAll('.vault-item').length });
      }
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await nextFrame();
      await nextFrame();
      const scroll = document.querySelector('.items-scroll');
      scroll.style.scrollBehavior = 'auto';
      scroll.scrollTop = scroll.scrollHeight;
      scroll.dispatchEvent(new Event('scroll', { bubbles: true }));
      await nextFrame();
      await nextFrame();
      return {
        samples,
        visibleRows: document.querySelectorAll('.vault-item').length,
        bottomRow: document.querySelector('.vault-item:last-of-type')?.dataset.id || null,
        scrollTop: scroll.scrollTop,
        scrollHeight: scroll.scrollHeight,
        heap: performance.memory ? performance.memory.usedJSHeapSize : null,
      };
      } catch (error) {
        return { rendererError: error?.stack || String(error) };
      }
    })()`);
    assert(!result.rendererError, `Skrip renderer performance gagal: ${result.rendererError}`);
    const durations = result.samples.map((sample) => sample.duration);
    const maxDuration = Math.max(...durations);
    const averageDuration = durations.reduce((sum, value) => sum + value, 0) / durations.length;
    assert(maxDuration < 100, `Pencarian melewati 100 ms: ${JSON.stringify(result.samples)}`);
    assert(result.visibleRows < 100 && result.scrollHeight > 50000 && result.scrollTop > 1000, `Virtualisasi scroll tidak aktif: ${JSON.stringify(result)}`);
    console.log(JSON.stringify({ itemCount, maxSearchMs: Number(maxDuration.toFixed(2)), averageSearchMs: Number(averageDuration.toFixed(2)), ...result }));
  } finally {
    if (!win.isDestroyed()) win.destroy();
    app.quit();
  }
}).catch((error) => {
  console.error(error.stack || error.message);
  app.exit(1);
});
