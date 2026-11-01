// Conexión con Notion por integración interna (decidido por Rost en task-08).
// Base "Tareas de carrera": Tarea (título), Estado (Pendiente / En curso / Hecha) y
// Fecha de trabajo (día; con hora = inicio, con rango = inicio y cierre).
const API = 'https://api.notion.com/v1';
const VERSION = '2025-09-03';
export const PROPIEDADES = { titulo: 'Tarea', estado: 'Estado', fecha: 'Fecha de trabajo' };
const ESTADOS = { pendiente: 'Pendiente', enCurso: 'En curso', hecha: 'Hecha' };

// Tipos de error que el widget sabe mostrar de forma discreta.
export class ErrorNotion extends Error {
  constructor(tipo) {
    super(tipo);
    this.tipo = tipo; // 'sin-conexion' | 'clave' | 'sin-base' | 'servicio'
  }
}

async function pedir(clave, ruta, { method = 'GET', body } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(API + ruta, {
      method,
      headers: { Authorization: `Bearer ${clave}`, 'Notion-Version': VERSION, 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new ErrorNotion('sin-conexion');
  }
  if (respuesta.status === 401) throw new ErrorNotion('clave');
  if (respuesta.status === 403 || respuesta.status === 404) throw new ErrorNotion('sin-base');
  if (!respuesta.ok) throw new ErrorNotion('servicio');
  return respuesta.json();
}

const textoPlano = (ricos = []) => ricos.map((t) => t.plain_text).join('');

// Busca, entre lo que se compartió con la integración, la base con las propiedades de tareas.
export async function buscarBase(clave) {
  const { results } = await pedir(clave, '/search', { method: 'POST', body: { filter: { property: 'object', value: 'data_source' }, page_size: 100 } });
  const p = PROPIEDADES;
  const base = results.find((f) =>
    f.properties?.[p.titulo]?.type === 'title' && f.properties?.[p.estado]?.type === 'status' && f.properties?.[p.fecha]?.type === 'date');
  if (!base) throw new ErrorNotion('sin-base');
  return { id: base.id, nombre: textoPlano(base.title) || 'Tareas' };
}

const dosDigitos = (n) => String(n).padStart(2, '0');
export const diaLocal = (d) => `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}`;
const horaLocal = (d) => `${dosDigitos(d.getHours())}:${dosDigitos(d.getMinutes())}`;

// Página de Notion → tarea del widget. Sin hora en la fecha, `inicio` queda vacío (sin avisos).
function aTarea(pagina) {
  const props = pagina.properties;
  const fecha = props[PROPIEDADES.fecha].date;
  const conHora = fecha.start.includes('T');
  const inicio = conHora ? new Date(fecha.start) : null;
  const fin = conHora && fecha.end ? new Date(fecha.end) : null;
  const estado = props[PROPIEDADES.estado].status?.name;
  return {
    id: pagina.id,
    texto: textoPlano(props[PROPIEDADES.titulo].title) || 'Sin título',
    dia: conHora ? diaLocal(inicio) : fecha.start.slice(0, 10),
    inicio: inicio ? horaLocal(inicio) : '',
    fin: fin ? horaLocal(fin) : '',
    hecha: estado === ESTADOS.hecha,
    enCurso: estado === ESTADOS.enCurso,
  };
}

// Tareas con Fecha de trabajo entre `desde` (incluido) y `hasta` (excluido), días "AAAA-MM-DD".
export async function leerTareas(clave, baseId, desde, hasta) {
  const filtro = {
    and: [
      { property: PROPIEDADES.fecha, date: { on_or_after: desde } },
      { property: PROPIEDADES.fecha, date: { before: hasta } },
    ],
  };
  const tareas = [];
  let cursor;
  do {
    const pagina = await pedir(clave, `/data_sources/${baseId}/query`, {
      method: 'POST',
      body: { filter: filtro, page_size: 100, ...(cursor && { start_cursor: cursor }) },
    });
    tareas.push(...pagina.results.filter((r) => r.properties?.[PROPIEDADES.fecha]?.date).map(aTarea));
    cursor = pagina.has_more ? pagina.next_cursor : null;
  } while (cursor);
  return tareas;
}

// "AAAA-MM-DD" + "HH:MM" → fecha con la zona del equipo ("2026-11-02T19:30:00-06:00"), como la escribe Notion.
function conZona(dia, hora) {
  const minutos = -new Date(`${dia}T${hora}`).getTimezoneOffset();
  const signo = minutos >= 0 ? '+' : '-';
  const abs = Math.abs(minutos);
  return `${dia}T${hora}:00${signo}${dosDigitos(Math.floor(abs / 60))}:${dosDigitos(abs % 60)}`;
}

// Nueva tarea (task-12): pendiente, con su día y, si las hay, hora de inicio y de cierre.
export async function crearTarea(clave, baseId, { texto, dia, inicio, fin }) {
  const fecha = inicio ? { start: conZona(dia, inicio), end: fin ? conZona(dia, fin) : null } : { start: dia };
  const pagina = await pedir(clave, '/pages', {
    method: 'POST',
    body: {
      parent: { type: 'data_source_id', data_source_id: baseId },
      properties: {
        [PROPIEDADES.titulo]: { title: [{ text: { content: texto } }] },
        [PROPIEDADES.estado]: { status: { name: ESTADOS.pendiente } },
        [PROPIEDADES.fecha]: { date: fecha },
      },
    },
  });
  return aTarea(pagina);
}

// `estado`: 'pendiente' | 'enCurso' | 'hecha'.
export async function cambiarEstado(clave, paginaId, estado) {
  await pedir(clave, `/pages/${paginaId}`, {
    method: 'PATCH',
    body: { properties: { [PROPIEDADES.estado]: { status: { name: ESTADOS[estado] } } } },
  });
}
