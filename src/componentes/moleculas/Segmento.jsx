import '../../estilos/iconos.css';
import '../atomos/atomos.css';
import './moleculas.css';

// Figma: Segmento (oscuro, claro; activo, inactivo). Selector de Apariencia.
const opciones = { oscuro: { icono: 'luna', texto: 'Oscuro' }, claro: { icono: 'sol', texto: 'Claro' } };

export default function Segmento({ opcion, activo, alElegir }) {
  const { icono, texto } = opciones[opcion];
  return (
    <button type="button" aria-pressed={activo} className="foco segmento texto-fecha" onClick={alElegir}>
      <span className={`icono icono-${icono}`} />
      {texto}
    </button>
  );
}
