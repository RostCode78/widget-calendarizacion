import Cristal from '../atomos/Cristal.jsx';
import Evento from '../moleculas/Evento.jsx';
import { useAhora } from '../../estado.js';
import { diaCorto, rango, sumarDias } from '../../datos/fechas.js';
import { TituloModulo } from './hoy.jsx';
import './modulos.css';

const VISIBLES = 2; // Caben 2 sin que el módulo crezca (decidido por Rost en task-06).

// Módulo Esta semana: eventos de los próximos 7 días, empezando hoy. `eventos`: { texto, fecha, hora }.
export default function ModuloSemana({ eventos, aviso }) {
  const hoy = useAhora();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const fin = sumarDias(inicio, 6);
  const semana = eventos.filter((e) => e.fecha >= inicio && e.fecha <= fin);

  return (
    <Cristal className="modulo modulo-semana">
      <div className="modulo-encabezado">
        <TituloModulo titulo="Esta semana" aviso={aviso} />
        <span className="texto-detalle">{rango(inicio, fin)}</span>
      </div>
      {semana.slice(0, VISIBLES).map((e) => (
        <Evento key={e.id ?? e.texto} dia={diaCorto(e.fecha)} numero={e.fecha.getDate()} texto={e.texto} hora={e.hora || 'Todo el día'} />
      ))}
      {semana.length > VISIBLES && <span className="modulo-mas texto-detalle">+{semana.length - VISIBLES} más</span>}
    </Cristal>
  );
}
