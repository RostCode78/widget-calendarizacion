import { useState } from 'react';
import Cristal from '../componentes/atomos/Cristal.jsx';
import Interruptor from '../componentes/atomos/Interruptor.jsx';
import Dia from '../componentes/atomos/Dia.jsx';
import CeldaPosicion from '../componentes/atomos/CeldaPosicion.jsx';
import Boton from '../componentes/atomos/Boton.jsx';
import BotonIcono from '../componentes/atomos/BotonIcono.jsx';
import CampoTexto from '../componentes/atomos/CampoTexto.jsx';
import Pestana from '../componentes/atomos/Pestana.jsx';
import Chip from '../componentes/atomos/Chip.jsx';
import IconoCalendario from '../componentes/atomos/IconoCalendario.jsx';
import IconoDocumento from '../componentes/atomos/IconoDocumento.jsx';
import Tarea from '../componentes/moleculas/Tarea.jsx';
import Evento from '../componentes/moleculas/Evento.jsx';
import Segmento from '../componentes/moleculas/Segmento.jsx';
import TarjetaPantalla from '../componentes/moleculas/TarjetaPantalla.jsx';
import CampoConEtiqueta from '../componentes/moleculas/CampoConEtiqueta.jsx';
import FilaCuenta from '../componentes/moleculas/FilaCuenta.jsx';
import Pestanas from '../componentes/moleculas/Pestanas.jsx';
import { AvisoInicio, AvisoFin } from '../componentes/organismos/Aviso.jsx';
import NuevaTarea from '../componentes/organismos/NuevaTarea.jsx';
import SeccionCuentas from '../componentes/organismos/SeccionCuentas.jsx';
import './pruebas.css';

// Página interna de pruebas (task-05): todos los componentes con todos sus estados,
// en el mismo orden que la página "Design System" de Figma.
function Muestra({ nombre, children }) {
  return (
    <figure className="catalogo-muestra">
      <figcaption className="texto-detalle tono-atenuado">{nombre}</figcaption>
      <div className="catalogo-fila">{children}</div>
    </figure>
  );
}

