const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('aviso', { aceptar: () => ipcRenderer.send('aceptar') });
