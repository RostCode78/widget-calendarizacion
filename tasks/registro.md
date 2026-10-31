# Registro de tareas

> Claude Code: lee este archivo primero en cada sesión. Compara "Última tarea completada" con los archivos `task-NN.md` de esta carpeta. Si existe una tarea con número mayor, esa es la nueva.

## Estado actual

- **Última tarea completada:** `task-04.md` (esqueleto, tokens y cristal; contraste ajustado, 2026-10-31)
- **Tarea en curso:** ninguna
- **Siguiente tarea por hacer:** `task-05.md`. Hay tareas hasta `task-12.md`; se hacen en orden.

## Pendientes y problemas abiertos

- [x] Regla de la nueva tarea: Inicio y Cierre son opcionales; sin hora no hay avisos (aprobada por Rost).
- [x] task-01: aprobada por Rost.
- [x] task-02: aprobada por Rost.
- [x] Regla de avisos en la posición 3 (esquina superior izquierda): aprobada por Rost.
- [x] Qué significa "aceptar": iniciar la tarea. El segundo aviso (cierre) la marca como hecha.
- [x] Tareas con una sola hora: solo tienen aviso de inicio y se marcan como hechas desde la lista (decidido por Rost).
- [x] Figma actualizado a `DESIGN-SYSTEM.md` v0.7: avisos a la izquierda en las posiciones 6 y 9, vista de Nueva tarea a la derecha en la posición 4, y el módulo Hoy muestra 4 tareas.
- [x] Conexión de Notion: integración interna con clave pegada una vez (decidido por Rost). Se agregó el estado pegar-clave a la Fila de cuenta.
- [x] La lógica de avisos de `task-10` ahora pide una prueba automática de los 4 casos.
- [x] `task-04`: Rost eligió una ventana por módulo con cristal real (esquinas de ~8 px que dibuja Windows, no 24 px) y React + Vite.
- [x] `task-04`, contraste: Rost aprobó la propuesta. Aplicada en `DESIGN-SYSTEM.md` v0.8, Figma y `tokens.css` (ver historial).
- [ ] `task-06`: pegar al escritorio sin PowerShell (la prueba tarda ~1 s en arrancar por eso) y volver a pegarlo si el Explorador de Windows se reinicia. No se probó el reinicio del Explorador.
- [ ] Borrar la carpeta `prueba-03/` cuando Rost la haya visto (es desechable).

## Historial

### task-04 — Contraste aprobado y cierre
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Qué se hizo:** Rost aprobó la propuesta de contraste. Modo oscuro: velo al 60 %, `ink-secondary` `#D9DFE9`, `ink-muted` `#C3CAD7`. Modo claro: `ink-muted` `#4D586C`. Se cambió en `tokens.css`, en las variables de Figma (colección "Widget / Tokens") y en `DESIGN-SYSTEM.md` (secciones 3, 4 y 15; pasa a v0.8 con una nota del contraste medido). Se volvió a medir sobre el cristal real en la zona vacía del cristal, peor punto de cada fondo: oscuro en los fondos 1 y 5 → principal 7.4/6.8, secundario 6.2/5.7, atenuado 5.1/4.6; claro en los 5 fondos → principal 9.8–11.6, secundario 5.8–6.9, atenuado 4.5–5.4. Todo pasa 4.5:1 en el uso de la sección 14.
- **Qué falló:** nada. Nota: en modo oscuro sobre los fondos claros (2, 3 y 4) el atenuado queda en 3.9–4.4; ahí corresponde el modo claro según la sección 14.
- **Qué falta:** nada de esta tarea. Sigue `task-05`.