export default function Catalogo() {
  const [interruptor, setInterruptor] = useState(true);
  const [celda, setCelda] = useState(1);
  const [pestana, setPestana] = useState('general');
  const [segmento, setSegmento] = useState('oscuro');
  const [pantalla, setPantalla] = useState(1);
  const [texto, setTexto] = useState('Escribe aquí');

  return (
    <Cristal className="catalogo">
      <h1 className="texto-titulo-modulo tono-secundario">Átomos</h1>
      <div className="catalogo-grupo">
        <Muestra nombre="Interruptor">
          <Interruptor encendido={interruptor} alCambiar={setInterruptor} etiqueta="Mostrar la hora" />
          <Interruptor encendido={!interruptor} alCambiar={(v) => setInterruptor(!v)} etiqueta="Ejemplo apagado" />
        </Muestra>
        <Muestra nombre="Dia">
          <Dia numero={15} /><Dia numero={15} evento /><Dia numero={15} estado="hoy" />
          <Dia numero={15} estado="hoy" evento /><Dia numero={15} estado="fuera" /><Dia numero={15} estado="fuera" evento />
        </Muestra>
        <Muestra nombre="Celda posicion">
          {[1, 2].map((n) => <CeldaPosicion key={n} activa={celda === n} alElegir={() => setCelda(n)} etiqueta={`Posición ${n}`} />)}
        </Muestra>
        <Muestra nombre="Boton">
          <Boton>Conectar</Boton><Boton tipo="alerta">Iniciar</Boton><Boton tipo="secundario">Cancelar</Boton>
        </Muestra>
        <Muestra nombre="Boton icono">
          <BotonIcono icono="mas" etiqueta="Nueva tarea" /><BotonIcono icono="cerrar" etiqueta="Cerrar" />
        </Muestra>
        <Muestra nombre="Campo de texto (vacio, lleno, enfocado)">
          <CampoTexto placeholder="Escribe aquí" aria-label="Vacío" />
          <CampoTexto value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Lleno" />
          <CampoTexto defaultValue="Escribe aquí" enfocado aria-label="Enfocado" />
        </Muestra>
        <Muestra nombre="Pestaña">
          <div role="tablist" className="catalogo-fila">
            <Pestana activa>General</Pestana><Pestana activa={false}>General</Pestana>
          </div>
        </Muestra>
        <Muestra nombre="Chip">
          <Chip estado="conectada" /><Chip estado="sin-conectar" />
        </Muestra>
        <Muestra nombre="Icono / Calendario, Icono / Documento">
          <IconoCalendario /><IconoDocumento />
        </Muestra>
      </div>

      <h1 className="texto-titulo-modulo tono-secundario espacio">Moléculas</h1>
      <div className="catalogo-grupo">
        <Muestra nombre="Tarea (pendiente, hecha, en curso)">
          <div className="catalogo-columna" style={{ width: 308 }}>
            <Tarea texto="Tarea de ejemplo" hora="09:00" />
            <Tarea texto="Tarea de ejemplo" hora="09:00" estado="hecha" />
            <Tarea texto="Tarea de ejemplo" hora="10:00 – 11:30" estado="en-curso" />
          </div>
        </Muestra>
        <div className="catalogo-columna">
          <Muestra nombre="Evento">
            <div style={{ width: 308 }}><Evento dia="LUN" numero={2} texto="Evento de ejemplo" hora="19:00" /></div>
          </Muestra>
          <Muestra nombre="Segmento">
            {['oscuro', 'claro'].map((o) => <Segmento key={o} opcion={o} activo={segmento === o} alElegir={() => setSegmento(o)} />)}
          </Muestra>
          <Muestra nombre="Pestañas">
            <Pestanas seccion={pestana} alCambiar={setPestana} />
          </Muestra>
        </div>
        <div className="catalogo-columna">
          <Muestra nombre="Tarjeta pantalla">
            {[1, 2].map((n) => (
              <TarjetaPantalla key={n} nombre={`Pantalla ${n}`} detalle={n === 1 ? 'Principal' : 'Secundaria'} seleccionada={pantalla === n} alElegir={() => setPantalla(n)} />
            ))}
          </Muestra>
          <Muestra nombre="Campo con etiqueta">
            <CampoConEtiqueta etiqueta="Nombre" placeholder="Escribe aquí" />
          </Muestra>
        </div>
        <Muestra nombre="Fila de cuenta (sin conectar, conectada, pegar clave)">
          <div className="catalogo-columna">
            <FilaCuenta icono={<IconoCalendario />} nombre="Google Calendar" detalle="Para ver tus eventos" />
            <FilaCuenta icono={<IconoCalendario />} nombre="Google Calendar" detalle="Para ver tus eventos" estado="conectada" />
            <FilaCuenta icono={<IconoDocumento />} nombre="Notion" detalle="Para ver y crear tus tareas" estado="pegar-clave" enfocado />
          </div>
        </Muestra>
      </div>

      <h1 className="texto-titulo-modulo tono-secundario espacio">Organismos</h1>
      <div className="catalogo-grupo">
        <div className="catalogo-columna">
          <Muestra nombre="Aviso / Inicio">
            <AvisoInicio titulo="Planear la semana" hora="19:30" rango="19:30 – 20:30" />
          </Muestra>
          <Muestra nombre="Aviso / Fin">
            <AvisoFin titulo="Planear la semana" hora="20:30" />
          </Muestra>
        </div>
        <Muestra nombre="Formulario / Nueva tarea (vacio)">
          <NuevaTarea />
        </Muestra>
        <Muestra nombre="Formulario / Nueva tarea (completo)">
          <NuevaTarea inicial={{ nombre: 'Preparar entrega de EBAC', inicio: '19:30', cierre: '20:30' }} />
        </Muestra>
        <Muestra nombre="Seccion / Cuentas">
          <SeccionCuentas />
        </Muestra>
      </div>
    </Cristal>
  );
}
