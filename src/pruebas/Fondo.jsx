import { useState } from 'react';
import './pruebas.css';

// Página interna de pruebas: uno de los 5 fondos de Figma ("Prueba / Wallpaper 1–5") a pantalla completa.
export default function Fondo() {
  const [fondo, setFondo] = useState(1);
  const [modo, setModo] = useState('oscuro');
  const cambiarModo = (m) => {
    setModo(m);
    window.widget.cambiarModo(m);
  };

  return (
    <div className="fondo" style={{ backgroundImage: `url(fondos/fondo-${fondo}.png)` }}>
      <nav className="controles texto-detalle" aria-label="Controles de prueba">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} aria-pressed={fondo === n} onClick={() => setFondo(n)}>Fondo {n}</button>
        ))}
        <span className="separador" />
        {['oscuro', 'claro'].map((m) => (
          <button key={m} aria-pressed={modo === m} onClick={() => cambiarModo(m)}>{m === 'oscuro' ? 'Oscuro' : 'Claro'}</button>
        ))}
        <span className="separador" />
        <button onClick={() => window.widget.cerrar()}>Cerrar</button>
      </nav>
    </div>
  );
}
