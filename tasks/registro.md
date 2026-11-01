# Registro de tareas

> Claude Code: lee este archivo primero en cada sesión. Compara "Última tarea completada" con los archivos `task-NN.md` de esta carpeta. Si existe una tarea con número mayor, esa es la nueva.

## Estado actual

- **Última tarea completada:** `task-10.md` (avisos de inicio y de fin, 2026-10-31)
- **Tarea en curso:** ninguna
- **Siguiente tarea por hacer:** `task-11.md`. Hay tareas hasta `task-12.md`; se hacen en orden.

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
- [x] `task-06`: pegar al escritorio sin PowerShell y volver a pegarlo si el Explorador se reinicia. Hecho con koffi (ver historial).
- [x] Borrar la carpeta `prueba-03/`: Rost la borró en el commit de task-05.
- [ ] **Wallpaper Engine tras reiniciar el Explorador:** el widget se vuelve a pegar bien (comprobado: dueño = el nuevo escritorio, justo encima de él y visible), pero después del reinicio Wallpaper Engine se engancha dentro del escritorio de otra forma y, al pulsar Win+D, su imagen tapa el widget. Antes del reinicio Win+D funciona. Probablemente se arregla reiniciando Wallpaper Engine; no se probó para no tocar esa app. Revisar si vuelve a pasar.
- [x] `task-05`, texto de ejemplo en un campo: Rost decidió que el texto de ejemplo (placeholder) va siempre en `ink-muted`, también con el campo enfocado ("¿Qué vas a hacer?" en Nueva tarea), para que no parezca texto ya escrito.
- [ ] `task-07` y `task-12`: el Aviso y el Formulario / Nueva tarea traen su propia superficie con esquinas de 24 px, como en Figma. Cuando vivan en su propia ventana, Windows dibuja esquinas de ~8 px, así que ahí la superficie tiene que llenar la ventana (como el átomo `Cristal`).

## Historial

### task-10 — Avisos de inicio y de fin
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Decisiones de Rost:**
  - Si llega la hora de cierre y el aviso de inicio no se aceptó, queda solo el aviso de fin.
  - La tarea hecha muestra su rango de horas, como el paso 4 del tablero "Flujo de una tarea".
  - `DESIGN-SYSTEM.md` pasa a v0.13 (secciones 8, 16 y 17).
- **Qué se hizo:**
  - **Regla (`electron/avisos.js`):** decide qué avisos tocan a partir del estado de cada tarea, sin archivo propio:
    - Solo avisan las tareas de hoy, con hora y sin hacer.
    - Inicio: desde la hora de inicio, mientras la tarea no esté en curso.
    - Fin: desde la hora de cierre, mientras no esté hecha.
    - Como sale del estado de Notion (y de la cola sin internet), un aviso sin aceptar sigue ahí tras cerrar el widget o apagar el equipo.
  - **Prueba automática (`electron/avisos.test.js`, `npm test`):** cubre los 4 casos: inicio y cierre, solo inicio, sin hora y computadora dormida (lo de ayer no avisa y la hora de cierre ya pasada manda). Usa el corredor de pruebas de Node, sin dependencias nuevas.
  - **Ventanas (`electron/main.js`):**
    - Una ventana por aviso, de 320 × 128, siempre encima, sin foco.
    - Se colocan arriba a 32 px del borde de la pantalla elegida: a la derecha, o a la izquierda en las posiciones 3, 6 y 9.
    - Se apilan con 12 px de separación y se reacomodan con la animación de 250 ms.
    - Se revisan cada 15 segundos y cada vez que cambian las tareas.
  - **Aceptar:** Iniciar escribe "En curso" en Notion y Terminar escribe "Hecha", por la misma cola que el resto, así que sirve sin internet.
  - **Vista:** Aviso / Inicio y Aviso / Fin llenan su ventana (esquinas de ~8 px) y entran con un desvanecido de 250 ms, que se apaga si Windows pide reducir animaciones. Los títulos largos se cortan con "…".
  - **Arreglo de task-08 (`electron/tareas.js`):** cuando Notion recibía un cambio de estado pero la lectura siguiente fallaba, el cambio no quedaba en la copia local, y tras reiniciar sin internet la tarea volvía a su estado anterior. Ahora se guarda en cuanto Notion lo confirma.
