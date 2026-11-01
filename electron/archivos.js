// JSON en la carpeta de datos de la app (%APPDATA%\calendarizacion). Nunca secretos: esos van
// al Administrador de credenciales. Se escribe en un archivo aparte y se renombra, para no dejar
// un JSON a medias si algo falla.
import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

const archivo = (nombre) => path.join(app.getPath('userData'), nombre);

export function leerJson(nombre, siNoHay) {
  try {
    return JSON.parse(fs.readFileSync(archivo(nombre), 'utf8'));
  } catch {
    return siNoHay;
  }
}

export function escribirJson(nombre, datos) {
  const temporal = `${archivo(nombre)}.tmp`;
  fs.writeFileSync(temporal, JSON.stringify(datos, null, 2));
  fs.renameSync(temporal, archivo(nombre));
}
