import Cristal from '../componentes/atomos/Cristal.jsx';
import './pruebas.css';

export default function MuestraTexto() {
  return (
    <Cristal>
      <div className="texto-hora">10:42</div>
      <div className="texto-fecha tono-secundario">Sábado, 31 de octubre</div>
      <h1 className="texto-titulo-modulo tono-secundario espacio">Hoy</h1>
      <p className="texto-tarea">Revisar propuesta de diseño</p>
      <p className="texto-detalle tono-secundario">Notion · 10:00 – 11:30</p>
      <p className="texto-detalle tono-atenuado">Texto atenuado: días de la semana, horas</p>
      <p className="texto-aviso-titulo espacio">Título de aviso</p>
      <p className="texto-boton">Botón · Iniciar</p>
    </Cristal>
  );
}
