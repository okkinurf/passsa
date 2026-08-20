const NATIVE_HOST = 'com.passsa.native';

function nativeRequest(payload) {
  return new Promise((resolve) => {
    chrome.runtime.sendNativeMessage(NATIVE_HOST, payload, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ ok: false, code: 'NATIVE_ERROR', message: chrome.runtime.lastError.message });
        return;
      }
      resolve(response || { ok: false, code: 'EMPTY_RESPONSE', message: 'PassSa tidak mengembalikan respons.' });
    });
  });
}

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function injectContent(tabId) {
  await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
}

async function fillSingleMatch(tab) {
  if (!tab?.id || !/^https?:/i.test(tab.url || '')) return { ok: false, code: 'UNSUPPORTED_PAGE', message: 'Halaman ini tidak mendukung autofill.' };
  const list = await nativeRequest({ action: 'list', url: tab.url });
  if (!list.ok) return list;
  if (list.matches.length !== 1) return { ok: false, code: 'CHOOSE_ITEM', matches: list.matches, message: list.matches.length ? 'Pilih credential yang ingin diisi.' : 'Tidak ada credential yang cocok.' };
  const credential = await nativeRequest({ action: 'get', id: list.matches[0].id, url: tab.url });
  if (!credential.ok) return credential;
  await injectContent(tab.id);
  return new Promise((resolve) => chrome.tabs.sendMessage(tab.id, { type: 'fill', credential: credential.credential }, (response) => {
    if (chrome.runtime.lastError) resolve({ ok: false, code: 'CONTENT_ERROR', message: chrome.runtime.lastError.message });
    else resolve(response || { ok: false, code: 'CONTENT_EMPTY', message: 'Form login tidak ditemukan.' });
  }));
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'native-request') return false;
  nativeRequest(message.payload).then(sendResponse);
  return true;
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'fill-current') return;
  const tab = await activeTab();
  const result = await fillSingleMatch(tab);
  if (!result.ok && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'notice', text: result.message || 'Autofill gagal.' }).catch(() => undefined);
  }
});
