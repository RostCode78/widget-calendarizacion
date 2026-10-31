import { createRoot } from 'react-dom/client';
import './estilos/tokens.css';
import Fondo from './pruebas/Fondo.jsx';
import MuestraColores from './pruebas/MuestraColores.jsx';
import MuestraTexto from './pruebas/MuestraTexto.jsx';

const vistas = {
  '/fondo': Fondo,
  '/muestra/colores': MuestraColores,
  '/muestra/texto': MuestraTexto,
};

// Todas las ventanas comparten el modo; main.js avisa cuando cambia.
const aplicar = (modo) => (document.documentElement.dataset.modo = modo);
window.widget.leerModo().then(aplicar);
window.widget.alCambiarModo(aplicar);

const Vista = vistas[location.hash.slice(1)] ?? (() => null);
createRoot(document.getElementById('raiz')).render(<Vista />);
