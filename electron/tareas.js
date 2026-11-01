// Sincroniza las tareas de Notion: copia local para trabajar sin internet y cola de cambios
// de estado que no se pudieron enviar. La clave vive en el Administrador de credenciales.
import { leerJson, escribirJson } from './archivos.js';
import { borrarSecreto, guardarSecreto, leerSecreto } from './credenciales.js';
import { buscarBase, cambiarEstado, diaLocal, ErrorNotion, leerTareas } from './notion.js';

const SECRETO = 'Calendarizacion/Notion';
const DIAS = 7; // hoy y los próximos días

const estadoDe = (t) => (t.hecha ? 'hecha' : t.enCurso ? 'enCurso' : 'pendiente');
const conEstado = (t, estado) => ({ ...t, hecha: estado === 'hecha', enCurso: estado === 'enCurso' });

// `avisar(parcial)` manda al resto de la app { tareas, notion }.
export function crearSincronizador(avisar) {
  let copia = leerJson('notion-tareas.json', { base: null, tareas: [], actualizado: null });
  // Cambios de estado aún sin confirmar por Notion: { [paginaId]: 'hecha' | 'enCurso' | 'pendiente' }.
  let pendientes = leerJson('notion-pendientes.json', {});
  let enCurso = null;

  // El widget muestra lo leído con los cambios pendientes encima.
  const tareasVisibles = () => copia.tareas.map((t) => (pendientes[t.id] ? conEstado(t, pendientes[t.id]) : t));
  const publicar = (error = null) => avisar({
    tareas: tareasVisibles(),
    notion: { conectada: Boolean(copia.base), base: copia.base?.nombre ?? null, error, actualizado: copia.actualizado },
  });

  async function enviarPendientes(clave) {
    for (const [id, estado] of Object.entries(pendientes)) {
      try {
        await cambiarEstado(clave, id, estado);
        copia.tareas = copia.tareas.map((t) => (t.id === id ? conEstado(t, estado) : t));
      } catch (e) {
        // Si la página ya no existe o dejó de estar compartida, el cambio se descarta; otros errores esperan.
        if (!(e instanceof ErrorNotion && e.tipo === 'sin-base')) throw e;
      }
      delete pendientes[id];
      escribirJson('notion-pendientes.json', pendientes);
    }
  }

  async function hacerSincronizacion() {
    const clave = leerSecreto(SECRETO);
    if (!clave || !copia.base) return publicar(copia.base ? 'clave' : null);
    try {
      await enviarPendientes(clave);
      const hoy = new Date();
      const hasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + DIAS);
      const tareas = await leerTareas(clave, copia.base.id, diaLocal(hoy), diaLocal(hasta));
      copia = { ...copia, tareas, actualizado: new Date().toISOString() };
      escribirJson('notion-tareas.json', copia);
      publicar();
    } catch (e) {
      // Sin internet o Notion caído: se queda lo último leído y se reintenta en la próxima vuelta.
      publicar(e instanceof ErrorNotion ? e.tipo : 'servicio');
    }
  }

  // Una sincronización a la vez; si piden otra mientras corre, se encadena.
  function sincronizar() {
    enCurso = (enCurso ?? Promise.resolve()).then(hacerSincronizacion).finally(() => (enCurso = null));
    return enCurso;
  }

  return {
    publicar,
    sincronizar,

    // Valida la clave buscando la base; solo si funciona se guarda en el Administrador de credenciales.
    async conectar(clave) {
      try {
        const base = await buscarBase(clave.trim());
        if (!guardarSecreto(SECRETO, clave.trim())) return { error: 'servicio' };
        copia = { base, tareas: [], actualizado: null };
        escribirJson('notion-tareas.json', copia);
        await sincronizar();
        return { ok: true };
      } catch (e) {
        return { error: e instanceof ErrorNotion ? e.tipo : 'servicio' };
      }
    },

    desconectar() {
      borrarSecreto(SECRETO);
      copia = { base: null, tareas: [], actualizado: null };
      pendientes = {};
      escribirJson('notion-tareas.json', copia);
      escribirJson('notion-pendientes.json', pendientes);
      publicar();
    },

    // Se ve al instante y se guarda en la cola; Notion lo recibe ahora o cuando vuelva la conexión.
    marcar(id, estado) {
      const tarea = copia.tareas.find((t) => t.id === id);
      if (!tarea) return;
      if (estadoDe(tarea) === estado) delete pendientes[id];
      else pendientes[id] = estado;
      escribirJson('notion-pendientes.json', pendientes);
      publicar();
      sincronizar();
    },
  };
}
