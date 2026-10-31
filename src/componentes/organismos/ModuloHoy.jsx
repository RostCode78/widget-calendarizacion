import '../../estilos/iconos.css';
import '../atomos/atomos.css';
import Cristal from '../atomos/Cristal.jsx';
import BotonIcono from '../atomos/BotonIcono.jsx';
import { cambiar } from '../../estado.js';
import { ChipPendientes, FilaTarea, Progreso, TituloHoy, ordenarPorHora } from './hoy.jsx';
import './modulos.css';

const VISIBLES = 4;
const MUCHAS = 7; // Desde 7 tareas: barra de progreso y "Ver N más" (decidido por Rost en task-06).

// Módulo Hoy (sección 12): normal, vacío y muchas tareas. Nunca crece; lo que no cabe va al panel.
export default function ModuloHoy({ tareas, aviso, panelAbierto, ladoPanel, alNuevaTarea }) {
  const lista = ordenarPorHora(tareas);
  const ocultas = lista.length - VISIBLES;
  const muchas = lista.length >= MUCHAS;
  const alternarPanel = () => cambiar({ panelAbierto: !panelAbierto });
  // Con el panel abierto, la flecha apunta hacia él.
  const flecha = panelAbierto && ladoPanel === 'izquierda' ? 'chevron-l' : 'chevron-r';

  return (
    <Cristal className="modulo modulo-hoy">
      <div className="modulo-encabezado">
        <TituloHoy aviso={aviso} />
        <span className="modulo-derecha">
          <ChipPendientes tareas={lista} />
          <BotonIcono icono="mas" etiqueta="Nueva tarea" className="hoy-nueva" onClick={alNuevaTarea} />
        </span>
      </div>
      {!lista.length && (
        <div className="hoy-vacio">
          <span className="hoy-vacio-icono"><span className="icono icono-taza" /></span>
          <span className="texto-aviso-titulo">Día despejado</span>
          <span className="texto-detalle">No tienes tareas para hoy</span>
        </div>
      )}
      {muchas && <Progreso tareas={lista} />}
      {lista.length > 0 && (
        <div className="hoy-lista">
          {lista.slice(0, VISIBLES).map((t) => <FilaTarea key={t.texto} tarea={t} />)}
        </div>
      )}
      {ocultas > 0 && (muchas ? (
        <button type="button" className="foco hoy-ver-mas texto-detalle" aria-expanded={panelAbierto} onClick={alternarPanel}>
          Ver {ocultas} más <span className={`icono icono-${flecha}`} />
        </button>
      ) : (
        <button type="button" className="foco modulo-mas texto-detalle" aria-expanded={panelAbierto} onClick={alternarPanel}>
          +{ocultas} más
        </button>
      ))}
    </Cristal>
  );
}
