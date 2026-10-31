# task-03 — Elegir la tecnología y probar lo difícil

## Objetivo
Decidir con qué se construye el widget y comprobar que lo más difícil es posible en Windows 11 antes de invertir en el resto.

## Contexto
- La tecnología aún no está decidida (ver `CLAUDE.md`). Rost es diseñador con conocimientos de frontend, así que conviene una opción basada en web (HTML, CSS, JavaScript/TypeScript).
- Opciones a comparar: Electron y Tauri. Recomendación inicial: Electron, por ser más conocido y tener más ejemplos de ventanas transparentes en Windows. Confirma o corrige con evidencia.
- Lo difícil, que hay que probar primero:
  1. Ventana transparente con efecto cristal (desenfoque del fondo) en Windows 11.
  2. Ventana **pegada al escritorio**: se ve sobre el fondo de pantalla pero debajo de las demás ventanas, y no aparece en la barra de tareas.
  3. Ventana de aviso **siempre visible** encima de todo, que no roba el foco al escribir.
  4. Funcionar con **dos monitores** y elegir en cuál aparece cada ventana.

## Qué hacer
- [ ] Explicar a Rost en lenguaje claro las dos opciones y pedir su aprobación antes de instalar nada.
- [ ] Con la opción aprobada, crear una prueba mínima y desechable (no es el proyecto final) que demuestre los 4 puntos.
- [ ] Anotar qué funcionó, qué no y qué límites hay (por ejemplo, el desenfoque real del fondo).
- [ ] Dejar la decisión escrita en `CLAUDE.md`, en "Datos que usa el widget" (tecnología elegida y por qué).

## Criterios de aceptación
- [ ] Rost aprobó la tecnología.
- [ ] La prueba muestra los 4 puntos funcionando o explica con claridad cuál no se puede y la alternativa.
- [ ] `CLAUDE.md` refleja la decisión.

## Referencias
- `DESIGN-SYSTEM.md`, sección 4 (cristal).
- Ejemplos de referencia que mostró Rost: escritorio con paneles de cristal, widgets de Android con reloj grande.

## Fuera de alcance
- Diseño final de pantallas, datos de Notion o calendario.
