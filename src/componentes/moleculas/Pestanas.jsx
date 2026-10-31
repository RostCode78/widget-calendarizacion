import { useRef } from 'react';
import Pestana from '../atomos/Pestana.jsx';
import './moleculas.css';

// Figma: Pestañas (general, cuentas). Las flechas izquierda y derecha cambian de pestaña.
const secciones = [{ id: 'general', texto: 'General' }, { id: 'cuentas', texto: 'Cuentas' }];

export default function Pestanas({ seccion, alCambiar }) {
  const lista = useRef(null);
  const teclas = (e) => {
    const paso = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!paso) return;
    const i = (secciones.findIndex((s) => s.id === seccion) + paso + secciones.length) % secciones.length;
    alCambiar(secciones[i].id);
    lista.current.children[i].focus();
  };
  return (
    <div role="tablist" className="pestanas" ref={lista} onKeyDown={teclas}>
      {secciones.map((s) => (
        <Pestana key={s.id} activa={seccion === s.id} onClick={() => alCambiar(s.id)}>{s.texto}</Pestana>
      ))}
    </div>
  );
}
