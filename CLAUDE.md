# CLAUDE.md — Widget Calendarizacion

Guía de trabajo para Claude Code en este proyecto. Léela completa al iniciar cada sesión.

## Qué es este proyecto

Un widget de escritorio para Windows 11 que muestra los pendientes de Rost (desde Notion) y sus eventos (desde su calendario) en un solo lugar, para verlos sin abrir otras apps.

**Dos estados del widget:**

1. **Reposo:** el widget vive pegado al fondo del escritorio. Muestra la hora, las tareas de hoy, los próximos eventos de la semana y un mini calendario del mes. No debe verse saturado ni vacío.
2. **Aviso:** cuando una tarea llega a su hora, aparece una ventana flotante pequeña y persistente. Solo se oculta cuando Rost la acepta. **Aceptar el aviso de inicio = empezar la tarea (queda "en curso"); el aviso de fin la marca como hecha.** Las tareas con una sola hora solo tienen aviso de inicio y se marcan como hechas desde la lista.

**Estética:** cristal translúcido, módulos flotantes y redondeados, colores suaves y fríos sin ser helados, aire lo-fi, limpio y ordenado, como un cuarto tranquilo. Todo lo visual vive en `DESIGN-SYSTEM.md`.

## Quién es Rost (para comunicarte con él)

- Diseñador UX/UI con conocimientos de frontend. No es especialista en redes ni backend.
- Prefiere explicaciones en lenguaje claro, sin jerga técnica pesada.
- Trabajamos en español.

## Ritual de inicio (obligatorio, en este orden)

1. Lee `tasks/registro.md`.
2. Identifica la **última tarea completada** (campo "Última tarea completada" al inicio del registro) y si hay alguna tarea **pendiente, fallida o incompleta** anotada.
3. Mira qué archivos `task-NN.md` existen en `tasks/`.
4. Decide qué hacer:
   - Si el registro marca una tarea fallida o incompleta, **retómala primero**.
   - Si existe un archivo con número mayor al de la última tarea completada, **esa es la nueva tarea**. Ejemplo: el registro dice `task-15.md` y existe `task-16.md` → la tarea nueva es `task-16.md`.
   - Si hay varias nuevas, hazlas en orden numérico, una a la vez.
   - Si no hay tareas nuevas, dilo y pregunta a Rost qué sigue. No inventes trabajo.
5. Lee la tarea completa y `DESIGN-SYSTEM.md` antes de tocar nada.
6. Resume en 2-3 frases lo que vas a hacer y empieza.

## Cómo trabajar una tarea

- Una tarea a la vez. No empieces otra hasta cerrar la actual en el registro.
- Cumple los **criterios de aceptación** de la tarea. Si alguno no se puede cumplir, no lo ocultes: anótalo en el registro.
- Si la tarea es ambigua o choca con el design system, pregunta antes de decidir.
- No cambies el design system por tu cuenta. Si hace falta un cambio, propónlo a Rost y, con su aprobación, actualízalo y anótalo en el registro.
- Verifica tu trabajo antes de marcarlo como completado (ábrelo, ejecútalo, compáralo con el diseño).
- No agregues funciones que la tarea no pidió.

## Cómo cerrar una tarea (actualizar el registro)

Al terminar, **siempre** actualiza `tasks/registro.md`:

1. Cambia el campo "Última tarea completada" solo si la tarea quedó realmente completa.
2. Agrega una entrada nueva al historial con: fecha, tarea, estado (`Completada`, `Parcial` o `Fallida`), qué se hizo, **qué falló** y **qué falta**.
3. Si algo quedó pendiente, agrégalo en la sección "Pendientes y problemas abiertos".
4. Cuando algo de esa sección se resuelva, tacha o muévelo al historial.

Nunca marques una tarea como completada si tiene fallos sin resolver. Márcala `Parcial` y explica.

## Formato de las tareas

- Ubicación: `tasks/task-NN.md` (dos dígitos: `task-01.md`, `task-02.md`...).
- Una tarea por archivo. Usa `tasks/_plantilla.md` como base. El archivo `_plantilla.md` no es una tarea.
- Los números nunca se reutilizan ni se saltan sin razón.

## Datos que usa el widget

