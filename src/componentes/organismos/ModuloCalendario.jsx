import { useState } from 'react';
import '../../estilos/iconos.css';
import '../atomos/atomos.css';
import '../moleculas/moleculas.css';
import Cristal from '../atomos/Cristal.jsx';
import Dia from '../atomos/Dia.jsx';
import { useAhora } from '../../estado.js';
import { cuadriculaDelMes, diaCorto, diaLargo, mesYAnio, mismoDia } from '../../datos/fechas.js';
import { eventosDesde } from '../../datos/ejemplo.js';
import './modulos.css';

const SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// Mini calendario: mes actual, hoy con el acento y un punto en los días con eventos.
// Con la hora oculta ocupa toda la columna y suma el bloque "Próximo" (sección 13).
export default function ModuloCalendario({ alto }) {
  const hoy = useAhora();
  const [desfase, setDesfase] = useState(0);
  const mes = new Date(hoy.getFullYear(), hoy.getMonth() + desfase, 1);
  const eventos = eventosDesde(hoy);
  const proximo = eventos.find((e) => e.fecha >= hoy) ?? null;

  return (
    <Cristal className={`modulo modulo-calendario ${alto ? 'calendario-alto' : ''}`}>
      <div className="modulo-encabezado">
        <span className="texto-titulo-modulo">{mesYAnio(mes)}</span>
        <span className="calendario-flechas">
          <button type="button" className="foco" aria-label="Mes anterior" onClick={() => setDesfase(desfase - 1)}>
            <span className="icono icono-chevron-l" />
          </button>
          <button type="button" className="foco" aria-label="Mes siguiente" onClick={() => setDesfase(desfase + 1)}>
            <span className="icono icono-chevron-r" />
          </button>
        </span>
      </div>
      <div className="calendario-semana texto-detalle" aria-hidden="true">
        {SEMANA.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="calendario-cuadricula">
        {cuadriculaDelMes(mes.getFullYear(), mes.getMonth()).map((d) => (
          <Dia
            key={d.toDateString()}
            numero={d.getDate()}
            estado={mismoDia(d, hoy) ? 'hoy' : d.getMonth() === mes.getMonth() ? 'normal' : 'fuera'}
            evento={eventos.some((e) => mismoDia(e.fecha, d))}
          />
        ))}
      </div>
      {alto && proximo && (
        <div className="proximo">
          <div className="proximo-divisor" />
          <span className="texto-titulo-modulo">Próximo</span>
          <div className="proximo-evento">
            <div className="evento-dia">
              <span className="texto-detalle">{diaCorto(proximo.fecha)}</span>
              <span className="texto-fecha">{proximo.fecha.getDate()}</span>
            </div>
            <span className="textos">
              <span className="texto-tarea">{proximo.texto}</span>
              <span className="texto-detalle">{diaLargo(proximo.fecha)} · {proximo.hora}</span>
            </span>
          </div>
        </div>
      )}
    </Cristal>
  );
}
