import './atomos.css';

// Figma: Interruptor (encendido, apagado).
export default function Interruptor({ encendido, alCambiar, etiqueta }) {
  return (
    <button
      type="button" role="switch" aria-checked={encendido} aria-label={etiqueta}
      className="foco interruptor" onClick={() => alCambiar?.(!encendido)}
    />
  );
}
