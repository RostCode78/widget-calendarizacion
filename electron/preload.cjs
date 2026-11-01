const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('widget', {
  leerEstado: () => ipcRenderer.invoke('estado:leer'),
  cambiar: (parcial) => ipcRenderer.send('estado:cambiar', parcial),
  alCambiarEstado: (fn) => ipcRenderer.on('estado', (_e, estado) => fn(estado)),
  altoConfiguracion: (alto) => ipcRenderer.send('configuracion:alto', alto),
  identificarPantallas: () => ipcRenderer.send('pantallas:identificar'),
  fondoDeEscritorio: () => ipcRenderer.invoke('escritorio:fondo'),
  conectarNotion: (clave) => ipcRenderer.invoke('notion:conectar', clave),
  desconectarNotion: () => ipcRenderer.send('notion:desconectar'),
  conectarGoogle: () => ipcRenderer.invoke('google:conectar'),
  desconectarGoogle: () => ipcRenderer.send('google:desconectar'),
  aceptarAviso: (clave) => ipcRenderer.send('aviso:aceptar', clave),
  marcarTarea: (id, estado) => ipcRenderer.send('tarea:marcar', id, estado),
  alternarCatalogo: () => ipcRenderer.send('catalogo:alternar'),
  cerrar: () => ipcRenderer.send('app:cerrar'),
});
