import { useState } from 'react';
import Boton from '../atomos/Boton.jsx';
import BotonIcono from '../atomos/BotonIcono.jsx';
import IconoDocumento from '../atomos/IconoDocumento.jsx';
import CampoConEtiqueta from '../moleculas/CampoConEtiqueta.jsx';
import { diasParaElegir } from '../../datos/fechas.js';
import { moverHora, normalizarHora } from '../../datos/horas.js';
import './organismos.css';

// Figma: Formulario / Nueva tarea (vacio, completo). Sección 20: Nombre abre enfocado;
// Inicio y Cierre son opcionales. Día: lista de 7 días; horas en 24 h (decidido por Rost, task-12).
// `alCrear(datos)` devuelve { ok } o { error }; si falla, lo escrito se queda y el error
// reemplaza la nota, en color de alerta (como la Fila de cuenta).
const NOTA = 'Se guarda en Notion. Sin hora de cierre, solo habrá aviso de inicio y la marcas como hecha desde la lista.';
const ERRORES = {
  'sin-conexion': 'Sin conexión. Lo que escribiste sigue aquí; intenta de nuevo.',
  servicio: 'Notion no respondió. Lo que escribiste sigue aquí; intenta de nuevo.',
  clave: 'Notion rechazó la clave. Revísala en Configuración › Cuentas.',
  'sin-base': 'Notion no encuentra la base «Tareas de carrera». Revisa que siga compartida con la integración.',
};

// Revisa lo escrito; devuelve el mensaje del primer problema o los datos listos para Notion.
function revisar({ nombre, dia, inicio, cierre }) {
  const hInicio = normalizarHora(inicio);
  const hCierre = normalizarHora(cierre);
  if (!nombre.trim()) return { error: 'Escribe el nombre de la tarea.' };
  if (hInicio === null) return { error: 'Escribe la hora de inicio como 19:30.' };
  if (hCierre === null) return { error: 'Escribe la hora de cierre como 20:30.' };
  if (hCierre && !hInicio) return { error: 'Para poner hora de cierre, agrega también la de inicio.' };
  if (hCierre && hCierre <= hInicio) return { error: 'La hora de cierre debe ser después del inicio.' };
  return { datos: { texto: nombre.trim(), dia, inicio: hInicio, fin: hCierre } };
}

export default function NuevaTarea({ inicial, alCrear, alCancelar, className = '', ref }) {
  const [dias] = useState(() => diasParaElegir());
  const [tarea, setTarea] = useState({ nombre: '', dia: dias[0].valor, inicio: '', cierre: '', ...inicial });
  const [error, setError] = useState(null);
  const [creando, setCreando] = useState(false);
  const cambiar = (clave, valor) => {
    setTarea((t) => ({ ...t, [clave]: valor }));
    setError(null); // al corregir, vuelve la nota
  };
  const campo = (clave) => ({ value: tarea[clave], onChange: (e) => cambiar(clave, e.target.value) });

  // Horas: al salir del campo quedan como "19:30"; las flechas suben o bajan 15 minutos.
  const campoHora = (clave) => ({
    ...campo(clave),
    inputMode: 'numeric',
    onBlur: () => normalizarHora(tarea[clave]) !== null && cambiar(clave, normalizarHora(tarea[clave])),
    onKeyDown: (e) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      cambiar(clave, moverHora(normalizarHora(tarea[clave]) ?? '', e.key === 'ArrowUp' ? 15 : -15));
    },
  });

  const crear = async (e) => {
    e.preventDefault();
    if (creando) return;
    const { error: problema, datos } = revisar(tarea);
    setError(problema ?? null);
    if (problema || !alCrear) return;
    setCreando(true);
    const resultado = await alCrear(datos);
    setCreando(false);
    if (resultado?.error) setError(ERRORES[resultado.error] ?? ERRORES.servicio);
  };

  return (
    <form className={`superficie nueva-tarea ${className}`} onSubmit={crear} ref={ref} noValidate>
      <div className="nueva-tarea-encabezado">
        <h2 className="texto-aviso-titulo">Nueva tarea</h2>
        <BotonIcono icono="cerrar" etiqueta="Cerrar" onClick={alCancelar} />
      </div>
      <CampoConEtiqueta etiqueta="Nombre" placeholder="¿Qué vas a hacer?" autoFocus={!tarea.nombre} {...campo('nombre')} />
      <div className="nueva-tarea-horas">
        <CampoConEtiqueta etiqueta="Día" opciones={dias} {...campo('dia')} />
        <CampoConEtiqueta etiqueta="Inicio" placeholder="Hora" {...campoHora('inicio')} />
        <CampoConEtiqueta etiqueta="Cierre" placeholder="Sin hora" {...campoHora('cierre')} />
      </div>
      <p className={`nueva-tarea-nota texto-detalle ${error ? 'nueva-tarea-error' : ''}`} role={error ? 'alert' : undefined}>
        {!error && <IconoDocumento />}
        {error ?? NOTA}
      </p>
      <div className="nueva-tarea-acciones">
        <Boton tipo="secundario" onClick={alCancelar}>Cancelar</Boton>
        <Boton type="submit" disabled={creando}>{creando ? 'Creando…' : 'Crear tarea'}</Boton>
      </div>
    </form>
  );
}
