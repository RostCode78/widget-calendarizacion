import { app, BrowserWindow, globalShortcut, Menu, Tray, ipcMain, nativeImage, nativeTheme, powerMonitor, screen, systemPreferences } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pegarAlEscritorio, MENSAJE_EXPLORADOR } from './escritorio.js';
import { leerConfiguracion, guardarConfiguracion } from './configuracion.js';
import { crearSincronizador } from './tareas.js';
import { crearSincronizadorCalendario } from './calendario.js';
import { avisosPendientes } from './avisos.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const devUrl = process.env.VITE_DEV_SERVER_URL;
const pruebas = Boolean(devUrl) || process.argv.includes('--pruebas');

// Estado que comparten todas las ventanas. Lo guardable viene de configuracion.json.
// `escenario`: 'real' muestra las tareas de Notion; los demás, datos de ejemplo (página de pruebas).
const estado = {
  ...leerConfiguracion(),
  escenario: 'real',
  tareas: [],
  notion: { conectada: false, base: null, error: null, actualizado: null },
  eventos: [],
  google: { conectada: false, calendario: null, error: null, actualizado: null },
  avisos: [],
  panelAbierto: false,
  configAbierta: false,
  ladoLateral: 'izquierda',
  hayPantalla2: false,
};

// El cristal de Windows toma su tinte del tema: debe seguir al modo del widget, no al del sistema.
const temaWindows = () => (nativeTheme.themeSource = estado.modo === 'oscuro' ? 'dark' : 'light');

// Cada vista es la misma app con otra ruta (#/modulo/hoy, #/configuracion...).
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

// ---- Pantallas y posiciones (DESIGN-SYSTEM sección 16) ----

const WIDGET = { width: 640, height: 476 };
const MODULOS = {
  hora: { x: 0, y: 0, width: 288, height: 160 },
  calendario: { x: 0, y: 172, width: 288, height: 304 },
  hoy: { x: 300, y: 0, width: 340, height: 272 },
  semana: { x: 300, y: 284, width: 340, height: 192 },
};
const PANEL = { width: 340, height: 680 };
const CONFIG_ANCHO = 520;

// Pantalla 1 = la principal; Pantalla 2 = la otra. Sin segunda pantalla, se usa la 1.
function pantalla(numero) {
  const principal = screen.getPrimaryDisplay();
  const otra = screen.getAllDisplays().find((d) => d.id !== principal.id);
  return numero === 2 && otra ? otra : principal;
}