### task-04 — Esqueleto del proyecto, tokens y cristal
- **Fecha:** 2026-10-31
- **Estado:** Parcial (cerrada después en la entrada de arriba)
- **Qué se hizo:** Rost eligió una ventana por módulo con cristal real y React + Vite. Se instalaron React 19, Vite 8 y Electron 45 (con `@vitejs/plugin-react`). Se crearon `electron/main.js` (con `ventanaCristal()` para abrir ventanas con cristal), `src/estilos/tokens.css` (todos los tokens de color en oscuro y claro, radios, espacios y los 7 estilos de texto, comprobados contra las variables de Figma), el átomo `Cristal` (velo, capa clara, brillo y borde sobre el desenfoque de Windows) y una página interna de pruebas (`npm run dev`) con los 5 fondos exportados de Figma, botones de fondo y modo, y dos muestras de cristal (colores y texto). Las fuentes Nunito y Quicksand se descargaron de Google Fonts al proyecto. Cambiar el modo cambia todos los colores sin tocar los componentes. El tinte del cristal de Windows ahora sigue al modo del widget, lo que mejoró mucho el modo claro.
- **Qué falló:** el criterio "el texto sobre cristal se lee en los 5 fondos" no se cumple para el texto secundario y el atenuado (ver la propuesta en "Pendientes y problemas abiertos"). El cristal de Windows mezcla una capa clara propia que en Figma no existe, así que el modo oscuro queda más claro que el diseño. La primera vez, Electron tardó unos 30 s en descargar su programa.
- **Qué falta:** que Rost decida el contraste. Con su aprobación se actualizan `DESIGN-SYSTEM.md` (secciones 3, 4 y 15), Figma y `tokens.css`, y se cierra la tarea.

### task-03 — Elegir la tecnología y probar lo difícil
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Qué se hizo:** Rost aprobó Electron. Se hizo una prueba desechable en `prueba-03/` (Electron 45, sin otras dependencias) y se comprobó con capturas en los dos monitores: (1) el cristal desenfoca el fondo real; (2) el widget queda debajo de una ventana normal, no sube al hacerle clic y sigue visible tras Win+D; (3) el aviso aparece encima de todo, se escribieron 9 palabras seguidas mientras aparecía y ninguna se perdió, y pulsar "Iniciar" lo cierra sin quitar el foco; (4) con `--pantalla=2` widget y aviso salen en el segundo monitor. La decisión y sus límites quedaron en `CLAUDE.md`.
- **Qué falló:** la primera ventana de prueba no apareció por abrirse oculta; se repitió bien. No se pudo ver la barra de tareas en las capturas (está oculta automáticamente), así que "no aparece en la barra de tareas" se confía a `skipTaskbar` sin comprobación visual.
- **Qué falta:** las decisiones de `task-04` anotadas en "Pendientes y problemas abiertos".

### Diseño — Ventanas laterales según la posición del widget
- **Fecha:** 2026-10-31
- **Estado:** Completada (diseño; falta el visto bueno de Rost)
- **Qué se hizo:** Rost pidió revisar dónde aparecen las ventanas cuando el widget está al centro. Se encontró que la configuración, centrada en pantalla, taparía el widget en las columnas del centro, y que la lista abierta (680 px de alto) se salía de la pantalla en la fila de arriba y chocaba con la barra de tareas en la de abajo. Se definió una regla única para configuración, lista abierta y Nueva tarea (sección 16 de `DESIGN-SYSTEM.md`): lado con más espacio (el centro, a la izquierda), una sola a la vez, y la lista se ajusta a 16 px de los bordes. Se crearon 5 vistas de comprobación y se movieron las pantallas de configuración a su posición exacta.
- **Qué falló:** la miniatura de posición del panel copiado seguía marcando la posición 6; se corrigió.
- **Qué falta:** el visto bueno de Rost. `task-07.md` y `task-12.md` deben seguir la regla de la sección 16.

### Diseño — Notion con clave pegada y ajustes de la revisión v0.7
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Qué se hizo:** Rost eligió conectar Notion con una integración interna. Se agregó la variante pegar-clave a la Fila de cuenta y la pantalla "Configuración · Cuentas (pegar clave de Notion)". Se actualizó Figma a la revisión v0.7: avisos arriba a la izquierda en las posiciones 6 y 9 y vista de Nueva tarea a la derecha en la posición 4. Se quitaron las decisiones abiertas ya resueltas y se pidió una prueba automática de los avisos en `task-10.md`.
- **Qué falló:** nada relevante. Un intento falló al buscar una instancia recién cambiada; se separó en dos pasos.
- **Qué falta:** ejecutar las tareas de código.

