import '../../estilos/iconos.css';
import '../atomos/atomos.css';
import './moleculas.css';

// Figma: Tarjeta pantalla (seleccionada, normal).
export default function TarjetaPantalla({ nombre, detalle, seleccionada, alElegir }) {
  return (
    <button type="button" aria-pressed={seleccionada} className="foco tarjeta-pantalla" onClick={alElegir}>
      <span className="tarjeta-pantalla-icono"><span className="icono icono-monitor" /></span>
      <span className="textos">
        <span className="texto-fecha">{nombre}</span>
        <span className="texto-detalle">{detalle}</span>
      </span>
      {seleccionada && <span className="icono icono-check-pantalla" />}
    </button>
  );
}
