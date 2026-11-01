# Design System — Widget Calendarizacion

**Versión:** 0.12 (Google Calendar conectado, task-09)
**Estado:** los valores son un punto de partida. Se validan y ajustan en `task-01.md` con ejemplos reales. Lo que no esté aquí no está decidido.

## 1. Principios

1. **Calma primero.** Si algo compite por la atención sin necesitarlo, se quita.
2. **De un vistazo.** Lo importante de hoy se entiende en menos de 3 segundos.
3. **Ni saturado ni vacío.** Cada módulo tiene aire, pero ninguno sobra.
4. **Un solo acento.** La base es apagada; un color suave guía la vista. El aviso es el único momento en que algo pide atención.
5. **Legible sobre cualquier fondo.** El cristal nunca sacrifica la lectura.
6. **Nada genérico.** Los chips llevan un ícono con significado, nunca un punto decorativo.

## 2. Ambiente

Un cuarto ordenado y limpio, con clima fresco pero no helado. Luz suave, nada brillante. Referencias: widgets de cristal con módulos flotantes, hora grande como ancla, paletas apagadas con un solo acento.

## 3. Color

### Base (tonos fríos y suaves)

| Token | Valor | Uso |
|---|---|---|
| `ink-on-accent` | `#1E2433` (oscuro) / `#FFFFFF` (claro) | Texto e íconos sobre acento, alerta o done. Antes se llamaba `bg-night`. |
| `ink-primary` | `#EEF2F8` | Texto principal sobre cristal oscuro |
| `ink-secondary` | `#D9DFE9` | Texto secundario, fechas, etiquetas |
| `ink-muted` | `#C3CAD7` | Texto de apoyo, elementos inactivos |
| `line-soft` | `#FFFFFF` al 14% | Bordes finos y divisores |
| `glass-veil` | `#1E2433` al 60% | Fondo base del cristal (velo oscuro) |
| `glass-tint` | `#FFFFFF` al 8% | Capa clara sobre el velo |

### Acento (uno solo en reposo)

| Token | Valor | Uso |
|---|---|---|
| `accent` | `#A9B8F2` (lavanda azulada) | Día actual, tarea destacada, indicadores |
| `accent-soft` | `#A9B8F2` al 22% | Fondos de chips y resaltados |

### Estados

| Token | Valor | Uso |
|---|---|---|
| `alert` | `#F2B8A6` (durazno suave) | Solo para el estado de aviso: borde y botón de aceptar |
| `alert-soft` | `#F2B8A6` al 20% | Fondo de la ventana de aviso |
| `done` | `#A8D5C2` (verde menta apagado) | Tarea completada |
| `done-soft` | `#A8D5C2` al 20% | Fondo del chip "Al día" |

**Regla:** en reposo solo se ve el acento lavanda. El durazno aparece únicamente cuando hay un aviso, para que se note sin gritar.

## 4. Cristal (efecto esmerilado)