- **Verificación:**
  - **Prueba automática:** `npm test`, 4 de 4.
  - **Widget real con tareas de prueba y Notion simulado:** en una carpeta aparte; no se tocó tu Notion.
    - Aparecieron dos avisos de inicio apilados a la izquierda (posición 6), sin quitar el foco a la ventana activa.
    - **Iniciar:** la fila quedó resaltada con play y "18:59 – 19:03", se envió "En curso" y el otro aviso subió a su lugar.
    - **Cerrar y abrir el widget:** el aviso sin aceptar volvió y el aceptado no.
    - **A la hora de cierre:** apareció "Hora de terminar" y, a su hora, el inicio de otra tarea. Fueron tres avisos apilados.
    - **Terminar:** la tarea quedó hecha con palomita y su rango, y se envió "Hecha".
    - **Tarea con una sola hora:** Iniciar la dejó en curso, sin aviso de fin; tocar su círculo en la lista la marcó como hecha.
    - La tarea de ayer y la tarea sin hora no avisaron.
    - **Posiciones 2, 3 y 9:** a la derecha en la 2 y a la izquierda en la 3 y la 9. En ninguna tapan el widget; en las demás posiciones vale la misma cuenta (sección 16).
    - **Pantalla 2:** los avisos salen en su esquina.
- **Qué falló:**
  - El fallo de la copia local de task-08 que se describe arriba; se encontró en esta prueba y quedó corregido.
  - No se probó con el equipo dormido de verdad. Ese caso lo cubren la prueba automática y la revisión cada 15 segundos, que también corre al despertar.
  - No se probó con tu Notion real, porque tus tareas de hoy no tienen hora.
- **Qué falta:** nada de esta tarea. Sigue `task-11`.

### task-09 — Conectar con el calendario (eventos)
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Decisiones de Rost:** solo el calendario principal (`ros.tunales@gmail.com`), sin los de feriados; conexión autorizando en el navegador. La app de Google quedó **publicada sin verificar** (para que el permiso no venza cada 7 días), con su portafolio como página principal y una política de privacidad en `rost.aztlanapp.com`. `DESIGN-SYSTEM.md` pasa a v0.12 (sección 19).
- **Qué se hizo:**
  - **Google (`electron/google.js`):**
    - Permiso de solo lectura (`calendar.events.readonly`), autorizado en el navegador con redirección local y PKCE.
    - Solo se guarda el permiso de renovación, en el Administrador de credenciales; el acceso se pide al vuelo.
    - Lee los eventos (los repetidos ya separados), omite los cancelados y distingue "sin conexión", "clave", "servicio", "cancelada" y "cliente".
    - Desconectar revoca el permiso en Google.
  - **Sincronización (`electron/calendario.js`):** lee 12 semanas desde el lunes de la cuadrícula del mes, cada 2 minutos y al despertar o desbloquear el equipo. Guarda lo último leído en `google-eventos.json` para usarlo sin internet.
  - **Archivos (`electron/archivos.js`):** lectura y escritura de JSON compartida con la configuración y Notion.
  - **Cuentas:** Conectar pide el archivo del cliente (solo la primera vez) y abre el navegador. La fila queda "Conectada · Calendario: ros.tunales@gmail.com". Los errores se explican bajo la fila.
  - **Widget:**
    - **Esta semana** muestra los eventos reales de los próximos 7 días (2 y "+N más"), con su aviso discreto si algo falla.
    - **Mini calendario:** punto en los días con evento.
    - **Próximo** (con la hora oculta) muestra el siguiente evento que no ha pasado. Los de todo el día dicen "Todo el día".
- **Verificación:**
  - **Simulada:** Google simulado en una app de Electron aislada: archivo del cliente correcto y equivocado, PKCE, permiso negado, eventos con hora, de todo el día y cancelados, y sin internet.
  - **Con tu calendario real:**
    - Los 17 eventos guardados (29 oct – 5 nov) coinciden uno a uno con el calendario consultado aparte (título, día y hora).
    - Esta semana muestra "31 oct – 6 nov", Bloque de carrera (sáb 31, 10:00), Proyectos personales (dom 1, 10:00) y "+10 más" (12 eventos en esos 7 días).
    - El mini calendario marca del 29 de octubre al 5 de noviembre.
    - Con la hora oculta, Próximo muestra "Proyectos personales · Domingo · 10:00".
