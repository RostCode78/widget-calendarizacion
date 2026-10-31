import { createRoot } from 'react-dom/client';
import './estilos/tokens.css';
import Fondo from './pruebas/Fondo.jsx';
import Catalogo from './pruebas/Catalogo.jsx';

const vistas = {
  '/fondo': Fondo,
  '/catalogo': Catalogo,
};

// Todas las ventanas comparten el modo; main.js avisa cuando cambia.
const aplicar = (modo) => (document.documentElement.dataset.modo = modo);
window.widget.leerModo().then(aplicar);
window.widget.alCambiarModo(aplicar);

const Vista = vistas[location.hash.slice(1)] ?? (() => null);
createRoot(document.getElementById('raiz')).render(<Vista />);
