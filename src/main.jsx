import { createRoot } from 'react-dom/client';
import './estilos/tokens.css';
import { useEstado } from './estado.js';
import { eventosDesde, tareasDeHoy } from './datos/ejemplo.js';
import { avisoGoogle, avisoNotion } from './componentes/organismos/hoy.jsx';
import ModuloHora from './componentes/organismos/ModuloHora.jsx';
import ModuloCalendario from './componentes/organismos/ModuloCalendario.jsx';
import ModuloHoy from './componentes/organismos/ModuloHoy.jsx';
import ModuloSemana from './componentes/organismos/ModuloSemana.jsx';
import PanelHoy from './componentes/organismos/PanelHoy.jsx';
import PanelConfiguracion from './componentes/organismos/PanelConfiguracion.jsx';
import Cristal from './componentes/atomos/Cristal.jsx';
import { AvisoFin, AvisoInicio } from './componentes/organismos/Aviso.jsx';
import Fondo from './pruebas/Fondo.jsx';
import Catalogo from './pruebas/Catalogo.jsx';

// Tareas de hoy: las de Notion, o las de ejemplo si la página de pruebas eligió otro escenario.
const hoyLocal = () => new Date().toLocaleDateString('sv'); // "AAAA-MM-DD"
const tareas = (e) => (e.escenario === 'real' ? e.tareas.filter((t) => t.dia === hoyLocal()) : tareasDeHoy(e.escenario));
const aviso = (e) => (e.escenario === 'real' ? avisoNotion(e.notion) : null);

// Eventos: los de Google Calendar ("AAAA-MM-DD" → fecha local), o los de ejemplo.
const eventos = (e) => (e.escenario === 'real'
  ? e.eventos.map((ev) => ({ ...ev, fecha: new Date(`${ev.dia}T00:00`) }))
  : eventosDesde(new Date(new Date().toDateString())));
const avisoSemana = (e) => (e.escenario === 'real' ? avisoGoogle(e.google) : null);

// Cada ventana muestra una ruta. Los módulos esperan el estado compartido antes de pintarse.
const vistas = {
  '/modulo/hora': () => <ModuloHora />,
  '/modulo/calendario': (e) => <ModuloCalendario alto={!e.horaVisible} eventos={eventos(e)} />,
  '/modulo/hoy': (e) => <ModuloHoy tareas={tareas(e)} aviso={aviso(e)} panelAbierto={e.panelAbierto} ladoPanel={e.ladoLateral} />,
  '/modulo/semana': (e) => <ModuloSemana eventos={eventos(e)} aviso={avisoSemana(e)} />,
  '/panel/hoy': (e) => <PanelHoy tareas={tareas(e)} aviso={aviso(e)} />,
  '/configuracion': (e) => <PanelConfiguracion estado={e} />,
  '/identificar/1': () => <Cristal className="identificar"><span className="texto-hora">1</span></Cristal>,
  '/identificar/2': () => <Cristal className="identificar"><span className="texto-hora">2</span></Cristal>,
  '/fondo': (e) => <Fondo estado={e} />,
  '/catalogo': () => <Catalogo />,
};

// Aviso flotante (task-10): la ruta trae la clave del aviso ("/aviso/<tarea>-inicio").
function VentanaAviso({ estado, clave }) {
  const aviso = estado.avisos.find((a) => a.clave === clave);
  if (!aviso) return null;
  // El de arriba también se acepta con Ctrl+Alt+Enter (electron/main.js).
  const atajo = estado.avisos[0].clave === clave ? 'Control+Alt+Enter' : undefined;
  const props = { className: 'aviso-ventana', titulo: aviso.texto, hora: aviso.hora, atajo, alAceptar: () => window.widget.aceptarAviso(clave) };
  return aviso.tipo === 'inicio' ? <AvisoInicio rango={aviso.rango} {...props} /> : <AvisoFin {...props} />;
}

function Vista() {
  const estado = useEstado();
  const ruta = location.hash.slice(1);
  if (estado && ruta.startsWith('/aviso/')) return <VentanaAviso estado={estado} clave={ruta.slice('/aviso/'.length)} />;
  const vista = vistas[ruta];
  return estado && vista ? vista(estado) : null;
}

createRoot(document.getElementById('raiz')).render(<Vista />);
