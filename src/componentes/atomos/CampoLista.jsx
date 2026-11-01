import './atomos.css';

// Campo de texto con una lista de opciones (task-12, Día de Nueva tarea). Se ve como el Campo de
// texto de Figma; con el teclado, las flechas cambian la opción sin abrir la lista y Enter envía el
// formulario (como en los demás campos) en lugar de abrirla.
export default function CampoLista({ opciones, className = '', ...resto }) {
  const enviar = (e) => {
    if (e.key !== 'Enter' || !e.currentTarget.form) return;
    e.preventDefault();
    e.currentTarget.form.requestSubmit();
  };
  return (
    <select className={`campo campo-lista texto-tarea ${className}`} onKeyDown={enviar} {...resto}>
      {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
    </select>
  );
}
