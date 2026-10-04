(() => {
  const tauri = window.__TAURI__;
  const invoke = tauri?.core?.invoke || tauri?.invoke;
  if (typeof invoke !== 'function') return;

  const backend = (channel, ...args) => invoke('backend_request', { channel, args });
  const subscribe = (name, callback) => {
    if (typeof callback !== 'function' || !tauri.event?.listen) return () => undefined;
    let unlisten = () => undefined;
    tauri.event.listen(name, (event) => callback(event.payload))
      .then((stop) => { unlisten = stop; })
      .catch(() => undefined);
    return () => unlisten();
  };
  const subscribeTheme = async (callback) => {
    if (typeof callback !== 'function' || !tauri.event?.listen) return () => undefined;
    try {
      let receivedThemeEvent = false;
      const unlisten = await tauri.event.listen('quick-access:theme', (event) => {
        receivedThemeEvent = true;
        callback(event.payload);
      });
      try {
        const initialTheme = await invoke('quick_access_theme');
        if (!receivedThemeEvent && initialTheme) callback(initialTheme);
      } catch { /* Tema tersimpan tetap menjadi fallback. */ }
      return unlisten;
    } catch {
      return () => undefined;
    }
  };

  window.passsaQuick = {
    list: () => backend('quick-access:list'),
    totpCodes: (ids) => backend('quick-access:totp-codes', ids),
    clearRecent: () => backend('quick-access:clear-recent'),
    copy: (id, field) => backend('quick-access:copy', { id, field }),
    getNote: (id) => backend('quick-access:get-note', id),
    useNote: (id) => backend('quick-access:use-note', id),
    openItem: (id) => backend('quick-access:open-item', id),
    togglePin: (id) => backend('quick-access:toggle-pin', id),
    close: () => invoke('hide_quick_access'),
    onRefresh: (callback) => subscribe('quick-access:refresh', callback),
    onTheme: subscribeTheme,
  };
})();
