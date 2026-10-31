import IconoCalendario from '../atomos/IconoCalendario.jsx';
import IconoDocumento from '../atomos/IconoDocumento.jsx';
import FilaCuenta from '../moleculas/FilaCuenta.jsx';
import './organismos.css';

// Figma: Seccion / Cuentas (sección 19). Los estados de cada fila los decide quien la usa.
export default function SeccionCuentas({ google = {}, notion = {} }) {
  return (
    <section className="cuentas">
      <h3 className="cuentas-titulo texto-titulo-modulo">Cuentas</h3>
      <FilaCuenta icono={<IconoCalendario />} nombre="Google Calendar" detalle="Para ver tus eventos" {...google} />
      <FilaCuenta icono={<IconoDocumento />} nombre="Notion" detalle="Para ver y crear tus tareas" {...notion} />
      <p className="cuentas-nota texto-detalle">Tus claves se guardan de forma segura en este equipo.</p>
    </section>
  );
}
