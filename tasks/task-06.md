# task-06 — Widget en reposo con datos de ejemplo

## Objetivo
Armar el widget completo (Hora, Mini calendario, Hoy y Esta semana) con datos de ejemplo, incluyendo todos sus estados.

## Contexto
- Usa datos falsos fijos; los reales llegan en `task-08.md` y `task-09.md`.
- Estados: normal, vacío (sin tareas hoy), muchas tareas (barra de progreso y texto cortado), lista abierta con "Ver N más" y hora oculta (el calendario ocupa la columna con el bloque "Próximo").
- Orden interno fijo; la lista abierta se despliega hacia el lado con más espacio (sección 16).

## Qué hacer
- [ ] Componer los 4 módulos con la distribución del diseño (640 × 476).
- [ ] Estado vacío y estado de muchas tareas.
- [ ] Lista abierta con "Ver N más" (12 tareas agrupadas por franja).
- [ ] Interruptor lógico de hora oculta que reacomoda sin dejar huecos.
- [ ] El widget queda pegado al escritorio (según `task-03.md`).

## Criterios de aceptación
- [ ] Cada estado coincide con su vista en Figma.
- [ ] Se lee bien sobre los 5 fondos, en oscuro y claro.
- [ ] Ocultar la hora no deja huecos.

## Referencias
- Figma: archivo "Calendarizacion" (clave 5ZrhcMIJU0XcWDoA5UvO0h), página "Propuesta". Frames: Escritorio / Reposo (6:2), Vacío (10:243), Muchas tareas (11:336), lista abierta (15:1224), Hora oculta (14:576), Tarea en curso (20:3293).
- `DESIGN-SYSTEM.md`, secciones 12 y 14.

## Fuera de alcance
- Configuración, avisos y datos reales.
