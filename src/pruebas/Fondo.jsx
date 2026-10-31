import { useState } from 'react';
import { cambiar } from '../estado.js';
import './pruebas.css';

const ESCENARIOS = [
  { id: 'real', texto: 'Notion' },
  { id: 'normal', texto: 'Normal' },
  { id: 'vacio', texto: 'Vacío' },
  { id: 'muchas', texto: 'Muchas' },
  { id: 'en-curso', texto: 'En curso' },
];

// Página interna de pruebas: uno de los 5 fondos de Figma ("Prueba / Wallpaper 1–5") a pantalla
// completa, debajo del widget. La barra cambia fondo, modo, escenario de ejemplo y hora visible.
export default function Fondo({ estado }) {
  const [fondo, setFondo] = useState(1);
  const boton = (activo, texto, alPulsar) => (
    <button key={texto} aria-pressed={activo} onClick={alPulsar}>{texto}</button>
  );

  return (
    <div className="fondo" style={{ backgroundImage: `url(fondos/fondo-${fondo}.png)` }}>
      <nav className="controles texto-detalle" aria-label="Controles de prueba">
        {[1, 2, 3, 4, 5].map((n) => boton(fondo === n, `Fondo ${n}`, () => setFondo(n)))}
        <span className="separador" />
        {boton(estado.modo === 'oscuro', 'Oscuro', () => cambiar({ modo: 'oscuro' }))}
        {boton(estado.modo === 'claro', 'Claro', () => cambiar({ modo: 'claro' }))}
        <span className="separador" />
        {ESCENARIOS.map((e) => boton(estado.escenario === e.id, e.texto, () => cambiar({ escenario: e.id, panelAbierto: false })))}
        {boton(!estado.horaVisible, 'Ocultar hora', () => cambiar({ horaVisible: !estado.horaVisible }))}
        <span className="separador" />
        {boton(estado.configAbierta, 'Configuración', () => cambiar({ configAbierta: !estado.configAbierta }))}
        <button onClick={() => window.widget.alternarCatalogo()}>Catálogo</button>
        <button onClick={() => window.widget.cerrar()}>Cerrar</button>
      </nav>
    </div>
  );
}
