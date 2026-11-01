import CampoLista from '../atomos/CampoLista.jsx';
import CampoTexto from '../atomos/CampoTexto.jsx';
import './moleculas.css';

// Figma: Campo con etiqueta. Etiqueta en mayúsculas sobre un Campo de texto
// (o una lista, si trae `opciones`).
export default function CampoConEtiqueta({ etiqueta, className = '', opciones, ...campo }) {
  return (
    <label className={`campo-etiqueta ${className}`}>
      <span className="texto-titulo-modulo">{etiqueta}</span>
      {opciones ? <CampoLista opciones={opciones} {...campo} /> : <CampoTexto {...campo} />}
    </label>
  );
}
