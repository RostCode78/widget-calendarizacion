import '../../estilos/iconos.css';
import './atomos.css';

// Figma: Chip (conectada, sin-conectar). Siempre con ícono, nunca con punto (principio 6).
const variantes = {
  conectada: { icono: 'check-chip', texto: 'Conectada' },
  'sin-conectar': { icono: 'desvinculado', texto: 'Sin conectar' },
};

export default function Chip({ estado }) {
  const { icono, texto } = variantes[estado];
  return (
    <span className={`chip chip-${estado} texto-titulo-modulo`}>
      <span className={`icono icono-${icono}`} />
      {texto}
    </span>
  );
}
