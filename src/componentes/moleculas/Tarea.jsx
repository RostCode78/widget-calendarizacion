import '../../estilos/iconos.css';
import './moleculas.css';

// Figma: Tarea (pendiente, en-curso, hecha). En curso muestra play y el rango de horas.
const iconos = { hecha: 'check-tarea', 'en-curso': 'play-tarea' };

export default function Tarea({ texto, hora, estado = 'pendiente' }) {
  return (
    <div className={`tarea tarea-${estado}`}>
      <span className="tarea-marca">{iconos[estado] && <span className={`icono icono-${iconos[estado]}`} />}</span>
      <span className="tarea-texto texto-tarea">{texto}</span>
      <span className="tarea-hora texto-detalle">{hora}</span>
    </div>
  );
}
