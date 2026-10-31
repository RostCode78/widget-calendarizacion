import { app, BrowserWindow, ipcMain, nativeTheme, screen } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pegarAlEscritorio, MENSAJE_EXPLORADOR } from './escritorio.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const devUrl = process.env.VITE_DEV_SERVER_URL;
const pruebas = Boolean(devUrl) || process.argv.includes('--pruebas');

// Estado que comparten todas las ventanas. `escenario` elige los datos de ejemplo (task-06).
const estado = { modo: 'oscuro', escenario: 'normal', horaVisible: true, panelAbierto: false, ladoPanel: 'izquierda' };

// El cristal de Windows toma su tinte del tema: debe seguir al modo del widget, no al del sistema.
const temaWindows = () => (nativeTheme.themeSource = estado.modo === 'oscuro' ? 'dark' : 'light');

// Cada vista es la misma app con otra ruta (#/modulo/hoy, #/catalogo...).
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
  return win;
}

// ---- Widget en reposo: una ventana por módulo (640 × 476, DESIGN-SYSTEM sección 16) ----

const WIDGET = { width: 640, height: 476 };
const MODULOS = {
  hora: { x: 0, y: 0, width: 288, height: 160 },
  calendario: { x: 0, y: 172, width: 288, height: 304 },
  hoy: { x: 300, y: 0, width: 340, height: 272 },
  semana: { x: 300, y: 284, width: 340, height: 192 },
};
const PANEL = { width: 340, height: 680 };
const posicion = 6; // Se elige en la configuración (task-07); el diseño usa la 6.
const ventanas = {};
let fondo = null;
let panel = null;

// Esquina superior izquierda del widget en la posición 1–9 de la cuadrícula 3 × 3.
function origenWidget(display) {
  const { bounds: b, workArea: wa } = display;
  const columna = (posicion - 1) % 3;
  const fila = Math.floor((posicion - 1) / 3);
  const x = [b.x + 64, b.x + (b.width - WIDGET.width) / 2, b.x + b.width - 64 - WIDGET.width][columna];
  const y = [b.y + 64, b.y + (b.height - WIDGET.height) / 2, wa.y + wa.height - 64 - WIDGET.height][fila];
  return { x: Math.round(x), y: Math.round(y), columna };
}

function limites(nombre, origen) {
  const m = nombre === 'calendario' && !estado.horaVisible ? { ...MODULOS.calendario, y: 0, height: WIDGET.height } : MODULOS[nombre];
  return { x: origen.x + m.x, y: origen.y + m.y, width: m.width, height: m.height };
}

// Pega una ventana del widget; el fondo de pruebas se vuelve a mandar debajo de todo.
function pegar(win) {
  pegarAlEscritorio(win);
  if (fondo && win !== fondo) pegarAlEscritorio(fondo);
}

function mostrarPegada(win) {
  win.once('ready-to-show', () => {
    win.showInactive();
    pegar(win);
  });
}

function crearWidget() {
  const origen = origenWidget(screen.getPrimaryDisplay());
  estado.ladoPanel = origen.columna === 0 ? 'derecha' : 'izquierda';
  for (const nombre of Object.keys(MODULOS)) {
    // focusable: false → no recibe foco ni sube sobre otras ventanas al hacer clic.
    const win = ventanaCristal({ ruta: `/modulo/${nombre}`, focusable: false, ...limites(nombre, origen) });
    ventanas[nombre] = win;
    if (nombre !== 'hora' || estado.horaVisible) mostrarPegada(win);
  }
  // Si el Explorador se reinicia, el escritorio es una ventana nueva: hay que volver a pegar.
  ventanas.hoy.hookWindowMessage(MENSAJE_EXPLORADOR, () => setTimeout(repegarTodo, 1000));
}

function repegarTodo() {
  for (const win of [...Object.values(ventanas), panel]) if (win && !win.isDestroyed() && win.isVisible()) pegar(win);
}

// Lista abierta (sección 12 y 16): hacia el lado con más espacio, a 12 px, centrada con el widget.
function abrirPanel() {
  const display = screen.getPrimaryDisplay();
  const origen = origenWidget(display);
  const wa = display.workArea;
  const x = estado.ladoPanel === 'derecha' ? origen.x + WIDGET.width + 12 : origen.x - 12 - PANEL.width;
  const centrado = origen.y + WIDGET.height / 2 - PANEL.height / 2;
  const y = Math.min(Math.max(centrado, wa.y + 16), wa.y + wa.height - 16 - PANEL.height);
  panel = ventanaCristal({ ruta: '/panel/hoy', focusable: false, x, y: Math.round(y), ...PANEL });
  mostrarPegada(panel);
  panel.on('closed', () => {
    panel = null;
    if (estado.panelAbierto) cambiar({ panelAbierto: false });
  });
}

// Aplica a las ventanas lo que cambió y avisa a todas.
function cambiar(parcial) {
  const antes = { ...estado };
  Object.assign(estado, parcial);
  if (estado.modo !== antes.modo) temaWindows();
  if (estado.horaVisible !== antes.horaVisible) {
    const origen = origenWidget(screen.getPrimaryDisplay());
    ventanas.calendario.setBounds(limites('calendario', origen));
    if (estado.horaVisible) {
      ventanas.hora.showInactive();
      pegar(ventanas.hora);
    } else ventanas.hora.hide();
  }
  if (estado.panelAbierto && !panel) abrirPanel();
  if (!estado.panelAbierto && panel) panel.close();
  for (const w of BrowserWindow.getAllWindows()) w.webContents.send('estado', estado);
}

// ---- Página interna de pruebas: un fondo de Figma debajo del widget y el catálogo aparte ----

let catalogo = null;

function abrirPruebas() {
  const { x, y, width, height } = screen.getPrimaryDisplay().bounds;
  fondo = new BrowserWindow({ x, y, width, height, frame: false, skipTaskbar: true, focusable: false, show: false, webPreferences: preferencias });
  cargar(fondo, '/fondo');
  mostrarPegada(fondo);
  fondo.on('closed', () => app.quit());
}

function alternarCatalogo() {
  if (catalogo) return catalogo.close();
  const { x, y, width, height } = screen.getPrimaryDisplay().bounds;
  catalogo = ventanaCristal({ ruta: '/catalogo', x: x + 40, y: y + 32, width: width - 80, height: height - 120 });
  catalogo.once('ready-to-show', () => catalogo.show());
  catalogo.on('closed', () => (catalogo = null));
}

ipcMain.handle('estado:leer', () => estado);
ipcMain.on('estado:cambiar', (_e, parcial) => cambiar(parcial));
ipcMain.on('catalogo:alternar', alternarCatalogo);
ipcMain.on('app:cerrar', () => app.quit());

app.whenReady().then(() => {
  temaWindows();
  if (pruebas) abrirPruebas();
  crearWidget();
});