// Esquina superior izquierda del widget en la posición 1–9. Margen de 64 px al borde y
// la fila de abajo respeta la barra de tareas; en 1920 × 1080 da x 64/640/1216, y 64/302/492.
function origenWidget() {
  const { bounds: b, workArea: wa } = pantalla(estado.pantalla);
  const posicion = estado.posiciones[estado.pantalla];
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

// Ventanas laterales (lista abierta, configuración): hacia el lado con más espacio, a 12 px.
// Con el widget en la columna izquierda van a la derecha; en el centro y la derecha, a la izquierda.
function xLateral(origen, ancho) {
  return origen.columna === 0 ? origen.x + WIDGET.width + 12 : origen.x - 12 - ancho;
}

function limitesPanel(origen) {
  const wa = pantalla(estado.pantalla).workArea;
  const centrado = origen.y + WIDGET.height / 2 - PANEL.height / 2;
  const y = Math.min(Math.max(centrado, wa.y + 16), wa.y + wa.height - 16 - PANEL.height);
  return { x: xLateral(origen, PANEL.width), y: Math.round(y), ...PANEL };
}

// La configuración se centra en vertical en el área útil de la pantalla, sin importar el widget.
function limitesConfig(origen, alto) {
  const wa = pantalla(estado.pantalla).workArea;
  return { x: xLateral(origen, CONFIG_ANCHO), y: Math.round(wa.y + (wa.height - alto) / 2), width: CONFIG_ANCHO, height: alto };
}

// Mueve una ventana en 250 ms con curva suave, salvo que Windows pida reducir animaciones.
function animar(win, destino) {
  const inicio = win.getBounds();
  if (!systemPreferences.getAnimationSettings().shouldRenderRichAnimation) return win.setBounds(destino);
  const t0 = Date.now();
  const paso = () => {
    if (win.isDestroyed()) return;
    const t = Math.min((Date.now() - t0) / 250, 1);
    const k = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    const v = (a, b) => Math.round(a + (b - a) * k);
    win.setBounds({ x: v(inicio.x, destino.x), y: v(inicio.y, destino.y), width: v(inicio.width, destino.width), height: v(inicio.height, destino.height) });
    if (t < 1) setTimeout(paso, 16);
  };
  paso();
}

// ---- Widget en reposo: una ventana por módulo ----

const ventanas = {};
let fondo = null;
let panel = null;
let config = null;
let altoConfig = 816;

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
  const origen = origenWidget();
  estado.ladoLateral = origen.columna === 0 ? 'derecha' : 'izquierda';
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

// Coloca el widget (y lo que cuelga de él) en la pantalla y posición actuales.
function colocarWidget() {
  const origen = origenWidget();
  estado.ladoLateral = origen.columna === 0 ? 'derecha' : 'izquierda';
  for (const [nombre, win] of Object.entries(ventanas)) win.setBounds(limites(nombre, origen));
  if (panel) animar(panel, limitesPanel(origen));
  if (config) animar(config, limitesConfig(origen, altoConfig));
  actualizarAvisos(); // también cambian de esquina o de pantalla
}

function abrirPanel() {
  panel = ventanaCristal({ ruta: '/panel/hoy', focusable: false, ...limitesPanel(origenWidget()) });
  mostrarPegada(panel);
  panel.on('closed', () => {
    panel = null;
    if (estado.panelAbierto) cambiar({ panelAbierto: false });
  });
}

// Configuración: ventana normal (sí recibe foco: tiene campos). Esc o la X la cierran.
function abrirConfig() {
  config = ventanaCristal({ ruta: '/configuracion', ...limitesConfig(origenWidget(), altoConfig) });
  config.once('ready-to-show', () => config.show());
  config.on('closed', () => {
    config = null;
    if (estado.configAbierta) cambiar({ configAbierta: false });
  });
}

// Aplica a las ventanas lo que cambió, guarda lo guardable y avisa a todas.
function cambiar(parcial) {
  const antes = { ...estado, posiciones: { ...estado.posiciones } };
  Object.assign(estado, parcial);
  // Las ventanas laterales van una a la vez: abrir una cierra la otra (sección 16).
  if (parcial.configAbierta) estado.panelAbierto = false;
  if (parcial.panelAbierto) estado.configAbierta = false;

  if (estado.modo !== antes.modo) temaWindows();
  if (estado.horaVisible !== antes.horaVisible) {
    if (estado.horaVisible) {
      ventanas.hora.showInactive();
      pegar(ventanas.hora);
    } else ventanas.hora.hide();
  }
  const seMovio = estado.pantalla !== antes.pantalla
    || estado.posiciones[estado.pantalla] !== antes.posiciones[estado.pantalla]
    || estado.horaVisible !== antes.horaVisible;
  if (seMovio) colocarWidget();

  if (estado.panelAbierto && !panel) abrirPanel();
  if (!estado.panelAbierto && panel) panel.close();
  if (estado.configAbierta && !config) abrirConfig();
  if (!estado.configAbierta && config) config.close();

  actualizarAvisos();
  guardarConfiguracion(estado);
  difundir();
}

const difundir = () => {
  for (const w of BrowserWindow.getAllWindows()) w.webContents.send('estado', estado);
};

// ---- Avisos de inicio y de fin (task-10, secciones 8, 16 y 17) ----

const AVISO = { width: 320, height: 128 };
const ventanasAviso = new Map(); // clave del aviso → su ventana

// Esquina superior derecha a 32 px; con el widget en la columna derecha (3, 6, 9), la izquierda.
// Varios avisos se apilan hacia abajo con 12 px de separación.
function limitesAviso(i) {
  const wa = pantalla(estado.pantalla).workArea;
  const x = origenWidget().columna === 2 ? wa.x + 32 : wa.x + wa.width - 32 - AVISO.width;
  return { x, y: wa.y + 32 + i * (AVISO.height + 12), ...AVISO };
}

// Abre, acomoda y cierra las ventanas de aviso según las tareas y la hora. Un aviso solo se va
// cuando su tarea cambia de estado (al aceptarlo). Devuelve true si cambió la lista.
function actualizarAvisos() {
  const avisos = avisosPendientes(estado.tareas);
  const cambio = avisos.map((a) => a.clave).join() !== estado.avisos.map((a) => a.clave).join();
  estado.avisos = avisos;
  for (const [clave, win] of ventanasAviso) {
    if (avisos.some((a) => a.clave === clave)) continue;
    win.close();
    ventanasAviso.delete(clave);
  }
  avisos.forEach((aviso, i) => {
    const lugar = limitesAviso(i);
    const abierta = ventanasAviso.get(aviso.clave);
    if (abierta) {
      const { x, y } = abierta.getBounds();
      if (x !== lugar.x || y !== lugar.y) animar(abierta, lugar);
      return;
    }
    // Encima de todo, pero sin foco: no interrumpe lo que Rost esté escribiendo.
    const win = ventanaCristal({ ruta: `/aviso/${aviso.clave}`, focusable: false, ...lugar });
    win.setAlwaysOnTop(true, 'screen-saver');
    win.once('ready-to-show', () => win.showInactive());
    ventanasAviso.set(aviso.clave, win);
  });
  atajoDeAvisos();
  return cambio;
}

// Aceptar el aviso de inicio empieza la tarea; el de fin la termina. Se escribe en Notion.
function aceptarAviso(clave) {
  const aviso = estado.avisos.find((a) => a.clave === clave);
  if (aviso) notion.marcar(aviso.id, aviso.tipo === 'inicio' ? 'enCurso' : 'hecha');
}
ipcMain.on('aviso:aceptar', (_e, clave) => aceptarAviso(clave));

// Teclado (task-11): como los avisos no reciben foco, Ctrl+Alt+Enter acepta el de arriba desde
// cualquier app. El atajo solo se reserva mientras hay avisos.
const ATAJO = 'Control+Alt+Enter';
function atajoDeAvisos() {
  const hay = estado.avisos.length > 0;
  if (hay && !globalShortcut.isRegistered(ATAJO)) globalShortcut.register(ATAJO, () => estado.avisos[0] && aceptarAviso(estado.avisos[0].clave));
  if (!hay && globalShortcut.isRegistered(ATAJO)) globalShortcut.unregister(ATAJO);
}

// "Identificar pantallas": un número grande en cada monitor durante 3 segundos.
function identificarPantallas() {
  const principal = screen.getPrimaryDisplay();
  const otras = screen.getAllDisplays().filter((d) => d.id !== principal.id);
  [principal, ...otras.slice(0, 1)].forEach((d, i) => {
    const { x, y, width, height } = d.workArea;
    const win = ventanaCristal({ ruta: `/identificar/${i + 1}`, focusable: false, alwaysOnTop: true, x: x + width / 2 - 80, y: y + height / 2 - 80, width: 160, height: 160 });
    win.once('ready-to-show', () => win.showInactive());
    setTimeout(() => !win.isDestroyed() && win.close(), 3000);
  });
}

// Miniatura del fondo de escritorio de Windows para la vista previa de Posición.
function fondoDeEscritorio() {
  const archivo = path.join(app.getPath('appData'), 'Microsoft/Windows/Themes/TranscodedWallpaper');
  if (!fs.existsSync(archivo)) return null;
  const imagen = nativeImage.createFromPath(archivo);
  return imagen.isEmpty() ? null : imagen.resize({ width: 480 }).toDataURL();
}

function actualizarPantallas() {
  const hay = screen.getAllDisplays().length > 1;
  if (hay !== estado.hayPantalla2) cambiar({ hayPantalla2: hay });
  // Siempre se recoloca: sin la pantalla 2, el widget pasa a la principal (y vuelve al reconectarla).
  colocarWidget();
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

// ---- Bandeja de Windows: abre la configuración (decidido por Rost en task-07) ----

let bandeja = null;

// Arranque con Windows (task-11): se activa solo la primera vez que abre el widget instalado y
// después lo decide Rost con la casilla del menú. En desarrollo no se toca (sería electron.exe).
function prepararArranque() {
  if (!app.isPackaged || estado.arranqueListo) return;
  app.setLoginItemSettings({ openAtLogin: true });
  cambiar({ arranqueListo: true });
}

function crearBandeja() {
  bandeja = new Tray(path.join(dir, 'icono-bandeja.png'));
  bandeja.setToolTip('Calendarizacion');
  const arranque = app.isPackaged ? [{
    label: 'Iniciar con Windows',
    type: 'checkbox',
    checked: app.getLoginItemSettings().openAtLogin,
    click: (casilla) => app.setLoginItemSettings({ openAtLogin: casilla.checked }),
  }] : [];
  bandeja.setContextMenu(Menu.buildFromTemplate([
    { label: 'Configuración', click: () => cambiar({ configAbierta: true }) },
    ...arranque,
    { type: 'separator' },
    { label: 'Salir', click: () => app.quit() },
  ]));
  bandeja.on('click', () => cambiar({ configAbierta: !estado.configAbierta }));
}

ipcMain.handle('estado:leer', () => estado);
ipcMain.on('estado:cambiar', (_e, parcial) => cambiar(parcial));
ipcMain.on('configuracion:alto', (_e, alto) => {
  altoConfig = Math.round(alto);
  if (config) animar(config, limitesConfig(origenWidget(), altoConfig));
});
ipcMain.on('pantallas:identificar', identificarPantallas);
ipcMain.handle('escritorio:fondo', fondoDeEscritorio);
ipcMain.on('catalogo:alternar', alternarCatalogo);

// ---- Notion (task-08) ----

const notion = crearSincronizador((parcial) => cambiar(parcial));
const MINUTOS_ENTRE_LECTURAS = 2;
ipcMain.handle('notion:conectar', (_e, clave) => notion.conectar(clave));
ipcMain.on('notion:desconectar', () => notion.desconectar());
ipcMain.on('tarea:marcar', (_e, id, nuevoEstado) => notion.marcar(id, nuevoEstado));

// ---- Google Calendar, solo lectura (task-09) ----

const calendario = crearSincronizadorCalendario((parcial) => cambiar(parcial));
ipcMain.handle('google:conectar', () => calendario.conectar());
ipcMain.on('google:desconectar', () => calendario.desconectar());
const sincronizarTodo = () => {
  notion.sincronizar();
  calendario.sincronizar();
};
ipcMain.on('app:cerrar', () => app.quit());

// Una sola copia del widget a la vez.
if (!app.requestSingleInstanceLock()) app.quit();

app.whenReady().then(() => {
  estado.hayPantalla2 = screen.getAllDisplays().length > 1;
  temaWindows();
  if (pruebas) abrirPruebas();
  crearWidget();
  prepararArranque();
  crearBandeja();
  // Primero lo último leído (sirve sin internet); luego Notion y Google, cada pocos minutos y al despertar el equipo.
  notion.publicar();
  calendario.publicar();
  sincronizarTodo();
  setInterval(sincronizarTodo, MINUTOS_ENTRE_LECTURAS * 60 * 1000);
  // Los avisos se revisan cada 15 segundos: así aparecen a su hora, también al despertar el equipo.
  setInterval(() => actualizarAvisos() && difundir(), 15 * 1000);
  powerMonitor.on('resume', sincronizarTodo);
  powerMonitor.on('unlock-screen', sincronizarTodo);
  screen.on('display-added', actualizarPantallas);
  screen.on('display-removed', actualizarPantallas);
  screen.on('display-metrics-changed', colocarWidget);
});

// El widget vive aunque se cierre la configuración o la lista; se sale desde la bandeja.
app.on('window-all-closed', () => {});
app.on('will-quit', () => globalShortcut.unregisterAll());
