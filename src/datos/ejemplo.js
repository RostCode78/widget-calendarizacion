// Datos falsos fijos para task-06 (los reales llegan en task-08 y task-09).
// Mismos textos que las vistas de Figma; los eventos se fechan a partir de hoy.
import { sumarDias } from './fechas.js';

const normal = [
  { texto: 'Leer capítulo Lean UX', inicio: '02:00', hecha: true },
  { texto: 'Repasar apuntes EBAC', inicio: '10:00', fin: '11:30' },
  { texto: 'Revisar pendientes', inicio: '12:30' },
  { texto: 'Planear la semana', inicio: '19:30', fin: '20:30' },
  { texto: 'Ordenar escritorio y archivos', inicio: '20:30' },
  { texto: 'Preparar la ropa de mañana', inicio: '22:30' },
];

const muchas = [
  { texto: 'Terminar apuntes de Lean UX', inicio: '02:00', hecha: true },
  { texto: 'Entregar avance del proyecto final de EBAC', inicio: '09:00' },
  { texto: 'Responder correos pendientes', inicio: '10:30' },
  { texto: 'Preparar presentación de UX', inicio: '12:00' },
  { texto: 'Revisar tareas del equipo', inicio: '14:00' },
  { texto: 'Salir a caminar', inicio: '15:00' },
  { texto: 'Actualizar el portafolio', inicio: '16:30' },
  { texto: 'Estudiar para la clase de UX/UI', inicio: '18:00' },
  { texto: 'Planear la semana', inicio: '19:30' },
  { texto: 'Ordenar escritorio y archivos', inicio: '20:30' },
  { texto: 'Leer capítulo de Lean UX', inicio: '21:30' },
  { texto: 'Preparar la ropa de mañana', inicio: '22:30' },
];

const tareasPorEscenario = {
  normal,
  vacio: [],
  muchas,
  'en-curso': normal.map((t, i) => (i === 1 ? { ...t, enCurso: true } : t)),
};

export const tareasDeHoy = (escenario) => tareasPorEscenario[escenario] ?? normal;

// `dias` = cuántos días después de hoy. El último cae fuera de los próximos 7 días:
// solo marca su punto en el calendario.
const eventos = [
  { texto: 'Clase de UX/UI', dias: 2, hora: '19:00' },
  { texto: 'Reunión de equipo', dias: 4, hora: '10:00' },
  { texto: 'Revisión de portafolio', dias: 9, hora: '17:00' },
];

export const eventosDesde = (hoy) => eventos.map((e) => ({ ...e, fecha: sumarDias(hoy, e.dias) }));