- **Qué falló:**
  - Para publicar la app, Google pidió página principal y política de privacidad. Se resolvió con el portafolio de Rost.
  - En la prueba de "Ocultar hora" la hora quedó oculta, porque uno de los clics automáticos no cayó en el interruptor mientras Rost usaba la pantalla. Rost la vuelve a activar en Configuración.
  - No se probó un error real de Google, como quitar el permiso desde la cuenta; los errores se probaron con Google simulado.
- **Qué falta:** nada de esta tarea. "Esta semana" incluye los eventos de hoy que ya pasaron (cuenta los 7 días desde hoy, como dice la sección 7). Sigue `task-10`.

### task-08 — Conectar con Notion (tareas)
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Decisiones de Rost:** base **Tareas de carrera**, con **Fecha de trabajo** como día y horas (inicio y cierre). La otra opción era "Mis Tareas" (con "Fecha límite"). `DESIGN-SYSTEM.md` pasa a v0.11 (sección 19).
- **Qué se hizo:**
  - **Clave (`electron/credenciales.js`):** se guarda en el Administrador de credenciales de Windows con koffi (CredWriteW / CredReadW / CredDeleteW), sin dependencias nuevas.
  - **API de Notion (`electron/notion.js`):**
    - Versión 2025-09-03.
    - Busca entre lo compartido la base que tenga Tarea, Estado y Fecha de trabajo.
    - Lee las tareas de hoy y los próximos 6 días (con paginación) y escribe el Estado.
    - Distingue "sin conexión", "clave", "sin base" y "servicio".
  - **Sincronización (`electron/tareas.js`):**
    - Guarda en el equipo lo último leído, para usarlo sin internet.
    - Guarda una cola de cambios de estado: se ven al instante, se reintentan en cada lectura y se descartan si la página ya no existe.
    - Lee cada 2 minutos, al despertar el equipo y al desbloquearlo.
  - **Cuentas:** Conectar → pegar clave → se valida → la fila queda "Conectada · Base: Tareas de carrera" y aparece Desconectar. Los errores se explican en la propia fila.
  - **Módulo Hoy y lista abierta:**
    - Muestran las tareas reales de hoy, con chip y barra de progreso calculados de ellas.
    - El círculo marca la tarea como hecha o la regresa a pendiente.
    - Las tareas sin hora van primero y en la franja "Mañana".
    - Si algo falla, aparece un aviso discreto junto a "Hoy".
  - **Página de pruebas:** el escenario por defecto es "Notion" (datos reales); los de ejemplo siguen en la barra.
- **Verificación:**
  - **Simulada:**
    - Cliente de Notion con respuestas simuladas: rango, solo hora, sin hora, sin internet y clave mala.
    - Prueba aislada de la cola sin internet: la tarea sigue hecha en el widget y se envía a Notion al volver la conexión.
  - **Con tu Notion real:**
    - Las 10 tareas de esta semana coinciden con la base (consultada aparte), y el widget muestra las 3 de hoy.
    - Marcar "Portafolio: entrada de Aztlan App" la cambió a Hecha en Notion; desmarcarla la regresó a Pendiente, donde quedó.
- **Qué falló:**
  - El primer intento de la prueba sin internet se colgó por un error de sintaxis en el script de prueba (no en la app); se corrigió y pasó.
  - No se cortó el internet real del equipo; la parte sin conexión se probó con Notion simulado.
- **Qué falta:** nada de esta tarea. "En curso" se escribe desde los avisos (task-10/11); el código ya lo soporta. Sigue `task-09`.

