const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('widget', {
  leerModo: () => ipcRenderer.invoke('modo:leer'),
  cambiarModo: (modo) => ipcRenderer.send('modo:cambiar', modo),
  alCambiarModo: (fn) => ipcRenderer.on('modo', (_e, modo) => fn(modo)),
  cerrar: () => ipcRenderer.send('app:cerrar'),
});
