import Boton from '../atomos/Boton.jsx';
import CampoTexto from '../atomos/CampoTexto.jsx';
import Chip from '../atomos/Chip.jsx';
import './moleculas.css';

// Figma: Fila de cuenta (sin-conectar, pegar-clave, conectada).
// `icono` es un átomo Icono / Calendario o Icono / Documento. Si la clave falla, `error`
// reemplaza la nota de pegar-clave; Enter en el campo equivale a Conectar.
export default function FilaCuenta({ icono, nombre, detalle, estado = 'sin-conectar', clave, alCambiarClave, alConectar, alDesconectar, enfocado, conectando, error }) {
  const conectada = estado === 'conectada';
  const pegarClave = estado === 'pegar-clave';
  return (
    <div className="fila-cuenta">
      <div className="fila-cuenta-encabezado">
        {icono}
        <span className="textos">
          <span className="texto-tarea">{nombre}</span>
          <span className="texto-detalle">{detalle}</span>
        </span>
        <Chip estado={conectada ? 'conectada' : 'sin-conectar'} />
        {!pegarClave && (conectada
          ? <Boton tipo="secundario" onClick={alDesconectar}>Desconectar</Boton>
          : <Boton onClick={alConectar}>Conectar</Boton>)}
      </div>
      {pegarClave && (
        <>
          <p className={`fila-cuenta-nota texto-detalle ${error ? 'fila-cuenta-error' : ''}`} role={error ? 'alert' : undefined}>
            {error ?? 'Crea una integración interna en Notion, copia su clave y pégala aquí. Se guarda solo en este equipo.'}
          </p>
          <div className="fila-cuenta-clave">
            <CampoTexto
              type="password" placeholder="Pega aquí la clave" aria-label={`Clave de ${nombre}`} autoComplete="off" autoFocus
              value={clave} onChange={(e) => alCambiarClave?.(e.target.value)} enfocado={enfocado}
              onKeyDown={(e) => e.key === 'Enter' && alConectar?.()}
            />
            <Boton onClick={alConectar} disabled={conectando}>{conectando ? 'Conectando…' : 'Conectar'}</Boton>
          </div>
        </>
      )}
    </div>
  );
}
