const native = (payload) => new Promise((resolve) => chrome.runtime.sendMessage({ type: 'native-request', payload }, resolve));

async function inject(tabId) {
  await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
}

async function run() {
  const status = document.querySelector('#status');
  const list = document.querySelector('#list');
  const host = document.querySelector('#host');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !/^https?:/i.test(tab.url || '')) {
    status.textContent = 'Buka halaman login HTTP/HTTPS terlebih dahulu.';
    return;
  }
  try { host.textContent = new URL(tab.url).hostname; } catch { host.textContent = ''; }
  const result = await native({ action: 'list', url: tab.url });
  if (!result.ok) { status.textContent = result.message || 'PassSa belum siap.'; return; }
  if (!result.matches.length) { status.textContent = 'Tidak ada credential yang cocok dengan host ini.'; return; }
  status.textContent = `${result.matches.length} credential cocok. Pilih untuk mengisi.`;
  for (const item of result.matches) {
    const button = document.createElement('button');
    button.className = 'credential';
    button.type = 'button';
    button.innerHTML = `<span><strong></strong><small></small></span><i>Isi</i>`;
    button.querySelector('strong').textContent = item.title || item.url;
    button.querySelector('small').textContent = item.username || 'Tanpa username';
    button.addEventListener('click', async () => {
      button.disabled = true;
      const secret = await native({ action: 'get', id: item.id, url: tab.url });
      if (!secret.ok) { status.textContent = secret.message || 'Credential gagal diambil.'; button.disabled = false; return; }
      try {
        await inject(tab.id);
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'fill', credential: secret.credential });
        status.textContent = response?.ok ? 'Credential berhasil diisi.' : 'Field login tidak ditemukan.';
        if (response?.ok) setTimeout(() => window.close(), 450);
      } catch (error) { status.textContent = error.message || 'Field login tidak dapat diisi.'; }
      button.disabled = false;
    });
    list.appendChild(button);
  }
}

document.querySelector('#open-app').addEventListener('click', async () => {
  await native({ action: 'open' });
  window.close();
});
run();
