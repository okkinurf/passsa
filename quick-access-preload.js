const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('passsaQuick', {
  list: () => ipcRenderer.invoke('quick-access:list'),
  copy: (id, field) => ipcRenderer.invoke('quick-access:copy', { id, field }),
  togglePin: (id) => ipcRenderer.invoke('quick-access:toggle-pin', id),
  close: () => ipcRenderer.send('quick-access:close'),
  onRefresh: (callback) => ipcRenderer.on('quick-access:refresh', () => callback()),
});
