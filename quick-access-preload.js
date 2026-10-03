const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('passsaQuick', {
  list: () => ipcRenderer.invoke('quick-access:list'),
  totpCodes: (ids) => ipcRenderer.invoke('quick-access:totp-codes', ids),
  clearRecent: () => ipcRenderer.invoke('quick-access:clear-recent'),
  copy: (id, field) => ipcRenderer.invoke('quick-access:copy', { id, field }),
  getNote: (id) => ipcRenderer.invoke('quick-access:get-note', id),
  useNote: (id) => ipcRenderer.invoke('quick-access:use-note', id),
  openItem: (id) => ipcRenderer.invoke('quick-access:open-item', id),
  togglePin: (id) => ipcRenderer.invoke('quick-access:toggle-pin', id),
  close: () => ipcRenderer.send('quick-access:close'),
  onRefresh: (callback) => ipcRenderer.on('quick-access:refresh', () => callback()),
  onTheme: (callback) => ipcRenderer.on('quick-access:theme', (_event, theme) => callback(theme)),
});
