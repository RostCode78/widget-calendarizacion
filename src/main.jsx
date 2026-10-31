import { createRoot } from 'react-dom/client';
import './estilos/tokens.css';
import { useEstado } from './estado.js';
import { tareasDeHoy } from './datos/ejemplo.js';
import { avisoNotion } from './componentes/organismos/hoy.jsx';
import ModuloHora from './componentes/organismos/ModuloHora.jsx';
import ModuloCalendario from './componentes/organismos/ModuloCalendario.jsx';
import ModuloHoy from './componentes/organismos/ModuloHoy.jsx';
import ModuloSemana from './componentes/organismos/ModuloSemana.jsx';
import PanelHoy from './componentes/organismos/PanelHoy.jsx';
import PanelConfiguracion from './componentes/organismos/PanelConfiguracion.jsx';
import Cristal from './componentes/atomos/Cristal.jsx';
import Fondo from './pruebas/Fondo.jsx';
import Catalogo from './pruebas/Catalogo.jsx';

// Tareas de hoy: las de Notion, o las de ejemplo si la página de pruebas eligió otro escenario.
const hoyLocal = () => new Date().toLocaleDateString('sv'); // "AAAA-MM-DD"
const tareas = (e) => (e.escenario === 'real' ? e.tareas.filter((t) => t.dia === hoyLocal()) : tareasDeHoy(e.escenario));
const aviso = (e) => (e.escenario === 'real' ? avisoNotion(e.notion) : null);

// Cada ventana muestra una ruta. Los módulos esperan el estado compartido antes de pintarse.
const vistas = {
  '/modulo/hora': () => <ModuloHora />,
  '/modulo/calendario': (e) => <ModuloCalendario alto={!e.horaVisible} />,
  '/modulo/hoy': (e) => <ModuloHoy tareas={tareas(e)} aviso={aviso(e)} panelAbierto={e.panelAbierto} ladoPanel={e.ladoLateral} />,
  '/modulo/semana': () => <ModuloSemana />,
  '/panel/hoy': (e) => <PanelHoy tareas={tareas(e)} aviso={aviso(e)} />,
  '/configuracion': (e) => <PanelConfiguracion estado={e} />,
  '/identificar/1': () => <Cristal className="identificar"><span className="texto-hora">1</span></Cristal>,
  '/identificar/2': () => <Cristal className="identificar"><span className="texto-hora">2</span></Cristal>,
  '/fondo': (e) => <Fondo estado={e} />,
  '/catalogo': () => <Catalogo />,
};

function Vista() {
  const estado = useEstado();
  const vista = vistas[location.hash.slice(1)];
  return estado && vista ? vista(estado) : null;
}

createRoot(document.getElementById('raiz')).render(<Vista />);
