import { useState } from 'react';
import Boton from '../atomos/Boton.jsx';
import BotonIcono from '../atomos/BotonIcono.jsx';
import IconoDocumento from '../atomos/IconoDocumento.jsx';
import CampoConEtiqueta from '../moleculas/CampoConEtiqueta.jsx';
import './organismos.css';

// Figma: Formulario / Nueva tarea (vacio, completo). Sección 20: Nombre abre enfocado;
// Inicio y Cierre son opcionales. Guardar en Notion llega en una tarea posterior.
const vacia = { nombre: '', dia: 'Hoy', inicio: '', cierre: '' };

export default function NuevaTarea({ inicial = vacia, alCrear, alCancelar }) {
  const [tarea, setTarea] = useState(inicial);
  const campo = (clave) => ({ value: tarea[clave], onChange: (e) => setTarea({ ...tarea, [clave]: e.target.value }) });
  const crear = (e) => {
    e.preventDefault();
    if (tarea.nombre.trim()) alCrear?.(tarea);
  };

  return (
    <form className="superficie nueva-tarea" onSubmit={crear}>
      <div className="nueva-tarea-encabezado">
        <h2 className="texto-aviso-titulo">Nueva tarea</h2>
        <BotonIcono icono="cerrar" etiqueta="Cerrar" onClick={alCancelar} />
      </div>
      <CampoConEtiqueta etiqueta="Nombre" placeholder="¿Qué vas a hacer?" autoFocus={!inicial.nombre} {...campo('nombre')} />
      <div className="nueva-tarea-horas">
        <CampoConEtiqueta etiqueta="Día" {...campo('dia')} />
        <CampoConEtiqueta etiqueta="Inicio" placeholder="Hora" {...campo('inicio')} />
        <CampoConEtiqueta etiqueta="Cierre" placeholder="Sin hora" {...campo('cierre')} />
      </div>
      <p className="nueva-tarea-nota texto-detalle">
        <IconoDocumento />
        Se guarda en Notion. Sin hora de cierre, solo habrá aviso de inicio y la marcas como hecha desde la lista.
      </p>
      <div className="nueva-tarea-acciones">
        <Boton tipo="secundario" onClick={alCancelar}>Cancelar</Boton>
        <Boton type="submit">Crear tarea</Boton>
      </div>
    </form>
  );
}
