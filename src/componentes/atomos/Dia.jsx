import './atomos.css';

// Figma: Dia (estado normal, hoy, fuera; evento sí/no). El punto marca días con eventos.
export default function Dia({ numero, estado = 'normal', evento = false }) {
  return (
    <div className={`dia dia-${estado}${evento ? ' dia-evento' : ''}`}>
      <span>{numero}</span>
      <span className="dia-punto" />
    </div>
  );
}