### task-07 — Configuración: pantalla, posición y apariencia
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Decisión de Rost:** la configuración se abre desde un ícono en la bandeja de Windows. Figma no tenía el "ícono discreto". `DESIGN-SYSTEM.md` pasa a v0.10 (sección 13).
- **Qué se hizo:**
  - **Panel / Configuración** (organismo `PanelConfiguracion`) igual al frame 13:543:
    - **General:** Pantalla (tarjetas e "Identificar pantallas"), Posición (vista previa con la cuadrícula 3 × 3 sobre la miniatura del fondo de Windows), Apariencia y Módulos ("Mostrar la hora").
    - **Cuentas:** Sección / Cuentas. Es solo diseño: "Conectar" de Notion pasa la fila a "pegar clave" con el cursor en el campo, y la clave no se guarda en ningún lado.
  - **Cambios al instante:**
    - El widget se mueve a la posición y pantalla elegidas.
    - La configuración se abre del lado con más espacio, a 12 px del widget, centrada en vertical en el área útil.
    - Se mueve y cambia de alto con una animación de 250 ms, que se apaga si Windows pide reducir animaciones.
    - Abrir la configuración cierra la lista abierta y viceversa.
  - **Guardado:**
    - `%APPDATA%\calendarizacion\configuracion.json` guarda modo, hora visible, pantalla y posición de cada pantalla.
    - Se escribe en un archivo aparte y se renombra, para no dejar un archivo a medias.
  - **Bandeja:** ícono de calendario en lavanda; el clic abre y cierra la configuración, y el clic derecho muestra Configuración y Salir.
  - **Una sola copia:** la app ya no puede abrirse dos veces.
  - **Otros cambios:** el widget se recoloca si se conecta o desconecta una pantalla. La barra de pruebas suma un botón Configuración.
- **Verificación:**
  - **9 posiciones:** coinciden con la cuadrícula de la sección 16, y la configuración nunca tapa el widget. Las ventanas quedan a la izquierda en las columnas centro y derecha, y a la derecha en la izquierda.
  - **Pantallas:** con la pantalla 2 en posición 1 y la pantalla 1 en posición 6, cada una recuerda la suya al ir y volver. Comprobado leyendo la posición real de las ventanas: x 1984, y 64 en la pantalla 2.
  - **Reinicio:** al reiniciar la app, el widget vuelve a la pantalla 2, posición 1.
  - **Otros:** pestaña Cuentas (alto 370, centrada), estado pegar clave, modo claro, "Identificar pantallas" con el número en los dos monitores, y el ícono de la bandeja abre y cierra la configuración.
- **Qué falló:** nada pendiente.
- **Notas:**
  - Tu barra de tareas se oculta sola, así que el área útil mide 1080 px de alto y la fila de abajo queda en y = 540 (64 px sobre el borde), no en 492.
  - La vista previa de Posición muestra el fondo estático de Windows, no el animado de Wallpaper Engine.
- **Qué falta:** nada de esta tarea. Sigue `task-08`.

### task-06 — Widget en reposo con datos de ejemplo
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Decisiones de Rost:**
  - koffi para pegar al escritorio sin PowerShell.
  - Hoy: hasta 6 tareas muestra "+N más"; desde 7, barra de progreso y "Ver N más". Los dos abren la lista.
  - Esta semana: próximos 7 días desde hoy, máximo 2 eventos y "+N más".
  - `DESIGN-SYSTEM.md` pasa a v0.9 (secciones 7 y 12).
- **Qué se hizo:**
  - **Ventanas:** el widget son 4 ventanas de cristal (Hora 288×160, Mini calendario 288×304, Hoy 340×272, Esta semana 340×192) colocadas en la posición 6 (x 1216, y 302), más la ventana de la lista abierta (340×680).
  - **Organismos nuevos:** ModuloHora, ModuloCalendario, ModuloHoy, ModuloSemana y PanelHoy. Usan los átomos y moléculas de task-05.
  - **Hora y fechas:** la hora es la real y se actualiza cada minuto, sin segundos. Las fechas van en español.
  - **Calendario:** muestra el mes real con 6 semanas; las flechas cambian de mes.
  - **Estados:** normal, vacío ("Al día", taza, "Día despejado"), muchas tareas (barra y "Ver 8 más"), tarea en curso (con rango de horas), lista abierta y hora oculta.
  - **Lista abierta:** agrupa por franja (Mañana, Tarde, Noche) con su ícono. Se abre a 12 px del lado con más espacio, y la flecha de "Ver N más" apunta hacia ella.
  - **Hora oculta:** el calendario ocupa los 476 px, con días más altos y el bloque "Próximo", sin huecos.
  - **Pegado al escritorio:** `electron/escritorio.js` lo hace con koffi y lo repite cuando el Explorador se reinicia (mensaje `TaskbarCreated`).
  - **Página de pruebas:** el fondo de Figma queda pegado debajo del widget; la barra cambia fondo, modo, escenario y hora; el catálogo se abre con un botón.
  - **Íconos:** 7 nuevos de Figma (flechas, taza, cerrar, mañana, tarde, noche).
