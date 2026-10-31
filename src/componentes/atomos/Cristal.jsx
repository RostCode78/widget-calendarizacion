import './Cristal.css';

// Superficie de cristal que llena su ventana. El desenfoque del fondo lo pone Windows
// (backgroundMaterial: 'acrylic' en electron/main.js); aquí van velo, capa clara, brillo y borde.
export default function Cristal({ children, className = '' }) {
  return <div className={`cristal ${className}`}>{children}</div>;
}
