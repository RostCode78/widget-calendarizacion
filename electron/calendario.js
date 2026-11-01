// Sincroniza los eventos de Google Calendar (solo lectura): copia local para seguir mostrando lo
// último sin internet. El cliente de Google y el permiso viven en el Administrador de credenciales.
import { dialog } from 'electron';
import fs from 'node:fs';
import { leerJson, escribirJson } from './archivos.js';
import { borrarSecreto, guardarSecreto, leerSecreto } from './credenciales.js';
import { autorizar, ErrorGoogle, leerArchivoCliente, leerEventos, revocar } from './google.js';

const CLIENTE = 'Calendarizacion/Google/cliente';
const PERMISO = 'Calendarizacion/Google/permiso';
const SEMANAS = 12; // desde la cuadrícula del mes actual: cubre "Esta semana" y las marcas de este mes y el siguiente

const leerCliente = () => {
  const guardado = leerSecreto(CLIENTE);
  return guardado ? JSON.parse(guardado) : null;
};

// Lunes de la primera semana que muestra el mini calendario del mes actual.
function inicioDeCuadricula(hoy) {
  const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  return new Date(primero.getFullYear(), primero.getMonth(), 1 - ((primero.getDay() + 6) % 7));
}

// Pide (una sola vez) el archivo del cliente de Google: client_secret_….json.
async function elegirCliente() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Elige el archivo de tu cliente de Google (client_secret_….json)',
    filters: [{ name: 'Cliente de Google', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (canceled || !filePaths.length) throw new ErrorGoogle('cancelada');
  const cliente = leerArchivoCliente(fs.readFileSync(filePaths[0], 'utf8'));
  guardarSecreto(CLIENTE, JSON.stringify(cliente));
  return cliente;
}

// `avisar(parcial)` manda al resto de la app { eventos, google }.
export function crearSincronizadorCalendario(avisar) {
  let copia = leerJson('google-eventos.json', { conectado: false, nombre: null, eventos: [], actualizado: null });
  let enCurso = null;

  const publicar = (error = null) => avisar({
    eventos: copia.eventos,
    google: { conectada: copia.conectado, calendario: copia.nombre, error, actualizado: copia.actualizado },
  });

  async function hacerSincronizacion() {
    const cliente = leerCliente();
    const permiso = leerSecreto(PERMISO);
    if (!copia.conectado) return publicar();
    if (!cliente || !permiso) return publicar('clave');
    try {
      const desde = inicioDeCuadricula(new Date());
      const hasta = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate() + SEMANAS * 7);
      const { nombre, eventos } = await leerEventos(cliente, permiso, desde, hasta);
      copia = { ...copia, nombre: nombre ?? copia.nombre, eventos, actualizado: new Date().toISOString() };
      escribirJson('google-eventos.json', copia);
      publicar();
    } catch (e) {
      publicar(e instanceof ErrorGoogle ? e.tipo : 'servicio');
    }
  }

  function sincronizar() {
    enCurso = (enCurso ?? Promise.resolve()).then(hacerSincronizacion).finally(() => (enCurso = null));
    return enCurso;
  }

  return {
    publicar,
    sincronizar,

    async conectar() {
      try {
        const cliente = leerCliente() ?? (await elegirCliente());
        let permiso;
        try {
          permiso = await autorizar(cliente);
        } catch (e) {
          // Cliente borrado o mal copiado en Google Cloud: la próxima vez se vuelve a pedir el archivo.
          if (e instanceof ErrorGoogle && e.tipo === 'clave') borrarSecreto(CLIENTE);
          throw e;
        }
        guardarSecreto(PERMISO, permiso);
        copia = { conectado: true, nombre: null, eventos: [], actualizado: null };
        escribirJson('google-eventos.json', copia);
        await sincronizar();
        return { ok: true };
      } catch (e) {
        return { error: e instanceof ErrorGoogle ? e.tipo : 'servicio' };
      }
    },

    async desconectar() {
      const permiso = leerSecreto(PERMISO);
      borrarSecreto(PERMISO);
      copia = { conectado: false, nombre: null, eventos: [], actualizado: null };
      escribirJson('google-eventos.json', copia);
      publicar();
      if (permiso) await revocar(permiso);
    },
  };
}
