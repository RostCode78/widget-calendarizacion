import '../../estilos/iconos.css';
import Boton from '../atomos/Boton.jsx';
import './organismos.css';

// Figma: Aviso / Inicio y Aviso / Fin (sección 17). Mismo cuerpo; cambian chip, origen y botón.
function Aviso({ icono, estado, boton, titulo, hora, origen, alAceptar, atajo, className = '' }) {
  return (
    <section className={`superficie aviso ${className}`} role="alert">
      <div className="aviso-fila">
        <span className="aviso-chip texto-titulo-modulo"><span className={`icono icono-${icono}`} />{estado}</span>
        <span className="aviso-detalle texto-detalle">{hora}</span>
      </div>
      <p className="aviso-titulo texto-aviso-titulo">{titulo}</p>
      <div className="aviso-fila">
        <span className="aviso-detalle texto-detalle">{origen}</span>
        <Boton tipo="alerta" onClick={alAceptar} aria-keyshortcuts={atajo} title={atajo && `${boton} (Ctrl+Alt+Enter)`}>{boton}</Boton>
      </div>
    </section>
  );
}

// `rango` es "19:30 – 20:30" (con cierre) o solo "19:30".
// `className="aviso-ventana"` hace que la superficie llene su propia ventana (task-10).
export function AvisoInicio({ rango, ...props }) {
  return <Aviso icono="play-aviso" estado="Hora de iniciar" boton="Iniciar" origen={`Notion · ${rango}`} {...props} />;
}

export function AvisoFin(props) {
  return <Aviso icono="bandera" estado="Hora de terminar" boton="Terminar" origen="Se marcará como hecha" {...props} />;
}
