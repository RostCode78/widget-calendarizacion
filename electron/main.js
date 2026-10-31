import { app, BrowserWindow, ipcMain, nativeTheme, screen } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const devUrl = process.env.VITE_DEV_SERVER_URL;
let modo = 'oscuro';
// El cristal de Windows toma su tinte del tema: debe seguir al modo del widget, no al del sistema.
const temaWindows = () => (nativeTheme.themeSource = modo === 'oscuro' ? 'dark' : 'light');
temaWindows();

// Cada vista es la misma app con otra ruta (#/fondo, #/muestra/colores...).
function cargar(win, ruta) {
  if (devUrl) win.loadURL(`${devUrl}#${ruta}`);
  else win.loadFile(path.join(dir, '../dist/index.html'), { hash: ruta });
}

const preferencias = { preload: path.join(dir, 'preload.cjs') };

// Ventana con cristal real de Windows 11. Las esquinas las redondea Windows (~8 px).
export function ventanaCristal({ ruta, ...opciones }) {
  const win = new BrowserWindow({
    frame: false,
    resizable: false,
    skipTaskbar: true,
    backgroundMaterial: 'acrylic',
    backgroundColor: '#00000000',
    show: false,
    webPreferences: preferencias,
    ...opciones,
  });
  cargar(win, ruta);
  win.once('ready-to-show', () => win.showInactive());
  return win;
}

// Página interna de pruebas: un fondo a pantalla completa y el catálogo de componentes en cristal encima.
function abrirPruebas() {
  const { x, y, width, height } = screen.getPrimaryDisplay().bounds;
  const fondo = new BrowserWindow({ x, y, width, height, frame: false, show: false, webPreferences: preferencias });
  cargar(fondo, '/fondo');
  fondo.once('ready-to-show', () => fondo.show());
  fondo.on('closed', () => app.quit());

  ventanaCristal({ ruta: '/catalogo', parent: fondo, x: x + 40, y: y + 32, width: width - 80, height: height - 120 });
}

ipcMain.handle('modo:leer', () => modo);
ipcMain.on('modo:cambiar', (_e, nuevo) => {
  modo = nuevo;
  temaWindows();
  for (const w of BrowserWindow.getAllWindows()) w.webContents.send('modo', modo);
});
ipcMain.on('app:cerrar', () => app.quit());

app.whenReady().then(abrirPruebas);
