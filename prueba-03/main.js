// Prueba desechable de task-03. No es el proyecto final.
const { app, BrowserWindow, screen, ipcMain } = require('electron');
const { execFile } = require('child_process');
const path = require('path');

const WIDGET = { width: 640, height: 476 };
const AVISO = { width: 320, height: 120 };

// Pantalla 1 = principal, Pantalla 2 = la otra (DESIGN-SYSTEM sección 13).
function pantalla(numero) {
  const todas = screen.getAllDisplays();
  const principal = screen.getPrimaryDisplay();
  const otras = todas.filter((d) => d.id !== principal.id);
  return numero === 2 && otras.length ? otras[0] : principal;
}

function pegarAlEscritorio(win) {
  const hwnd = win.getNativeWindowHandle().readBigUInt64LE(0).toString();
  execFile('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File',
    path.join(__dirname, 'escritorio.ps1'), hwnd], (err, out) => {
    console.log('pegar al escritorio:', err ? err.message : out.trim());
  });
}

function crearWidget(d) {
  const wa = d.workArea;
  const win = new BrowserWindow({
    ...WIDGET,
    x: wa.x + Math.round((wa.width - WIDGET.width) / 2), // posición 5 (centro)
    y: wa.y + Math.round((wa.height - WIDGET.height) / 2),
    frame: false,
    resizable: false,
    skipTaskbar: true,
    focusable: false, // al hacer clic no sube sobre las demás ventanas
    backgroundMaterial: 'acrylic', // desenfoque real del fondo (Windows 11)
    backgroundColor: '#00000000',
    show: false,
  });
  win.loadFile('widget.html');
  win.once('ready-to-show', () => {
    win.showInactive();
    pegarAlEscritorio(win);
  });
  return win;
}

function crearAviso(d) {
  const wa = d.workArea;
  const win = new BrowserWindow({
    ...AVISO,
    x: wa.x + wa.width - AVISO.width - 32,
    y: wa.y + 32,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    focusable: false, // no roba el foco al escribir
    alwaysOnTop: true,
    backgroundMaterial: 'acrylic',
    backgroundColor: '#00000000',
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.loadFile('aviso.html');
  win.once('ready-to-show', () => win.showInactive());
  return win;
}

app.whenReady().then(() => {
  const arg = process.argv.find((a) => a.startsWith('--pantalla='));
  const d = pantalla(arg ? Number(arg.split('=')[1]) : 1);
  crearWidget(d);
  // El aviso aparece a los 5 s, para dar tiempo a ponerse a escribir en otra app.
  setTimeout(() => crearAviso(d), 5000);
  ipcMain.on('aceptar', (e) => BrowserWindow.fromWebContents(e.sender).close());
});

app.on('window-all-closed', () => {}); // el widget sigue vivo aunque se cierre el aviso
