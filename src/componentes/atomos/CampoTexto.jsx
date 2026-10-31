import './atomos.css';

// Figma: Campo de texto (vacio, lleno, enfocado). Vacío y lleno salen del valor;
// enfocado, del foco real. `enfocado` solo fuerza el aspecto para la página de pruebas.
export default function CampoTexto({ enfocado, className = '', ...resto }) {
  return <input type="text" className={`campo texto-tarea ${enfocado ? 'campo-enfocado' : ''} ${className}`} {...resto} />;
}