- **Verificación:**
  - **Comparación con Figma:** capturas de cada estado comparadas con los frames 6:2, 10:243, 11:336, 15:1224, 14:576 y 20:3293; coinciden.
  - **Contraste:** medido en las zonas vacías del cristal, peor punto. Oscuro en los fondos 1 y 5: atenuado 5.8 y 5.0. Claro en los fondos 2, 3 y 4: atenuado 4.7, 4.5 y 5.6. Todo pasa 4.5:1 con el uso de la sección 14. Fuera de ese uso (oscuro en 2 y 4, claro en 1 y 5), el atenuado queda entre 4.0 y 4.4, igual que en task-04.
  - **Pegado:** queda debajo de otra ventana, un clic no lo sube ni le da el foco, y sobrevive a Win+D.
  - **Reinicio del Explorador** (con permiso de Rost): el widget sobrevive y se vuelve a pegar al escritorio nuevo, lo que se comprobó en el registro de la app.
- **Qué falló:** con Wallpaper Engine, después de reiniciar el Explorador, Win+D deja la imagen del fondo animado encima del widget (ver pendientes). Además, al detener `npm run dev` quedaban procesos viejos de Electron abiertos; se cerraron y se anotó en `CLAUDE.md`.
- **Qué falta:** nada de esta tarea. Sigue `task-07`.

### task-05 — Componentes base (Atomic Design)
- **Fecha:** 2026-10-31
- **Estado:** Completada
- **Qué se hizo:** Se leyeron los 25 componentes de la página "Design System" de Figma y se construyeron en React con los tokens.
  - **Átomos (10):** Interruptor, Dia, CeldaPosicion, Boton (primario, alerta, secundario), BotonIcono (mas, cerrar), CampoTexto (vacío, lleno, enfocado), Pestana, Chip (conectada, sin-conectar), IconoCalendario e IconoDocumento.
  - **Moléculas (7):** Tarea (pendiente, en curso, hecha), Evento, Segmento, TarjetaPantalla, CampoConEtiqueta, FilaCuenta (sin conectar, pegar clave, conectada) y Pestanas.
  - **Organismos (4):** AvisoInicio y AvisoFin, NuevaTarea (vacío, completo) y SeccionCuentas.
  - **Carpetas:** `src/componentes/atomos|moleculas|organismos`. Cada molécula usa átomos y cada organismo usa moléculas y átomos.
  - **Íconos:** los 14 SVG se descargaron de Figma sin cambios a `src/iconos/`. Se pintan como máscara, así que toman el color del token y cambian con el modo.
  - **Página de pruebas:** ahora es un catálogo con todo en todos sus estados. Reemplaza las muestras de colores y de texto de task-04, que se borraron.
- **Verificación:** captura en modo oscuro (fondo 1) y claro (fondo 3), comparada con las capturas de Figma: coinciden tamaños, colores, rellenos e íconos.
  - **Teclado:** Tab recorre campos, botones, pestañas, celdas, segmentos y tarjetas, con foco visible (borde de 2 px en acento).
  - **Accesibilidad:** el interruptor es un `switch`; las pestañas cambian con las flechas; los botones de ícono llevan nombre accesible.
- **Qué falló:** al principio, el reinicio de estilos de los botones borraba su fondo y su relleno. Se corrigió con `:where()` y se volvió a verificar.
- **Diferencias con Figma, anotadas en pendientes:**
  - El texto de ejemplo "¿Qué vas a hacer?" va atenuado en código.
  - Aviso / Fin y Formulario usan esquinas de 24 px, hasta que tengan ventana propia.
  - El botón del aviso tiene un relleno de 8 × 18 px porque en Figma no es una instancia de Boton; en código sí usa Boton.
- **Qué falta:** nada de esta tarea. Sigue `task-06`.

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
