// Piezas que comparten el módulo Hoy y su panel de lista completa.
import '../../estilos/iconos.css';
import Tarea from '../moleculas/Tarea.jsx';

export const ordenarPorHora = (tareas) => [...tareas].sort((a, b) => a.inicio.localeCompare(b.inicio));

// Chip del encabezado: "N pendientes", o "Al día" con check cuando no queda ninguna.
export function ChipPendientes({ tareas }) {
  const pendientes = tareas.filter((t) => !t.hecha).length;
  if (!pendientes) {
    return <span className="hoy-chip hoy-chip-al-dia texto-detalle"><span className="icono icono-check-tarea" />Al día</span>;
  }
  return <span className="hoy-chip texto-detalle">{pendientes} pendientes</span>;
}

// Barra fina de avance: tareas hechas sobre el total.
export function Progreso({ tareas }) {
  const hechas = tareas.filter((t) => t.hecha).length;
  return (
    <div className="progreso" role="progressbar" aria-valuemin={0} aria-valuemax={tareas.length} aria-valuenow={hechas}>
      <div className="progreso-pista"><div className="progreso-avance" style={{ width: `${(hechas / tareas.length) * 100}%` }} /></div>
    </div>
  );
}

// Una fila de tarea. El rango de horas solo se muestra mientras está en curso (sección 17).
export function FilaTarea({ tarea }) {
  const estado = tarea.hecha ? 'hecha' : tarea.enCurso ? 'en-curso' : 'pendiente';
  const hora = tarea.enCurso && tarea.fin ? `${tarea.inicio} – ${tarea.fin}` : tarea.inicio;
  return <Tarea texto={tarea.texto} hora={hora} estado={estado} />;
}