| Propiedad | Valor |
|---|---|
| Relleno | `glass-veil` (#1E2433 al 60%) con `glass-tint` (blanco al 8%) encima |
| Desenfoque del fondo | 24 px |
| Borde | 1 px, blanco al 14% |
| Brillo superior | degradado sutil de blanco 6% a 0% |
| Sombra | `0 8 24` negro al 18% |

**Por qué el velo oscuro:** probado con el fondo de Rost (nubes grises claras), con solo blanco al 10% el texto no se leía. El velo es parte base del cristal. Contraste mínimo del texto: 4.5:1. Las pruebas con fondos claros están en las secciones 14 y 15.

## 5. Tipografía

Fuente aprobada por Rost: **Nunito** para el texto y **Quicksand Light** para la hora. Criterio: redondeada, amable y muy legible a tamaño pequeño.

| Rol | Tamaño | Peso | Uso |
|---|---|---|---|
| Hora | 64 px | Fino (Quicksand Light) | La hora grande, ancla visual |
| Título de módulo | 12 px | SemiBold, mayúsculas con espacio | "HOY", "ESTA SEMANA" |
| Tarea | 15 px | Regular | Texto de cada pendiente |
| Detalle | 12 px | Regular | Hora de la tarea, origen, fecha |
| Fecha | 14 px | Medio | Fecha bajo la hora, número del día en eventos |
| Botón | 13 px | SemiBold | "Iniciar", "Terminar", "Crear tarea" |
| Aviso: título | 17 px | Medio | Nombre de la tarea en el aviso |

## 6. Forma y espacio

| Token | Valor |
|---|---|
| `radius-module` | 24 px (tarjetas) |
| `radius-item` | 14 px (filas, chips) |
| `radius-pill` | 999 px (botones, chips) |
| `space-1` | 4 px |
| `space-2` | 8 px |
| `space-3` | 12 px |
| `space-4` | 16 px |
| `space-5` | 24 px |
| Separación entre módulos | 12 px |
| Relleno interno de módulo | 16 a 20 px |

## 7. Componentes del estado de reposo

| Componente | Contenido | Notas |
|---|---|---|
| **Módulo Hora** | Hora grande, día y fecha | Es el ancla visual. Sin segundos. Se puede ocultar desde la configuración del widget. |
| **Módulo Hoy** | Lista de tareas de hoy (Notion) | Hasta 4 visibles; si hay más, "+N más" (sección 12). Muestra la hora de cada una. |
| **Módulo Esta semana** | Eventos de los próximos 7 días, empezando hoy (calendario) | Máximo 2 visibles (es lo que cabe sin que el módulo crezca) y "+N más" si hay más. El encabezado muestra el rango, por ejemplo "31 oct – 6 nov". Decidido por Rost en task-06. |
| **Mini calendario** | Mes actual | Día de hoy con el acento; días con eventos marcados con un punto. |

Filas de tarea: círculo vacío, texto, hora a la derecha. Una tarea completada se atenúa y el círculo se llena con `done`.

## 8. Estado de aviso (ventana flotante)

| Propiedad | Valor |
|---|---|
| Tamaño | pequeño, unos 320 × 120 px |
| Posición | esquina superior a 32 px del borde, sobre el resto de ventanas. Lado según la regla de avisos de la sección 16. |
| Contenido | dos variantes, `Aviso / Inicio` y `Aviso / Fin`: ver sección 17 |
| Color | cristal con borde y botón en `alert` |
| Comportamiento | persistente; solo se oculta al aceptarlo |
| Animación | entrada suave de 250 ms; sin parpadeos ni sonidos agresivos |

Si hay varios avisos a la vez, se apilan en la misma esquina con 12 px de separación.

## 9. Movimiento

- Duración corta: 150 a 250 ms. Curva suave de entrada y salida.
- Nada rebota ni parpadea. Es un cuarto tranquilo.
- Respetar la preferencia de Windows de reducir animaciones.

## 10. Decisiones abiertas

- Si el widget de reposo permite al usuario reordenar los módulos.
- Tamaño final del widget según el monitor de Rost.

## 11. Decisiones tomadas

- **Cristal con velo oscuro** (aprobado por Rost, 2026-10-31).
- **Módulo Hora se queda** y se podrá ocultar desde la configuración del widget (2026-10-31).
- **Fuente Nunito** aprobada (2026-10-31).
- **Chips con ícono**, no con punto (2026-10-31).


## 12. Estados del módulo Hoy

| Estado | Qué muestra |
|---|---|
| **Normal** | Hasta 4 tareas, chip con el número de pendientes y enlace "+N más" si hay 5 o 6 tareas. Desde 7 tareas pasa a "Muchas tareas". Los dos enlaces abren la lista (decidido por Rost en task-06). |
| **Vacío** | Chip "Al día" con ícono de check, ícono de taza, "Día despejado" y "No tienes tareas para hoy". El módulo conserva su altura. |
| **Muchas tareas** | Barra de progreso fina bajo el título, textos largos cortados con "…" y enlace "Ver N más" con flecha. |
| **Lista abierta** | Al tocar "Ver N más" se abre un panel de la misma anchura que el módulo (340 px), pegado al widget por el lado con más espacio y centrado en vertical con él (ajustado a 16 px de los bordes, sección 16). Agrupa las tareas por franja (Mañana, Tarde, Noche) con ícono de sol, y repite chip, progreso y botón de cerrar. El enlace del módulo cambia su flecha para apuntar al panel. |

Regla: el módulo del widget nunca crece ni se desplaza. Todo lo que no cabe se ve en el panel.

## 13. Configuración del widget

- Panel de 520 px con cristal. Los cambios se aplican al instante, sin botón de guardar.
- **Se abre desde un ícono en la bandeja de Windows** (junto al reloj): clic para abrir o cerrar; clic derecho muestra "Configuración" y "Salir". El widget no lleva ícono propio (decidido por Rost en task-07).
- Si no hay segunda pantalla, la tarjeta Pantalla 2 dice "No conectada" y no se puede elegir.
- **Pantalla:** dos tarjetas (Pantalla 1 principal y Pantalla 2 secundaria) y un enlace "Identificar pantallas" que muestra el número en cada monitor.
- **Posición:** vista previa del monitor con cuadrícula de 3 × 3. Se toca una celda y el widget se alinea a ese punto. No hay arrastrar y soltar, para evitar desalineaciones.
- **Módulos:** interruptor "Mostrar la hora". Con la hora oculta, el mini calendario ocupa toda la columna y suma un bloque "Próximo" con el siguiente evento, para no dejar huecos.
- Nota: el widget (476 px de alto) es más alto que un tercio de una pantalla de 1080 px. Por eso las posiciones de arriba y abajo se anclan al borde, y la del centro se centra.
- **Apariencia:** selector de dos opciones, Oscuro y Claro, con ícono de luna y de sol.
- Componentes nuevos: Interruptor, Tarjeta pantalla, Celda posición, Segmento.

## 14. Pruebas con fondos (task-01)

Probado sobre 5 fondos. Resultado con el cristal oscuro actual:

| Fondo | Resultado |
|---|---|
| 1. Nebulosa azul y morada | Bien |
| 2. Chica en la nieve, luces brillantes | Aceptable. El texto atenuado (días de la semana, horas) pierde lectura sobre las luces. |
| 3. Cielo pastel con camioneta | Aceptable. Texto atenuado débil. |
| 4. Ilustración sobre fondo blanco | Falla. El texto atenuado, la fila hecha y los días de la semana casi desaparecen. |
| 5. Cuarto lo-fi muy detallado | Bien, algo ocupado detrás de los módulos. |

Decisión de Rost: **dos modos, oscuro y claro** (sección 15). Con el modo claro, los fondos 2, 3 y 4 se leen bien. El modo oscuro queda para los fondos 1 y 5 y el fondo del bosque.


## 15. Modo claro y oscuro

Las variables de color tienen dos modos: **Oscuro** y **Claro**. Se elige en la configuración (Apariencia). Los componentes no cambian: solo cambian los valores.

| Token | Oscuro | Claro |
|---|---|---|
| `ink-primary` | `#EEF2F8` | `#1E2433` |
| `ink-secondary` | `#D9DFE9` | `#3D485C` |
| `ink-muted` | `#C3CAD7` | `#4D586C` |
| `line-soft` | blanco al 14% | `#1E2433` al 14% |
| `glass-veil` | `#1E2433` al 60% | `#FFFFFF` al 60% |
| `glass-tint` | blanco al 8% | `#1E2433` al 4% |
| `accent` | `#A9B8F2` | `#4656B8` |
| `accent-soft` | acento al 22% | acento al 14% |
| `alert` | `#F2B8A6` | `#B4472D` |
| `alert-soft` | alerta al 20% | alerta al 12% |
| `done` | `#A8D5C2` | `#2F7D5C` |
| `done-soft` | done al 20% | done al 14% |
| `ink-on-accent` | `#1E2433` | `#FFFFFF` |

En modo claro el acento es más oscuro para que el texto sobre él y el texto de acento cumplan contraste.

**Contraste medido sobre el cristal real de Windows (task-04):** el cristal acrílico de Windows suma una capa clara propia, así que el modo oscuro necesita un velo más denso (60 %) y grises más claros que en Figma para llegar a 4.5:1. Con estos valores, en los fondos oscuros (1 y 5) el texto secundario queda en 5.7–6.2 y el atenuado en 4.6–5.1; en modo claro el atenuado queda en 4.5–5.4 sobre los 5 fondos. En los fondos claros (2, 3 y 4) el modo oscuro no llega a 4.5 en el atenuado: ahí corresponde el modo claro (sección 14). Contra: en modo oscuro los tres grises de texto quedan cercanos entre sí.

## 16. Posiciones preestablecidas (cuadrícula 3 × 3)

El widget (640 × 476 px) mide siempre lo mismo y se coloca en una de 9 posiciones fijas, sobre una pantalla de 1920 × 1080 con barra de tareas de 48 px. No se arrastra.

Margen al borde: 64 px. La fila de abajo respeta la barra de tareas.

| | Izquierda (x = 64) | Centro (x = 640) | Derecha (x = 1216) |
|---|---|---|---|
| **Arriba** (y = 64) | 1 | 2 | 3 |
| **Centro** (y = 302) | 4 | 5 | 6 |
| **Abajo** (y = 492) | 7 | 8 | 9 |

Reglas:
- **Orden interno fijo:** en las 9 posiciones el widget se arma igual (columna del calendario a la izquierda, columna de Hoy y Esta semana a la derecha). Lo único que cambia es dónde se coloca.
- **Ventanas laterales** (lista abierta, configuración y Nueva tarea): se abren hacia el lado con más espacio, a 12 px del widget. Reglas completas y medidas más abajo.
- **Avisos:** esquina superior derecha, salvo en la columna derecha (posiciones 3, 6 y 9), donde pasan a la esquina superior izquierda. Así no tapan el widget aunque se apilen varios (tres avisos llegan hasta y = 416 y el widget de la posición 6 empieza en y = 302).
- **Pantalla:** la posición se guarda por pantalla (1 o 2).

### Ventanas laterales: configuración, lista abierta y Nueva tarea

Medidas: configuración 520 × 816 (pestaña General), lista abierta 340 × 680, Formulario / Nueva tarea 400 × 338.

Reglas:
- **Lado:** se abren hacia el lado con más espacio, a 12 px del widget. Con el widget en la columna izquierda se abren a la derecha; en el centro (empate) y en la derecha, a la izquierda.
- **Una a la vez:** configuración, lista abierta y Nueva tarea comparten el mismo lado, así que abrir una cierra la que estuviera abierta. Nunca se encima una con otra ni con el widget.
- **Vertical:**
  - Configuración: centrada en el área útil de la pantalla (y = 108), sin importar dónde esté el widget.
  - Lista abierta: centrada con el widget, pero a 16 px como mínimo del borde y de la barra de tareas: y = el centro del widget menos 340, limitado entre 16 y 336. Resultado: fila de arriba y = 16, centro y = 200, abajo y = 336.
  - Nueva tarea: alineada con el borde superior del widget (y = 64, 302 o 492).
- Al cambiar de posición desde la configuración, el panel se mueve con una animación de 250 ms al lado que le corresponda, para no quedar encima del widget.

| Columna del widget | Lado | x configuración | x lista abierta | x Nueva tarea |
|---|---|---|---|---|
| Izquierda (posiciones 1, 4, 7) | derecha | 716 | 716 | 716 |
| Centro (2, 5, 8) | izquierda | 108 | 288 | 228 |
| Derecha (3, 6, 9) | izquierda | 684 | 864 | 804 |

Las ventanas laterales y los avisos nunca coinciden: los avisos van en las esquinas superiores (derecha, o izquierda en las posiciones 3, 6 y 9) y las ventanas laterales quedan siempre del lado del widget donde hay espacio, con y entre 16 y 1016.

Vistas de comprobación en Figma: Posición 5 con configuración, lista abierta y Nueva tarea; Posición 1 y 7 con lista abierta ajustada.


## 17. Flujo de una tarea: dos avisos (v0.5)

Decisión de Rost: **aceptar un aviso = empezar la tarea.** Las tareas con hora de inicio y de cierre generan dos avisos; el segundo es el que la marca como hecha.

| Momento | Componente | Chip (con ícono) | Botón | Qué pasa al aceptar |
|---|---|---|---|---|
| Hora de inicio | `Aviso / Inicio` | play + "Hora de iniciar" | Iniciar | La tarea pasa a **en curso** y el aviso se oculta |
| Hora de cierre | `Aviso / Fin` | bandera + "Hora de terminar" | Terminar | La tarea pasa a **hecha** y el aviso se oculta |

- Ambos avisos son persistentes: solo se ocultan al aceptarlos. Mismo tamaño y posición (arriba a la derecha; en las posiciones 3, 6 y 9, arriba a la izquierda). Si coinciden, se apilan con 12 px de separación.
- `Aviso / Inicio` muestra en el origen el rango: "Notion · 19:30 – 20:30". `Aviso / Fin` muestra "Se marcará como hecha".
- Los íconos reemplazan al punto genérico y a la campana: play = iniciar, bandera = terminar (color `alert`).

### Estado de fila "en curso"
- Variante `estado=en-curso` del componente Tarea: fondo `accent/soft`, círculo relleno `accent` con ícono play en `ink/on-accent`, y la hora en `accent`.
- La hora muestra el **rango** ("10:00 – 11:30") cuando la tarea tiene inicio y cierre.
- Vistas: `Escritorio / Aviso` (dos avisos apilados) y `Escritorio / Tarea en curso`.

### Tareas con una sola hora (decidido)
- Solo tienen aviso de inicio. Se marcan como hechas desde la lista.

Tablero de referencia en Figma: "Flujo de una tarea" (4 pasos).


## 18. Organización: Atomic Design (v0.6)

Todos los componentes viven en la página **Design System** de Figma, ordenados en tres secciones. El código debe respetar la misma estructura (carpetas `atomos`, `moleculas`, `organismos`).

| Nivel | Componentes |
|---|---|
| **Átomos** | Interruptor, Dia, Celda posicion, Boton (primario, alerta, secundario), Boton icono (mas, cerrar), Campo de texto (vacio, lleno, enfocado), Pestaña (activa, inactiva), Chip (conectada, sin-conectar), Icono / Calendario, Icono / Documento |
| **Moléculas** | Tarea (pendiente, en-curso, hecha), Evento, Segmento, Tarjeta pantalla, Campo con etiqueta, Fila de cuenta (sin-conectar, pegar-clave, conectada), Pestañas (general, cuentas) |
| **Organismos** | Aviso / Inicio, Aviso / Fin, Formulario / Nueva tarea (vacio, completo), Seccion / Cuentas |

Reglas:
- Un átomo no contiene otros componentes. Una molécula combina átomos. Un organismo combina moléculas y átomos.
- Las pantallas (páginas "Propuesta") solo usan instancias, nunca copias sueltas.
- Los módulos del widget (Hora, Mini calendario, Hoy, Esta semana) y el panel de configuración siguen como marcos dentro de las pantallas; pasarán a organismos cuando se construyan en código.
- Todo componente nuevo se crea primero aquí y se nombra en español, igual que en el código.

## 19. Cuentas conectadas (v0.6)

- La configuración se divide en dos pestañas: **General** (pantalla, posición, apariencia, módulos) y **Cuentas**. Así el panel no crece más de 816 px de alto.
- La pestaña Cuentas lista **Google Calendar** (eventos) y **Notion** (tareas) con una **Fila de cuenta** cada una.
- Estados de la fila: **sin conectar** (chip con ícono de enlace roto y botón primario "Conectar") y **conectada** (chip verde con palomita, texto de apoyo con lo que se leerá y botón secundario "Desconectar").
- **Google Calendar** se conecta con el botón "Conectar" (autorización en el navegador).
- **Notion** se conecta con una **integración interna**: al pulsar "Conectar" la fila pasa al estado **pegar-clave** (nota breve, campo "Pega aquí la clave" y botón "Conectar"). Decidido por Rost: no se usa el botón de autorizar, para no guardar una clave secreta dentro de la app. La clave se guarda en el Administrador de credenciales de Windows.
- Vistas: Configuración · Cuentas (pegar clave de Notion).
- Nota fija bajo la lista: "Tus claves se guardan de forma segura en este equipo."
- **Notion conectada (task-08):** el texto de apoyo de la fila dice "Base: Tareas de carrera". Si la clave falla, el mensaje de error reemplaza la nota de pegar-clave, en color `alert` (clave no válida, base no compartida, sin conexión o Notion sin respuesta). Mientras valida, el botón dice "Conectando…".
- **Errores en el widget:** nunca una pantalla de error. Junto al título "Hoy" aparece un aviso corto en `ink-muted`: "· sin conexión", "· Notion no responde", "· revisa la clave de Notion" o "· conecta Notion". El widget sigue mostrando lo último que leyó.
- **Google Calendar conectado (task-09):** solo lectura del calendario principal de Rost (sin los de feriados). La primera vez, "Conectar" pide el archivo del cliente de Google (tipo "App de escritorio") y abre el permiso en el navegador; después ya no pide el archivo. Mientras espera, el botón dice "Conectando…". Si falla, el mensaje aparece bajo la fila en color `alert`. Conectada, el texto de apoyo dice "Calendario: ros.tunales@gmail.com".
- **Errores en "Esta semana":** igual que en Hoy, un aviso corto junto al título: "· sin conexión", "· Google no responde", "· vuelve a conectar Google" o "· conecta Google". Se siguen mostrando los últimos eventos leídos. Los eventos de todo el día dicen "Todo el día" en lugar de hora.
- **Marcar desde la lista:** tocar el círculo de una tarea la marca como hecha, o la regresa a pendiente si ya lo estaba. "En curso" llega con el aviso de inicio (sección 17).
- Íconos genéricos (calendario y documento); no se usan logotipos de terceros.
- Vistas: Configuración · Cuentas, Cuentas (conectadas) y Cuentas (claro).

## 20. Crear una tarea desde el widget (v0.6)

- Entrada: botón **+** (Boton icono "mas") en el encabezado del módulo Hoy, junto al chip de pendientes.
- Al pulsarlo se abre el **Formulario / Nueva tarea** (400 px, cristal) hacia el lado con más espacio: a la derecha en la columna izquierda, a la izquierda en el centro y la derecha. Alineado con el borde superior del módulo Hoy, a 12 px del widget. No tapa el widget.
- Campos: **Nombre**, **Día** (por defecto "Hoy"), **Inicio** y **Cierre**. Inicio y Cierre son opcionales.
- Regla de avisos: con inicio y cierre hay dos avisos; con solo inicio, un aviso y se marca hecha desde la lista; sin hora, no hay avisos y la tarea solo aparece en la lista.
- Nota fija: "Se guarda en Notion. Sin hora de cierre, solo habrá aviso de inicio y la marcas como hecha desde la lista."
- Botones: **Cancelar** (secundario) y **Crear tarea** (primario). El campo Nombre abre enfocado.
- Estados: vacío (Nombre enfocado) y completo.
- Vistas: Escritorio / Nueva tarea (vacía) y (completa).
