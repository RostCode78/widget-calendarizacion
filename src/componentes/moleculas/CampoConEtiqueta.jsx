import CampoTexto from '../atomos/CampoTexto.jsx';
import './moleculas.css';

// Figma: Campo con etiqueta. Etiqueta en mayúsculas sobre un Campo de texto.
export default function CampoConEtiqueta({ etiqueta, className = '', ...campo }) {
  return (
    <label className={`campo-etiqueta ${className}`}>
      <span className="texto-titulo-modulo">{etiqueta}</span>
      <CampoTexto {...campo} />
    </label>
  );
}