- **Tareas:** vienen de Notion (task-08). Base **Tareas de carrera** (elegida por Rost): `Tarea` (título), `Estado` (Pendiente / En curso / Hecha) y `Fecha de trabajo` (día; con hora = inicio, con rango = inicio y cierre). Integración interna con clave guardada en el Administrador de credenciales de Windows (`Calendarizacion/Notion`, vía `electron/credenciales.js`). API en `electron/notion.js`; sincronización, copia local (`notion-tareas.json`) y cola de cambios sin internet (`notion-pendientes.json`, ambos en `%APPDATA%\calendarizacion`) en `electron/tareas.js`. Lee hoy y los próximos 6 días cada 2 minutos y al despertar el equipo.
- **Eventos:** vienen de Google Calendar (task-09), solo el calendario principal de `ros.tunales@gmail.com`, con permiso de solo lectura (`calendar.events.readonly`). La app "Widget Calendarizacion" vive en el proyecto de Google Cloud de Rost, publicada (en producción, sin verificar) con su portafolio como página principal y una política de privacidad en `rost.aztlanapp.com`. Autorización en el navegador con redirección local y PKCE (`electron/google.js`). El cliente (`Calendarizacion/Google/cliente`) y el permiso (`Calendarizacion/Google/permiso`) se guardan en el Administrador de credenciales; los eventos, en `google-eventos.json` (`%APPDATA%\calendarizacion`). Sincronización en `electron/calendario.js`: lee 12 semanas desde el lunes de la cuadrícula del mes, cada 2 minutos y al despertar el equipo.
- **Tecnología: Electron** (aprobada por Rost y probada en `task-03.md`, 2026-10-31). Es web (HTML, CSS, JavaScript), trae el cristal de Windows 11 listo y no requiere instalar nada más que Node.
- Cómo se resolvió lo difícil (probado en Windows 11, build 26300, con dos monitores):
  - **Cristal:** `backgroundMaterial: 'acrylic'` en la ventana, más el velo de la sección 4 en CSS. El desenfoque lo hace Windows sobre **toda la ventana rectangular** (esquinas de unos 8 px), no por módulo, y su intensidad no se ajusta. Para módulos flotantes separados con 24 px de radio hay que usar una ventana por módulo; se decide en `task-04.md`.
  - **Pegado al escritorio:** ventana sin marco, `skipTaskbar`, `focusable: false` y, ya mostrada, su dueño pasa a ser el escritorio (`Progman`) y se manda al fondo. Así queda debajo de las demás ventanas y sobrevive a Win+D. Se hace desde Node con la librería `koffi` (`electron/escritorio.js`, sin PowerShell; aprobada por Rost en task-06) y se repite cuando Windows avisa que el Explorador se reinició (mensaje `TaskbarCreated`). Como no recibe foco, no puede tener campos de texto: la configuración y Nueva tarea van en ventanas aparte (ya lo dice la sección 16).
  - **Aviso:** `alwaysOnTop` nivel `screen-saver`, `focusable: false` y `showInactive()`. No quita el foco al aparecer ni al pulsar su botón. Desde task-10, una ventana de 320 × 128 por aviso (`actualizarAvisos` en `electron/main.js`, revisa cada 15 s). Qué avisos tocan lo decide `electron/avisos.js` a partir del estado de cada tarea en Notion (no guarda nada aparte), con su prueba en `electron/avisos.test.js`.
  - **Dos monitores:** `screen.getAllDisplays()`; Pantalla 1 = la principal.
- **Por dentro: React + Vite** (elegido por Rost en `task-04.md`). **Una ventana por módulo** con cristal real de Windows (elegido por Rost): las esquinas de cada ventana son de ~8 px, no de 24 px.
- Estructura: `electron/` (ventanas, proceso principal), `src/estilos/tokens.css` (tokens en modo oscuro y claro, estilos de texto), `src/componentes/atomos|moleculas|organismos/`, `src/iconos/` (SVG de Figma; se pintan como máscara con `src/estilos/iconos.css` para que tomen el color del modo), `src/fuentes/` (Nunito y Quicksand, licencia libre), `src/pruebas/` (página interna de pruebas) y `src/public/fondos/` (los 5 fondos de prueba de Figma).
- Widget en reposo: 4 ventanas (Hora, Mini calendario, Hoy, Esta semana) más la ventana de la lista abierta. El estado compartido (modo, escenario de ejemplo, hora visible, panel abierto) vive en `electron/main.js` y llega a cada ventana con `src/estado.js`. Los datos de ejemplo (`src/datos/ejemplo.js`) solo se usan en los escenarios de la página de pruebas; el escenario por defecto muestra Notion y Google reales.
- Configuración (task-07): se guarda en `%APPDATA%\calendarizacion\configuracion.json` (modo, hora visible, pantalla y posición 1–9 por pantalla; nunca claves). Se abre desde el ícono de la bandeja de Windows (`electron/icono-bandeja.png`). Posiciones, ventanas laterales y animación de 250 ms viven en `electron/main.js`.
- Comandos: `npm run dev` abre el widget sobre la página de pruebas (fondo de Figma debajo, barra para cambiar fondo, modo, escenario y hora, y botones Configuración y Catálogo) con recarga al editar; `npm start` compila y abre solo el widget; `npm test` corre las pruebas automáticas (con el corredor de pruebas de Node, sin dependencias).
- Al cerrar `npm run dev` desde Claude Code, cerrar también sus procesos de Electron y Node (detener la tarea no siempre los cierra).
- El tinte del cristal de Windows sigue al modo del widget (`nativeTheme.themeSource`), no al tema del sistema.

## Reglas generales

- Antes de instalar dependencias o crear estructura de código, confirma con Rost.
- Nunca guardes claves, tokens ni credenciales en archivos del proyecto.
- Mantén los textos de la interfaz en español.
- Organiza los componentes con Atomic Design (átomos, moléculas, organismos), igual que la página "Design System" de Figma. Sección 18 de `DESIGN-SYSTEM.md`.
- Respeta la accesibilidad: el texto sobre cristal debe seguir siendo legible con distintos fondos de pantalla.

## Archivos clave

| Archivo | Para qué sirve |
|---|---|
| `CLAUDE.md` | Estas instrucciones |
| `DESIGN-SYSTEM.md` | Colores, tipografía, cristal, componentes y estados |
| `tasks/registro.md` | Historial de lo hecho, lo que falló y lo que falta |
| `tasks/task-NN.md` | Cada tarea individual |
| `tasks/_plantilla.md` | Plantilla para crear tareas nuevas |
| Figma "Calendarizacion" (clave `5ZrhcMIJU0XcWDoA5UvO0h`, página "Propuesta") | Diseño visual de todas las pantallas y componentes |
