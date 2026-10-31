import '../../estilos/iconos.css';
import Boton from '../atomos/Boton.jsx';
import './organismos.css';

// Figma: Aviso / Inicio y Aviso / Fin (sección 17). Mismo cuerpo; cambian chip, origen y botón.
function Aviso({ icono, estado, boton, titulo, hora, origen, alAceptar }) {
  return (
    <section className="superficie aviso" role="alert">
      <div className="aviso-fila">
        <span className="aviso-chip texto-titulo-modulo"><span className={`icono icono-${icono}`} />{estado}</span>
        <span className="aviso-detalle texto-detalle">{hora}</span>
      </div>
      <p className="aviso-titulo texto-aviso-titulo">{titulo}</p>
      <div className="aviso-fila">
        <span className="aviso-detalle texto-detalle">{origen}</span>
        <Boton tipo="alerta" onClick={alAceptar}>{boton}</Boton>
      </div>
    </section>
  );
}

// `rango` es "19:30 – 20:30" (con cierre) o solo "19:30".
export function AvisoInicio({ titulo, hora, rango, alAceptar }) {
  return <Aviso icono="play-aviso" estado="Hora de iniciar" boton="Iniciar" titulo={titulo} hora={hora} origen={`Notion · ${rango}`} alAceptar={alAceptar} />;
}

export function AvisoFin({ titulo, hora, alAceptar }) {
  return <Aviso icono="bandera" estado="Hora de terminar" boton="Terminar" titulo={titulo} hora={hora} origen="Se marcará como hecha" alAceptar={alAceptar} />;
}
