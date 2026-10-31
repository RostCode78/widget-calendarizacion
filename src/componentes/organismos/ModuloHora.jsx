import Cristal from '../atomos/Cristal.jsx';
import { useAhora } from '../../estado.js';
import { fechaLarga, horaCorta } from '../../datos/fechas.js';
import './modulos.css';

// Módulo Hora: hora grande sin segundos, día y fecha. Es el ancla visual (sección 7).
export default function ModuloHora() {
  const ahora = useAhora();
  return (
    <Cristal className="modulo modulo-hora">
      <time className="texto-hora" dateTime={ahora.toISOString()}>{horaCorta(ahora)}</time>
      <span className="texto-fecha">{fechaLarga(ahora)}</span>
    </Cristal>
  );
}
