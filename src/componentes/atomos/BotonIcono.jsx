import '../../estilos/iconos.css';
import './atomos.css';

// Figma: Boton icono (mas, cerrar). Sin texto visible, así que la etiqueta es obligatoria.
export default function BotonIcono({ icono, etiqueta, className = '', ...resto }) {
  return (
    <button type="button" aria-label={etiqueta} className={`foco boton-icono boton-icono-${icono} ${className}`} {...resto}>
      <span className={`icono icono-${icono}`} />
    </button>
  );
}
