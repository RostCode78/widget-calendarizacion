# task-07 — Configuración: pantalla, posición y apariencia

## Objetivo
Hacer el panel de configuración y que el widget se coloque en una de las 9 posiciones fijas, en la pantalla 1 o 2.

## Contexto
- Rost no quiere arrastrar ni soltar: solo posiciones preestablecidas para evitar desalineaciones.
- Posiciones sobre pantalla de 1920 × 1080 con barra de tareas de 48 px: widget 640 × 476, margen 64, x = 64 / 640 / 1216 y y = 64 / 302 / 492. Adáptalas a otras resoluciones sin perder la regla del margen.
- La posición se guarda **por pantalla**.
- Los avisos van arriba a la derecha, a 32 px del borde; en las posiciones 3, 6 y 9 (columna derecha) pasan arriba a la izquierda.

## Qué hacer
- [ ] Abrir la configuración desde un ícono discreto en el widget.
- [ ] Dos pestañas: **General** y **Cuentas**.
- [ ] Pestaña General: Pantalla (tarjetas), Posición (cuadrícula 3 × 3), Apariencia (oscuro/claro), Módulos (mostrar la hora).
- [ ] Pestaña Cuentas: Sección / Cuentas con las dos filas (solo el diseño; las conexiones reales llegan en `task-08.md` y `task-09.md`).
- [ ] Mover el widget a la posición elegida y a la pantalla elegida.
- [ ] Guardar la configuración para recordarla al reiniciar.

- [ ] Colocar la configuración según la regla de ventanas laterales (sección 16): lado con más espacio, a 12 px del widget, centrada en vertical en la pantalla, y moverla con animación al cambiar de posición.

## Criterios de aceptación
- [ ] Las 9 posiciones coinciden con sus vistas en Figma.
- [ ] Cambiar de pantalla recuerda la posición de cada una.
- [ ] La configuración sobrevive a reiniciar.
- [ ] La configuración nunca tapa el widget en ninguna de las 9 posiciones.

## Referencias
- Figma: archivo "Calendarizacion" (clave 5ZrhcMIJU0XcWDoA5UvO0h), página "Propuesta". Panel (13:543); frames Configuración (13:444 y 16:1719); Posición 1–9 (17:1854 a 17:2659); lista abierta a la derecha (17:2758).
- Frames: Configuración · Cuentas (27:3365), conectadas (27:3669), claro (27:4003).
- `DESIGN-SYSTEM.md`, secciones 13, 15, 16 y 19.

## Fuera de alcance
- Arrastrar para mover.
