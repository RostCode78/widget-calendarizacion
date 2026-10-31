import Cristal from '../atomos/Cristal.jsx';
import Evento from '../moleculas/Evento.jsx';
import { useAhora } from '../../estado.js';
import { diaCorto, rango, sumarDias } from '../../datos/fechas.js';
import { eventosDesde } from '../../datos/ejemplo.js';
import './modulos.css';

const VISIBLES = 2; // Caben 2 sin que el módulo crezca (decidido por Rost en task-06).

// Módulo Esta semana: eventos de los próximos 7 días, empezando hoy.
export default function ModuloSemana() {
  const hoy = useAhora();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const fin = sumarDias(inicio, 6);
  const eventos = eventosDesde(inicio).filter((e) => e.fecha >= inicio && e.fecha <= fin);

  return (
    <Cristal className="modulo modulo-semana">
      <div className="modulo-encabezado">
        <span className="texto-titulo-modulo">Esta semana</span>
        <span className="texto-detalle">{rango(inicio, fin)}</span>
      </div>
      {eventos.slice(0, VISIBLES).map((e) => (
        <Evento key={e.texto} dia={diaCorto(e.fecha)} numero={e.fecha.getDate()} texto={e.texto} hora={e.hora} />
      ))}
      {eventos.length > VISIBLES && <span className="modulo-mas texto-detalle">+{eventos.length - VISIBLES} más</span>}
    </Cristal>
  );
}
