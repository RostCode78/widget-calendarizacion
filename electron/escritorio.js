// Pega ventanas al escritorio de Windows (task-03, ahora sin PowerShell).
// Dueño = el escritorio (Progman): Win+D no las oculta. Al fondo del orden: quedan
// debajo de las demás ventanas. Las ventanas se tratan como números (HWND).
import koffi from 'koffi';

const user32 = koffi.load('user32.dll');
const FindWindowW = user32.func('intptr __stdcall FindWindowW(const char16_t *clase, const char16_t *nombre)');
const SetWindowLongPtrW = user32.func('intptr __stdcall SetWindowLongPtrW(intptr hwnd, int indice, intptr valor)');
const SetWindowPos = user32.func('bool __stdcall SetWindowPos(intptr hwnd, intptr despues, int x, int y, int cx, int cy, uint banderas)');
const RegisterWindowMessageW = user32.func('uint __stdcall RegisterWindowMessageW(const char16_t *nombre)');

const GWLP_HWNDPARENT = -8;
const HWND_BOTTOM = 1;
const SWP_NOSIZE_NOMOVE_NOACTIVATE = 0x0001 | 0x0002 | 0x0010;

// Windows avisa con este mensaje cuando el Explorador (y con él el escritorio) se reinicia.
export const MENSAJE_EXPLORADOR = RegisterWindowMessageW('TaskbarCreated');

const hwnd = (win) => win.getNativeWindowHandle().readBigUInt64LE(0);

export function pegarAlEscritorio(win) {
  const progman = FindWindowW('Progman', null);
  if (!progman) return false;
  SetWindowLongPtrW(hwnd(win), GWLP_HWNDPARENT, progman);
  SetWindowPos(hwnd(win), HWND_BOTTOM, 0, 0, 0, 0, SWP_NOSIZE_NOMOVE_NOACTIVATE);
  return true;
}
