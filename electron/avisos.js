// Qué avisos tocan ahora (DESIGN-SYSTEM sección 17). No guarda nada: sale del estado de cada
// tarea, así que un aviso sigue ahí tras cerrar el widget o apagar el equipo hasta que se acepta.
// - Solo tareas de hoy, con hora y sin hacer. Las de días anteriores no avisan.
// - Pasada la hora de cierre: aviso de fin (aunque no se haya aceptado el de inicio; decidido por Rost).
// - Pasada la hora de inicio y sin empezar: aviso de inicio.

const dosCifras = (n) => String(n).padStart(2, '0');
const diaLocal = (d) => `${d.getFullYear()}-${dosCifras(d.getMonth() + 1)}-${dosCifras(d.getDate())}`;
const horaLocal = (d) => `${dosCifras(d.getHours())}:${dosCifras(d.getMinutes())}`;

// Devuelve [{ clave, id, tipo: 'inicio' | 'fin', texto, hora, rango }] por orden de hora.
export function avisosPendientes(tareas, ahora = new Date()) {
  const hoy = diaLocal(ahora);
  const hora = horaLocal(ahora);
  const avisos = [];
  for (const t of tareas) {
    if (t.dia !== hoy || t.hecha || !t.inicio) continue;
    const rango = t.fin ? `${t.inicio} – ${t.fin}` : t.inicio;
    if (t.fin && hora >= t.fin) avisos.push({ tipo: 'fin', hora: t.fin, ...datos(t, rango) });
    else if (!t.enCurso && hora >= t.inicio) avisos.push({ tipo: 'inicio', hora: t.inicio, ...datos(t, rango) });
  }
  return avisos
    .map((a) => ({ ...a, clave: `${a.id}-${a.tipo}` }))
    .sort((a, b) => a.hora.localeCompare(b.hora));
}

const datos = (t, rango) => ({ id: t.id, texto: t.texto, rango });
