import './atomos.css';

// Figma: Celda posicion (libre, activa). La activa muestra la miniatura del widget.
export default function CeldaPosicion({ activa, alElegir, etiqueta }) {
  return (
    <button type="button" aria-pressed={activa} aria-label={etiqueta} className="foco celda" onClick={alElegir}>
      {activa && (
        <span className="miniatura" aria-hidden="true">
          <span><i style={{ width: 26, height: 12 }} /><i style={{ width: 26, height: 24 }} /></span>
          <span><i style={{ width: 32, height: 22 }} /><i style={{ width: 32, height: 14 }} /></span>
        </span>
      )}
    </button>
  );
}
