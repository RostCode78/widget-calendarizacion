// Fechas en español para el widget. Sin dependencias: Intl ya trae los nombres.
const sinPunto = (t) => t.replace('.', '');
const mayuscula = (t) => t[0].toUpperCase() + t.slice(1);
const formato = (opciones) => new Intl.DateTimeFormat('es-MX', opciones);

const diaSemana = formato({ weekday: 'long' });
const diaSemanaCorto = formato({ weekday: 'short' });
const mesLargo = formato({ month: 'long' });
const mesCorto = formato({ month: 'short' });

// "Sábado, 31 de octubre"
export const fechaLarga = (d) => `${mayuscula(diaSemana.format(d))}, ${d.getDate()} de ${mesLargo.format(d)}`;
// "04:04" (24 horas)
export const horaCorta = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
// "LUN", "MIÉ"
export const diaCorto = (d) => sinPunto(diaSemanaCorto.format(d)).toUpperCase();
// "Lunes"
export const diaLargo = (d) => mayuscula(diaSemana.format(d));
// "Octubre 2026"
export const mesYAnio = (d) => `${mayuscula(mesLargo.format(d))} ${d.getFullYear()}`;

export const sumarDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const mismoDia = (a, b) => a.toDateString() === b.toDateString();

// "31 oct – 6 nov" o "2 – 8 nov" si es el mismo mes.
export function rango(desde, hasta) {
  const fin = `${hasta.getDate()} ${sinPunto(mesCorto.format(hasta))}`;
  return desde.getMonth() === hasta.getMonth()
    ? `${desde.getDate()} – ${fin}`
    : `${desde.getDate()} ${sinPunto(mesCorto.format(desde))} – ${fin}`;
}

// Las 6 semanas (42 días, de lunes a domingo) que muestra el mini calendario para un mes.
export function cuadriculaDelMes(anio, mes) {
  const primero = new Date(anio, mes, 1);
  const lunes = sumarDias(primero, -((primero.getDay() + 6) % 7));
  return Array.from({ length: 42 }, (_, i) => sumarDias(lunes, i));
}