### Revisión de documentos — correcciones 1 a 6
- **Fecha:** 2026-10-31
- **Estado:** Completada (aprobada por Rost)
- **Qué se hizo:** Se revisaron todos los documentos y se corrigieron 6 problemas. En `DESIGN-SYSTEM.md` (pasó a v0.7): la sección 8 ya no describe el aviso viejo ("Es hora" y "Aceptar") y remite a la 17; el módulo Hoy muestra hasta 4 tareas en todas las secciones; los avisos pasan a la izquierda en toda la columna derecha (posiciones 3, 6 y 9), porque con 3 avisos apilados se tapaba el widget en la posición 6; el formulario de Nueva tarea se abre hacia el lado con más espacio, porque en la columna izquierda no cabía. En las tareas: `task-08` guarda y reenvía los cambios hechos sin internet; `task-10` solo recupera avisos de hoy tras estar apagada; `task-12` sigue la nueva regla del formulario; `task-07` y `task-10` siguen la nueva regla de avisos.
- **Qué falló:** nada
- **Qué falta:** actualizar Figma y decidir la conexión con Notion (ver "Pendientes y problemas abiertos").

### Diseño — Design System atómico, cuentas y nueva tarea
- **Fecha:** 2026-10-31
- **Estado:** Completada (diseño aprobado por Rost, incluida la regla de horas opcionales)
- **Qué se hizo:** Se creó la página "Design System" en Figma y se movieron ahí los 9 componentes, organizados en Átomos, Moléculas y Organismos. Se crearon los componentes que faltaban: Boton, Boton icono, Campo de texto, Pestaña, Chip, iconos, Campo con etiqueta, Fila de cuenta, Pestañas, Formulario / Nueva tarea y Sección / Cuentas. La configuración ahora tiene pestañas General y Cuentas (con 3 vistas de Cuentas). El módulo Hoy tiene botón + en todas las pantallas y hay 2 vistas de Nueva tarea. `DESIGN-SYSTEM.md` pasó a v0.6 (secciones 18 a 20). Se actualizaron `CLAUDE.md`, task-05, 07, 08, 09 y se creó `task-12.md`.
- **Qué falló:** los conjuntos de variantes tenían un tamaño viejo y recortaban sus variantes al moverlos; se ajustaron. El formulario salió sin desenfoque de cristal y se corrigió.
- **Qué falta:** ejecutar las tareas de código.

### task-03 a task-11 — Tareas de código creadas
- **Fecha:** 2026-10-31
- **Estado:** Completada (solo se escribieron las tareas; ninguna se ha ejecutado)
- **Qué se hizo:** Se crearon 9 tareas para Claude Code, en orden: 03 tecnología y prueba de lo difícil, 04 esqueleto y tokens, 05 componentes, 06 widget en reposo, 07 configuración y posiciones, 08 Notion, 09 calendario, 10 avisos de inicio y fin, 11 pulido e instalador.
- **Qué falló:** nada
- **Qué falta:** ejecutarlas. `task-08` y `task-09` piden a Rost datos antes de empezar (base de Notion y calendario).

### task-01 y task-02 — Cierre y tablero del flujo de una tarea
- **Fecha:** 2026-10-31
- **Estado:** Completada (Rost aprobó ambas)
- **Qué se hizo:** Rost confirmó que las tareas con una sola hora solo tienen aviso de inicio y se marcan como hechas desde la lista. Se creó el tablero "Flujo de una tarea" en Figma con 4 pasos (aviso de inicio, tarea en curso, aviso de cierre, tarea hecha) y la nota de tareas con una sola hora. Se cerraron task-01 y task-02.
- **Qué falló:** al crear el tablero, los contenedores internos salieron con fondo blanco; se quitaron.
- **Qué falta:** nada de diseño pendiente. Siguiente paso posible: tareas de código para Claude Code (`task-03.md` en adelante) a partir de `DESIGN-SYSTEM.md` y el archivo de Figma.

### task-01 — Flujo de dos avisos (iniciar y terminar)
- **Fecha:** 2026-10-31
- **Estado:** Parcial (diseño hecho, falta aprobación de Rost)
- **Qué se hizo:** El componente Aviso se dividió en `Aviso / Inicio` (ícono play, botón "Iniciar") y `Aviso / Fin` (ícono bandera, botón "Terminar"). Se agregó la variante `en-curso` a Tarea (fondo suave, play en círculo, hora con rango). `Escritorio / Aviso` ahora muestra ambos avisos apilados y se creó `Escritorio / Tarea en curso`. `DESIGN-SYSTEM.md` pasó a v0.5 (sección 17).
- **Qué falló:** el primer intento falló porque al renombrar el componente cambiaron los nombres de sus instancias; se buscaron por componente. Además, la variante nueva necesitó enlazar sus textos a las propiedades Texto y Hora.
- **Qué falta:** confirmar tareas con una sola hora y la aprobación de Rost. Falta el tablero "Flujo de una tarea" (4 pasos) si Rost lo quiere.

