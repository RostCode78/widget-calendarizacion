import { useEffect, useState } from 'react';

// Estado que comparten todas las ventanas (modo, escenario de ejemplo, hora visible, panel).
// Lo guarda electron/main.js y avisa a cada ventana cuando cambia.
let actual = null;
const oyentes = new Set();

window.widget.leerEstado().then(avisar);
window.widget.alCambiarEstado(avisar);

function avisar(estado) {
  actual = estado;
  document.documentElement.dataset.modo = estado.modo;
  oyentes.forEach((fn) => fn(estado));
}

export function useEstado() {
  const [estado, setEstado] = useState(actual);
  useEffect(() => {
    oyentes.add(setEstado);
    if (actual) setEstado(actual);
    return () => oyentes.delete(setEstado);
  }, []);
  return estado;
}

export const cambiar = (parcial) => window.widget.cambiar(parcial);

// La hora actual, refrescada al empezar cada minuto (la hora del widget no lleva segundos).
export function useAhora() {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    let id;
    const programar = () => {
      id = setTimeout(() => {
        setAhora(new Date());
        programar();
      }, 60000 - (Date.now() % 60000));
    };
    programar();
    return () => clearTimeout(id);
  }, []);
  return ahora;
}
