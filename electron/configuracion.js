// Configuración que sobrevive a reiniciar: un JSON en la carpeta de datos de la app
// (%APPDATA%\calendarizacion). Nunca guarda claves; esas van al Administrador de credenciales.
import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

const archivo = () => path.join(app.getPath('userData'), 'configuracion.json');
// La posición (1–9) se guarda por pantalla (1 = principal, 2 = la otra).
const base = { modo: 'oscuro', horaVisible: true, pantalla: 1, posiciones: { 1: 6, 2: 6 } };

export function leerConfiguracion() {
  try {
    const guardada = JSON.parse(fs.readFileSync(archivo(), 'utf8'));
    return { ...base, ...guardada, posiciones: { ...base.posiciones, ...guardada.posiciones } };
  } catch {
    return structuredClone(base);
  }
}

// Escribe en un archivo aparte y luego lo renombra, para no dejar un JSON a medias si algo falla.
export function guardarConfiguracion({ modo, horaVisible, pantalla, posiciones }) {
  const temporal = `${archivo()}.tmp`;
  fs.writeFileSync(temporal, JSON.stringify({ modo, horaVisible, pantalla, posiciones }, null, 2));
  fs.renameSync(temporal, archivo());
}
