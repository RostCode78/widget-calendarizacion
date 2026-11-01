// Horas del formulario Nueva tarea (task-12): siempre "HH:MM" en 24 h (decidido por Rost).

// Lo que Rost escriba → "HH:MM", o null si no se entiende. Acepta "1930", "19:30", "9", "9.5",
// "7:30 pm" o "7 pm". Vacío → "" (sin hora).
export function normalizarHora(texto) {
  const t = texto.trim().toLowerCase().replace(/\s+/g, '').replace('.', ':');
  if (!t) return '';
  const m = t.match(/^(\d{1,2})(?::?(\d{2}))?(am|pm|a\.?m\.?|p\.?m\.?)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  const sufijo = m[3]?.[0];
  if (sufijo && (h < 1 || h > 12)) return null;
  if (sufijo === 'p' && h < 12) h += 12;
  if (sufijo === 'a' && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

// Flechas del teclado: sube o baja `paso` minutos, al múltiplo más cercano, dentro del mismo día.
// Sin hora previa, arranca en la siguiente media hora a partir de `ahora`.
export function moverHora(hora, paso, ahora = new Date()) {
  let total;
  if (!hora) {
    total = Math.ceil((ahora.getHours() * 60 + ahora.getMinutes() + 1) / 30) * 30;
  } else {
    const [h, m] = hora.split(':').map(Number);
    const actual = h * 60 + m;
    total = paso > 0 ? Math.floor(actual / paso) * paso + paso : Math.ceil(actual / -paso) * -paso + paso;
  }
  total = Math.min(Math.max(total, 0), 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
