import './atomos.css';

// Figma: Boton (primario, alerta, secundario).
export default function Boton({ tipo = 'primario', children, className = '', ...resto }) {
  return (
    <button type="button" className={`foco boton boton-${tipo} texto-boton ${className}`} {...resto}>
      {children}
    </button>
  );
}
