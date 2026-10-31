import { useEffect, useRef, useState } from 'react';
import '../../estilos/iconos.css';
import '../atomos/atomos.css';
import Cristal from '../atomos/Cristal.jsx';
import CeldaPosicion from '../atomos/CeldaPosicion.jsx';
import Interruptor from '../atomos/Interruptor.jsx';
import Pestanas from '../moleculas/Pestanas.jsx';
import Segmento from '../moleculas/Segmento.jsx';
import TarjetaPantalla from '../moleculas/TarjetaPantalla.jsx';
import SeccionCuentas from './SeccionCuentas.jsx';
import { cambiar } from '../../estado.js';
import './configuracion.css';

const POSICIONES = [
  'Arriba a la izquierda', 'Arriba al centro', 'Arriba a la derecha',
  'Centro a la izquierda', 'Centro', 'Centro a la derecha',
  'Abajo a la izquierda', 'Abajo al centro', 'Abajo a la derecha',
];

// Panel / Configuración (sección 13 y 19): pestañas General y Cuentas. Los cambios se
// aplican al instante, sin botón de guardar. La ventana toma el alto del contenido.
export default function PanelConfiguracion({ estado }) {
  const [seccion, setSeccion] = useState('general');
  const [fondo, setFondo] = useState(null);
  const contenido = useRef(null);
  const posicion = estado.posiciones[estado.pantalla];

  useEffect(() => {
    window.widget.fondoDeEscritorio().then(setFondo);
    const cerrarConEsc = (e) => e.key === 'Escape' && cambiar({ configAbierta: false });
    window.addEventListener('keydown', cerrarConEsc);
    // Alto de la ventana = contenido + relleno (24 × 2) + borde (1 × 2).
    const medida = new ResizeObserver(([e]) => window.widget.altoConfiguracion(e.contentRect.height + 50));
    medida.observe(contenido.current);
    return () => {
      window.removeEventListener('keydown', cerrarConEsc);
      medida.disconnect();
    };
  }, []);

  return (
    <Cristal className="config">
      <div className="config-contenido" ref={contenido}>
        <div className="config-encabezado">
          <div className="config-titulos">
            <h1 className="texto-aviso-titulo">Configuración</h1>
            <p className="texto-detalle">Los cambios se aplican al instante</p>
          </div>
          <button type="button" className="foco config-cerrar" aria-label="Cerrar configuración" onClick={() => cambiar({ configAbierta: false })}>
            <span className="icono icono-cerrar-config" />
          </button>
        </div>
        <div className="config-pestanas"><Pestanas seccion={seccion} alCambiar={setSeccion} /></div>
        {seccion === 'general' ? <General estado={estado} posicion={posicion} fondo={fondo} /> : <Cuentas notion={estado.notion} />}
      </div>
    </Cristal>
  );
}

function General({ estado, posicion, fondo }) {
  return (
    <>
      <section className="config-seccion">
        <h2 className="texto-titulo-modulo">Pantalla</h2>
        <div className="config-tarjetas">
          <TarjetaPantalla nombre="Pantalla 1" detalle="Principal" seleccionada={estado.pantalla === 1} alElegir={() => cambiar({ pantalla: 1 })} />
          <TarjetaPantalla
            nombre="Pantalla 2" detalle={estado.hayPantalla2 ? 'Secundaria' : 'No conectada'}
            seleccionada={estado.pantalla === 2} alElegir={() => estado.hayPantalla2 && cambiar({ pantalla: 2 })}
          />
        </div>
        <button type="button" className="foco config-enlace texto-detalle" onClick={() => window.widget.identificarPantallas()}>
          <span className="icono icono-ojo" />Identificar pantallas
        </button>
      </section>

      <section className="config-seccion">
        <h2 className="texto-titulo-modulo">Posición</h2>
        <div className="vista-previa" style={fondo ? { '--fondo-escritorio': `url(${fondo})` } : undefined}>
          <div className="vista-previa-cuadricula">
            {POSICIONES.map((nombre, i) => (
              <CeldaPosicion
                key={nombre} etiqueta={nombre} activa={posicion === i + 1}
                alElegir={() => cambiar({ posiciones: { ...estado.posiciones, [estado.pantalla]: i + 1 } })}
              />
            ))}
          </div>
        </div>
        <div className="config-leyenda">
          <span className="texto-fecha">{POSICIONES[posicion - 1]}</span>
          <span className="texto-detalle">Toca otra celda para moverlo</span>
        </div>
      </section>

      <section className="config-seccion">
        <h2 className="texto-titulo-modulo">Apariencia</h2>
        <div className="selector-apariencia">
          {['oscuro', 'claro'].map((m) => <Segmento key={m} opcion={m} activo={estado.modo === m} alElegir={() => cambiar({ modo: m })} />)}
        </div>
      </section>

      <section className="config-seccion">
        <h2 className="texto-titulo-modulo">Módulos</h2>
        <div className="config-fila">
          <span className="textos">
            <span className="texto-fecha">Mostrar la hora</span>
            <span className="texto-detalle">Ocúltala si tu fondo ya tiene reloj</span>
          </span>
          <Interruptor encendido={estado.horaVisible} alCambiar={(v) => cambiar({ horaVisible: v })} etiqueta="Mostrar la hora" />
        </div>
      </section>
    </>
  );
}

// Mensajes cuando la clave de Notion no sirve. Se muestran en lugar de la nota de la fila.
const ERRORES_NOTION = {
  clave: 'La clave no es válida. Cópiala de nuevo desde Notion.',
  'sin-base': 'La clave funciona, pero no ve la base «Tareas de carrera». Compártela con la integración desde Notion (••• › Conexiones).',
  'sin-conexion': 'Sin conexión. Revisa tu internet e intenta de nuevo.',
  servicio: 'Notion no respondió. Intenta de nuevo en un momento.',
};

// Pestaña Cuentas. Notion (task-08): la clave se valida y se guarda en el Administrador de
// credenciales de Windows desde el proceso principal; aquí solo pasa de paso. Google llega en task-09.
function Cuentas({ notion }) {
  const [pegando, setPegando] = useState(false);
  const [clave, setClave] = useState('');
  const [conectando, setConectando] = useState(false);
  const [error, setError] = useState(null);

  const conectar = async () => {
    if (!pegando) return setPegando(true);
    if (!clave.trim() || conectando) return;
    setConectando(true);
    const resultado = await window.widget.conectarNotion(clave);
    setConectando(false);
    if (resultado.ok) {
      setPegando(false);
      setClave('');
      setError(null);
    } else setError(resultado.error);
  };

  const filaNotion = notion.conectada
    ? { estado: 'conectada', detalle: `Base: ${notion.base}`, alDesconectar: () => window.widget.desconectarNotion() }
    : {
        estado: pegando ? 'pegar-clave' : 'sin-conectar',
        clave, alCambiarClave: setClave, alConectar: conectar, conectando, error: ERRORES_NOTION[error],
      };
  return <SeccionCuentas notion={filaNotion} />;
}
