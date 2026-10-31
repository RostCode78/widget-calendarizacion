import './moleculas.css';

// Figma: Evento. Día de la semana y número a la izquierda, hora a la derecha.
export default function Evento({ dia, numero, texto, hora }) {
  return (
    <div className="evento">
      <div className="evento-dia">
        <span className="texto-detalle">{dia}</span>
        <span className="texto-fecha">{numero}</span>
      </div>
      <span className="evento-texto texto-tarea">{texto}</span>
      <span className="evento-hora texto-detalle">{hora}</span>
    </div>
  );
}
