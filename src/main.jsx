import { createRoot } from 'react-dom/client';
import './estilos/tokens.css';
import { useEstado } from './estado.js';
import { tareasDeHoy } from './datos/ejemplo.js';
import ModuloHora from './componentes/organismos/ModuloHora.jsx';
import ModuloCalendario from './componentes/organismos/ModuloCalendario.jsx';
import ModuloHoy from './componentes/organismos/ModuloHoy.jsx';
import ModuloSemana from './componentes/organismos/ModuloSemana.jsx';
import PanelHoy from './componentes/organismos/PanelHoy.jsx';
import Fondo from './pruebas/Fondo.jsx';
import Catalogo from './pruebas/Catalogo.jsx';

// Cada ventana muestra una ruta. Los módulos esperan el estado compartido antes de pintarse.
const vistas = {
  '/modulo/hora': () => <ModuloHora />,
  '/modulo/calendario': (e) => <ModuloCalendario alto={!e.horaVisible} />,
  '/modulo/hoy': (e) => <ModuloHoy tareas={tareasDeHoy(e.escenario)} panelAbierto={e.panelAbierto} ladoPanel={e.ladoPanel} />,
  '/modulo/semana': () => <ModuloSemana />,
  '/panel/hoy': (e) => <PanelHoy tareas={tareasDeHoy(e.escenario)} />,
  '/fondo': (e) => <Fondo estado={e} />,
  '/catalogo': () => <Catalogo />,
};

function Vista() {
  const estado = useEstado();
  const vista = vistas[location.hash.slice(1)];
  return estado && vista ? vista(estado) : null;
}

createRoot(document.getElementById('raiz')).render(<Vista />);
