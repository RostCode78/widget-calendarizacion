# task-05 — Componentes base (Atomic Design)

## Objetivo
Construir los componentes reutilizables del widget tal como están en la página "Design System" de Figma, organizados como átomos, moléculas y organismos.

## Contexto
- Cada componente existe en Figma con sus variantes. No inventes variantes nuevas.
- Estructura de carpetas: `atomos`, `moleculas`, `organismos`. Un átomo no usa otros componentes; una molécula combina átomos; un organismo combina moléculas y átomos.
- Los chips llevan ícono con significado, nunca un punto decorativo (principio 6).
- Todo en modo oscuro y claro.

## Qué hacer
- [ ] **Átomos:** Interruptor, Dia, Celda posicion, Boton (primario, alerta, secundario), Boton icono (mas, cerrar), Campo de texto (vacio, lleno, enfocado), Pestaña (activa, inactiva), Chip (conectada, sin-conectar), Icono / Calendario, Icono / Documento.
- [ ] **Moléculas:** Tarea (pendiente, en curso con play y rango de horas, hecha), Evento, Segmento, Tarjeta pantalla, Campo con etiqueta, Fila de cuenta (sin conectar, pegar clave, conectada), Pestañas (general, cuentas).
- [ ] **Organismos:** Aviso / Inicio, Aviso / Fin, Formulario / Nueva tarea (vacío, completo), Sección / Cuentas.
- [ ] Mostrarlos todos en la página interna de pruebas, con todos sus estados.

## Criterios de aceptación
- [ ] Cada componente se ve igual que en Figma, en modo oscuro y claro.
- [ ] La estructura de carpetas respeta Atomic Design.
- [ ] Los campos, botones y pestañas se pueden usar con teclado y tienen foco visible.

## Referencias
- Figma: archivo "Calendarizacion" (clave 5ZrhcMIJU0XcWDoA5UvO0h), página "Design System" (secciones Átomos, Moléculas y Organismos).
- `DESIGN-SYSTEM.md`, secciones 7, 12, 13, 17, 18, 19 y 20.

## Fuera de alcance
- Datos reales y comportamiento del widget completo.
