// Guarda secretos en el Administrador de credenciales de Windows (nunca en archivos del proyecto).
// Usa la API de Windows directamente con koffi: CredWriteW, CredReadW y CredDeleteW.
import koffi from 'koffi';

const advapi32 = koffi.load('advapi32.dll');
const FILETIME = koffi.struct('FILETIME', { bajo: 'uint32', alto: 'uint32' });
const CREDENTIALW = koffi.struct('CREDENTIALW', {
  Flags: 'uint32',
  Type: 'uint32',
  TargetName: 'str16',
  Comment: 'str16',
  LastWritten: FILETIME,
  CredentialBlobSize: 'uint32',
  CredentialBlob: 'void *',
  Persist: 'uint32',
  AttributeCount: 'uint32',
  Attributes: 'void *',
  TargetAlias: 'str16',
  UserName: 'str16',
});
const CredWriteW = advapi32.func('bool __stdcall CredWriteW(CREDENTIALW *credencial, uint32 banderas)');
const CredReadW = advapi32.func('bool __stdcall CredReadW(str16 destino, uint32 tipo, uint32 banderas, _Out_ CREDENTIALW **credencial)');
const CredDeleteW = advapi32.func('bool __stdcall CredDeleteW(str16 destino, uint32 tipo, uint32 banderas)');
const CredFree = advapi32.func('void __stdcall CredFree(void *memoria)');

const GENERICA = 1;
const PERSISTIR_EN_EQUIPO = 2;

export function guardarSecreto(nombre, valor) {
  const blob = Buffer.from(valor, 'utf8');
  return CredWriteW({
    Flags: 0, Type: GENERICA, TargetName: nombre, Comment: null, LastWritten: { bajo: 0, alto: 0 },
    CredentialBlobSize: blob.length, CredentialBlob: blob, Persist: PERSISTIR_EN_EQUIPO,
    AttributeCount: 0, Attributes: null, TargetAlias: null, UserName: 'calendarizacion',
  }, 0);
}

export function leerSecreto(nombre) {
  const salida = [null];
  if (!CredReadW(nombre, GENERICA, 0, salida)) return null;
  try {
    const cred = koffi.decode(salida[0], CREDENTIALW);
    return Buffer.from(koffi.decode(cred.CredentialBlob, 'uint8', cred.CredentialBlobSize)).toString('utf8');
  } finally {
    CredFree(salida[0]);
  }
}

export const borrarSecreto = (nombre) => CredDeleteW(nombre, GENERICA, 0);
