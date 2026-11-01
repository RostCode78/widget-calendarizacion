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
// Las tareas de Notion (con `id`) se marcan desde la lista: hecha ↔ pendiente.
export function FilaTarea({ tarea }) {
  const estado = tarea.hecha ? 'hecha' : tarea.enCurso ? 'en-curso' : 'pendiente';
  const hora = tarea.enCurso && tarea.fin ? `${tarea.inicio} – ${tarea.fin}` : tarea.inicio;
  const alMarcar = tarea.id && (() => window.widget.marcarTarea(tarea.id, tarea.hecha ? 'pendiente' : 'hecha'));
  return <Tarea texto={tarea.texto} hora={hora} estado={estado} alMarcar={alMarcar || undefined} />;
}

// Aviso discreto junto al título "Hoy" cuando Notion no responde (no es una pantalla de error).
const AVISOS = {
  'sin-conexion': 'sin conexión',
  servicio: 'Notion no responde',
  clave: 'revisa la clave de Notion',
  'sin-base': 'revisa la base de Notion',
};
export const avisoNotion = (notion) => (notion.conectada ? AVISOS[notion.error] : 'conecta Notion');

// Lo mismo para "Esta semana" con Google Calendar (task-09).
const AVISOS_GOOGLE = {
  'sin-conexion': 'sin conexión',
  servicio: 'Google no responde',
  clave: 'vuelve a conectar Google',
};
export const avisoGoogle = (google) => (google.conectada ? AVISOS_GOOGLE[google.error] : 'conecta Google');

// Título de módulo con su aviso discreto al lado ("Hoy · sin conexión").
export function TituloModulo({ titulo = 'Hoy', aviso }) {
  return (
    <span className="hoy-titulo">
      <span className="texto-titulo-modulo">{titulo}</span>
      {aviso && <span className="texto-detalle hoy-aviso">· {aviso}</span>}
    </span>
  );
}
