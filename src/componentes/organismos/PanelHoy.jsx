import '../../estilos/iconos.css';
import '../atomos/atomos.css';
import Cristal from '../atomos/Cristal.jsx';
import { cambiar } from '../../estado.js';
import { ChipPendientes, FilaTarea, Progreso, ordenarPorHora } from './hoy.jsx';
import './modulos.css';

// Franjas del día por hora de inicio: mañana antes de las 12, tarde hasta las 19, noche después.
const FRANJAS = [
  { nombre: 'Mañana', icono: 'manana', hasta: '12:00' },
  { nombre: 'Tarde', icono: 'tarde', hasta: '19:00' },
  { nombre: 'Noche', icono: 'noche', hasta: '24:00' },
];

// Panel / Hoy (lista completa): todas las tareas de hoy agrupadas por franja (sección 12).
export default function PanelHoy({ tareas }) {
  const lista = ordenarPorHora(tareas);
  let desde = '00:00';
  const grupos = FRANJAS.map((f) => {
    const de = desde;
    desde = f.hasta;
    return { ...f, tareas: lista.filter((t) => t.inicio >= de && t.inicio < f.hasta) };
  }).filter((g) => g.tareas.length);

  return (
    <Cristal className="modulo panel-hoy">
      <div className="modulo-encabezado">
        <span className="texto-titulo-modulo">Hoy</span>
        <span className="modulo-derecha">
          <ChipPendientes tareas={lista} />
          <button type="button" className="foco panel-cerrar" aria-label="Cerrar lista" onClick={() => cambiar({ panelAbierto: false })}>
            <span className="icono icono-cerrar-panel" />
          </button>
        </span>
      </div>
      {lista.length > 0 && <Progreso tareas={lista} />}
      {grupos.map((g) => (
        <section key={g.nombre} className="franja">
          <h3 className="franja-etiqueta texto-titulo-modulo">
            <span className={`icono icono-${g.icono}`} />{g.nombre} · {g.tareas.length}
          </h3>
          {g.tareas.map((t) => <FilaTarea key={t.texto} tarea={t} />)}
        </section>
      ))}
    </Cristal>
  );
}
