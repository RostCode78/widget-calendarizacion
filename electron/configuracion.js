// Configuración que sobrevive a reiniciar: un JSON en la carpeta de datos de la app
// (%APPDATA%\calendarizacion). Nunca guarda claves; esas van al Administrador de credenciales.
import { leerJson, escribirJson } from './archivos.js';

// La posición (1–9) se guarda por pantalla (1 = principal, 2 = la otra).
const base = { modo: 'oscuro', horaVisible: true, pantalla: 1, posiciones: { 1: 6, 2: 6 } };

export function leerConfiguracion() {
  const guardada = leerJson('configuracion.json', {});
  return { ...structuredClone(base), ...guardada, posiciones: { ...base.posiciones, ...guardada.posiciones } };
}

export function guardarConfiguracion({ modo, horaVisible, pantalla, posiciones }) {
  escribirJson('configuracion.json', { modo, horaVisible, pantalla, posiciones });
}
