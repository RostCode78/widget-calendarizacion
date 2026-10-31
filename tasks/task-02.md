# task-02 — Diseñar la configuración del widget

## Objetivo
Diseñar la pantalla o panel de configuración del widget. El primer ajuste decidido es poder ocultar el módulo Hora.

## Contexto
- El fondo de pantalla de Rost ya trae su propio reloj. Por eso el módulo Hora del widget debe poder ocultarse.
- Decisión de Rost (2026-10-31): el módulo Hora se queda por defecto y se oculta desde la configuración.
- Al ocultarlo, el widget debe reacomodarse sin dejar un hueco vacío.
- La configuración debe tener la misma estética que el widget (cristal, colores suaves, Nunito).

## Qué hacer
- [ ] Decidir cómo se abre la configuración (por ejemplo, un ícono de engrane discreto en el widget).
- [ ] Diseñar el panel con el interruptor "Mostrar la hora".
- [ ] Diseñar cómo se ve el widget con la hora oculta (columna A solo con el mini calendario).
- [ ] Proponer a Rost otros ajustes útiles, sin agregarlos hasta que los apruebe.
- [ ] Actualizar `DESIGN-SYSTEM.md` con los componentes nuevos (interruptor, panel).

## Criterios de aceptación
- [ ] El interruptor se entiende sin explicación.
- [ ] El widget con la hora oculta se ve equilibrado, sin huecos.
- [ ] Usa solo los tokens del design system.
- [ ] Rost aprueba el resultado.

## Referencias
- Figma: archivo "Calendarizacion", página "Propuesta".
- `DESIGN-SYSTEM.md`, sección 7 (componentes del estado de reposo).

## Fuera de alcance
- Cualquier código.
- Ajustes que Rost no haya aprobado.


## Estado
- Completada y aprobada por Rost (2026-10-31).
