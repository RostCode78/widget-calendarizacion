// Google Calendar, solo lectura (task-09). Autorización en el navegador con el flujo para apps de
// escritorio: Google redirige a un servidor local de un solo uso (127.0.0.1) y se usa PKCE.
// Permiso pedido: calendar.events.readonly (leer eventos, nada más).
import { shell } from 'electron';
import crypto from 'node:crypto';
import http from 'node:http';

const PERMISO = 'https://www.googleapis.com/auth/calendar.events.readonly';
const AUTORIZAR = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN = 'https://oauth2.googleapis.com/token';
const REVOCAR = 'https://oauth2.googleapis.com/revoke';
const API = 'https://www.googleapis.com/calendar/v3';
const MINUTOS_PARA_AUTORIZAR = 5;

// Mismos tipos de error que Notion, más 'cancelada' (Rost cerró o negó el permiso en Google).
export class ErrorGoogle extends Error {
  constructor(tipo) {
    super(tipo);
    this.tipo = tipo; // 'sin-conexion' | 'clave' | 'servicio' | 'cancelada' | 'cliente'
  }
}

async function pedir(url, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(url, { ...opciones, signal: AbortSignal.timeout(15000) });
  } catch {
    throw new ErrorGoogle('sin-conexion');
  }
  // 400 invalid_grant / 401: el permiso se revocó o venció; hay que volver a conectar.
  if (respuesta.status === 400 || respuesta.status === 401) throw new ErrorGoogle('clave');
  if (!respuesta.ok) throw new ErrorGoogle('servicio');
  return respuesta.json();
}

// El archivo que Google da al crear un cliente "App de escritorio" (client_secret_….json).
export function leerArchivoCliente(texto) {
  try {
    const { installed } = JSON.parse(texto);
    if (installed?.client_id && installed?.client_secret) return { id: installed.client_id, secreto: installed.client_secret };
  } catch {
    // cae al error de abajo
  }
  throw new ErrorGoogle('cliente');
}

const base64url = (buffer) => buffer.toString('base64url');

// Abre Google en el navegador y espera la respuesta en 127.0.0.1. Devuelve el permiso duradero
// (refresh token), que es lo único que hay que guardar.
export function autorizar(cliente) {
  const verificador = base64url(crypto.randomBytes(32));
  const reto = base64url(crypto.createHash('sha256').update(verificador).digest());
  const sello = base64url(crypto.randomBytes(16));

  return new Promise((resolver, rechazar) => {
    const terminar = (error, valor) => {
      clearTimeout(limite);
      servidor.close();
      if (error) rechazar(error);
      else resolver(valor);
    };
    const servidor = http.createServer(async (pedido, respuesta) => {
      const url = new URL(pedido.url, 'http://127.0.0.1');
      if (url.pathname !== '/') return respuesta.writeHead(404).end();
      const ok = url.searchParams.get('state') === sello && url.searchParams.get('code');
      respuesta.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      respuesta.end(`<!doctype html><meta charset="utf-8"><title>Calendarizacion</title>
        <body style="font-family:system-ui;padding:48px;background:#1e2433;color:#eef2f8">
        <h2>${ok ? 'Listo, ya puedes cerrar esta pestaña.' : 'No se dio el permiso.'}</h2>
        <p>${ok ? 'El widget ya puede leer tu calendario.' : 'Vuelve al widget e inténtalo de nuevo.'}</p></body>`);
      if (!ok) return terminar(new ErrorGoogle('cancelada'));
      try {
        const redireccion = `http://127.0.0.1:${servidor.address().port}`;
        const tokens = await pedir(TOKEN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: url.searchParams.get('code'), client_id: cliente.id, client_secret: cliente.secreto,
            redirect_uri: redireccion, grant_type: 'authorization_code', code_verifier: verificador,
          }),
        });
        if (!tokens.refresh_token) throw new ErrorGoogle('servicio');
        terminar(null, tokens.refresh_token);
      } catch (e) {
        terminar(e instanceof ErrorGoogle ? e : new ErrorGoogle('servicio'));
      }
    });
    const limite = setTimeout(() => terminar(new ErrorGoogle('cancelada')), MINUTOS_PARA_AUTORIZAR * 60 * 1000);

    servidor.listen(0, '127.0.0.1', () => {
      const parametros = new URLSearchParams({
        client_id: cliente.id, redirect_uri: `http://127.0.0.1:${servidor.address().port}`, response_type: 'code',
        scope: PERMISO, code_challenge: reto, code_challenge_method: 'S256', state: sello,
        access_type: 'offline', prompt: 'consent',
      });
      shell.openExternal(`${AUTORIZAR}?${parametros}`);
    });
  });
}

// Cambia el permiso duradero por un acceso de una hora para leer.
async function acceso(cliente, permiso) {
  const { access_token: token } = await pedir(TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: cliente.id, client_secret: cliente.secreto, refresh_token: permiso, grant_type: 'refresh_token' }),
  });
  return token;
}

const dosDigitos = (n) => String(n).padStart(2, '0');
const diaLocal = (d) => `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}`;

// Eventos del calendario principal entre `desde` y `hasta` (Date). Los que se repiten llegan ya
// separados día por día (singleEvents). Los de todo el día no tienen hora.
export async function leerEventos(cliente, permiso, desde, hasta) {
  const token = await acceso(cliente, permiso);
  const eventos = [];
  let nombre = null;
  let pagina;
  do {
    const parametros = new URLSearchParams({
      timeMin: desde.toISOString(), timeMax: hasta.toISOString(), singleEvents: 'true', orderBy: 'startTime', maxResults: '250',
      ...(pagina && { pageToken: pagina }),
    });
    const respuesta = await pedir(`${API}/calendars/primary/events?${parametros}`, { headers: { Authorization: `Bearer ${token}` } });
    nombre = respuesta.summary ?? nombre;
    for (const e of respuesta.items ?? []) {
      if (e.status === 'cancelled') continue;
      const conHora = Boolean(e.start.dateTime);
      const inicio = conHora ? new Date(e.start.dateTime) : null;
      eventos.push({
        id: e.id,
        texto: e.summary || 'Sin título',
        dia: conHora ? diaLocal(inicio) : e.start.date,
        hora: conHora ? `${dosDigitos(inicio.getHours())}:${dosDigitos(inicio.getMinutes())}` : '',
      });
    }
    pagina = respuesta.nextPageToken;
  } while (pagina);
  return { nombre, eventos };
}

// Al desconectar, también se le pide a Google que olvide el permiso (si no hay internet, no pasa nada).
export async function revocar(permiso) {
  try {
    await fetch(REVOCAR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token: permiso }),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    // el permiso local ya se borró; Google lo vence solo si no se usa
  }
}
