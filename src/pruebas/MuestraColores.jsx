import Cristal from '../componentes/atomos/Cristal.jsx';
import './pruebas.css';

const tokens = ['ink-primary', 'ink-secondary', 'ink-muted', 'accent', 'accent-soft', 'alert', 'alert-soft', 'done', 'done-soft', 'line-soft'];

export default function MuestraColores() {
  return (
    <Cristal>
      <h1 className="texto-titulo-modulo tono-secundario">Colores</h1>
      <ul className="muestras">
        {tokens.map((t) => (
          <li key={t}>
            <span className="muestra" style={{ background: `var(--${t})` }} />
            <span className="texto-tarea" style={{ color: t.startsWith('ink') ? `var(--${t})` : undefined }}>{t}</span>
          </li>
        ))}
      </ul>
      <p className="texto-boton boton-acento">ink-on-accent sobre accent</p>
    </Cristal>
  );
}