### task-01 y task-02 — Modo claro y oscuro, y posiciones preestablecidas
- **Fecha:** 2026-10-31
- **Estado:** Parcial (diseño hecho, falta aprobación de Rost)
- **Qué se hizo:** Rost eligió dos modos. Las variables de color ahora tienen modo Oscuro y modo Claro (`bg/night` pasó a llamarse `ink/on-accent`). Se agregó el selector Apariencia al panel de configuración (componente Segmento) y se hicieron versiones en modo claro de los fondos 2, 3 y 4 y del panel. Se definieron 9 posiciones fijas con coordenadas exactas y se crearon sus 9 vistas, más un ejemplo con la lista abierta hacia la derecha. Los escritorios anteriores se alinearon a la posición 6 (centro a la derecha). Los avisos quedaron a 32 px del borde. `DESIGN-SYSTEM.md` pasó a v0.4 (secciones 15 y 16).
- **Qué falló:** nada. Un par de capturas fallaron por conexión y se repitieron.
- **Qué falta:** ver "Pendientes y problemas abiertos".

### task-01 y task-02 — Estados, configuración y pruebas con fondos
- **Fecha:** 2026-10-31
- **Estado:** Parcial (diseño hecho, falta aprobación y una decisión)
- **Qué se hizo:** En Figma se diseñaron el estado vacío, el de muchas tareas (con barra de progreso y texto cortado) y la lista abierta de "Ver 8 más" (panel con 12 tareas agrupadas por franja). Se diseñó el panel de configuración (Pantalla 1 o 2, cuadrícula 3 × 3 y mostrar la hora) y el widget con la hora oculta (calendario ocupa la columna con bloque "Próximo"). Se probó el widget sobre los 5 fondos. Se agregaron los componentes Interruptor, Tarjeta pantalla y Celda posición, y la variable `done/soft`. `DESIGN-SYSTEM.md` pasó a v0.3.
- **Qué falló:** el fondo 4 (blanco) deja casi ilegible el texto atenuado; los fondos 2 y 3 quedan justos. Una captura falló por error de conexión y se repitió. Rost avisó que faltaba la vista del enlace "Ver 8 más"; ya está diseñada.
- **Qué falta:** decidir el tratamiento de fondos claros y la aprobación de Rost.

### task-01 — Ajustes tras la revisión de Rost
- **Fecha:** 2026-10-31
- **Estado:** Parcial
- **Qué se hizo:** Se aprobó y aplicó el cristal con velo oscuro (variables `glass/veil` y `glass/tint` en Figma y en `DESIGN-SYSTEM.md`, ya en v0.2). Se confirmó la fuente Nunito. Se decidió que el módulo Hora se queda y se podrá ocultar (nueva `task-02.md`). El chip "Es hora" del aviso cambió el punto por un ícono de campana en el componente Aviso, y se actualizó en las dos instancias.
- **Qué falló:** nada
- **Qué falta:** ver "Pendientes y problemas abiertos".

### task-01 — Diseñar el widget en reposo (propuesta visual en Figma)
- **Fecha:** 2026-10-31
- **Estado:** Parcial
- **Qué se hizo:** En el archivo de Figma "Calendarizacion" se crearon las variables (colores y medidas), 7 estilos de texto y el estilo de efecto cristal. Se hicieron los componentes Tarea (pendiente y hecha), Evento, Dia del calendario y Aviso. Se compusieron dos escritorios de 1920 × 1080 sobre el fondo de Rost: "Escritorio / Reposo" (módulos Hora, Mini calendario, Hoy y Esta semana) y "Escritorio / Aviso" (el mismo widget con dos avisos flotantes apilados arriba a la derecha).
- **Qué falló:** nada relevante. Un error de código en un intento se limpió y se repitió sin dejar restos.
- **Qué falta:** ver "Pendientes y problemas abiertos".

### Proyecto iniciado
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Qué se hizo:** Se definió el alcance (solo UX/UI con Claude, sin código por ahora), los dos estados del widget (reposo y aviso) y la dirección estética. Se crearon `CLAUDE.md`, `DESIGN-SYSTEM.md` y la carpeta `tasks`.
- **Qué falló:** nada
- **Qué falta:** empezar con `task-01.md`
