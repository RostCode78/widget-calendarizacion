import '../../estilos/iconos.css';
import '../atomos/atomos.css';
import './moleculas.css';

// Figma: Tarea (pendiente, en-curso, hecha). En curso muestra play y el rango de horas.
// Con `alMarcar`, el círculo es un botón que marca la tarea como hecha (o la regresa).
const iconos = { hecha: 'check-tarea', 'en-curso': 'play-tarea' };

export default function Tarea({ texto, hora, estado = 'pendiente', alMarcar }) {
  const icono = iconos[estado] && <span className={`icono icono-${iconos[estado]}`} />;
  return (
    <div className={`tarea tarea-${estado}`}>
      {alMarcar ? (
        <button
          type="button" className="foco tarea-marca" onClick={alMarcar}
          aria-label={estado === 'hecha' ? `Marcar "${texto}" como pendiente` : `Marcar "${texto}" como hecha`}
        >
          {icono}
        </button>
      ) : (
        <span className="tarea-marca">{icono}</span>
      )}
      <span className="tarea-texto texto-tarea">{texto}</span>
      <span className="tarea-hora texto-detalle">{hora}</span>
    </div>
  );
}
