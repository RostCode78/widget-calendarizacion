import './atomos.css';

// Figma: Pestaña (activa, inactiva).
export default function Pestana({ activa, children, ...resto }) {
  return (
    <button type="button" role="tab" aria-selected={activa} tabIndex={activa ? 0 : -1} className="foco pestana texto-boton" {...resto}>
      {children}
    </button>
  );
}
