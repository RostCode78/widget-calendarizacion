const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('widget', {
  leerEstado: () => ipcRenderer.invoke('estado:leer'),
  cambiar: (parcial) => ipcRenderer.send('estado:cambiar', parcial),
  alCambiarEstado: (fn) => ipcRenderer.on('estado', (_e, estado) => fn(estado)),
  alternarCatalogo: () => ipcRenderer.send('catalogo:alternar'),
  cerrar: () => ipcRenderer.send('app:cerrar'),
});
