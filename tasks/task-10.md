# task-10 — Avisos de inicio y de fin

## Objetivo
Mostrar los avisos flotantes y persistentes, y llevar cada tarea por su ciclo: pendiente, en curso y hecha.

## Contexto
- **Aceptar un aviso de inicio = empezar la tarea.** El aviso de fin es el que la marca como hecha (`DESIGN-SYSTEM.md`, sección 17).
- Tareas con una sola hora: solo aviso de inicio; se marcan como hechas desde la lista.
- Los avisos solo se ocultan al aceptarlos. No roban el foco al escribir.
- Si coinciden, se apilan con 12 px de separación. Arriba a la derecha, a 32 px del borde; en las posiciones 3, 6 y 9 (columna derecha), arriba a la izquierda.
- Aparecen en la pantalla elegida en la configuración.

## Qué hacer
- [ ] Programar los avisos según hora de inicio y de cierre de cada tarea.
- [ ] Mostrar Aviso / Inicio y Aviso / Fin con el estilo del diseño.
- [ ] Al aceptar el inicio: la tarea pasa a en curso (fila resaltada con play y rango de horas) y se escribe en Notion.
- [ ] Al aceptar el fin: la tarea queda hecha y se escribe en Notion.
- [ ] Si la computadora estuvo apagada o dormida a la hora del aviso, mostrar al volver solo los avisos pendientes de **hoy**. Las tareas de días anteriores quedan en la lista, sin aviso.
- [ ] Que el aviso persista aunque se cierre y se abra el widget.

## Criterios de aceptación
- [ ] Un aviso no desaparece hasta que Rost lo acepta.
- [ ] El ciclo completo coincide con el tablero "Flujo de una tarea".
- [ ] Los avisos apilados no tapan el widget en ninguna de las 9 posiciones.
- [ ] Tras varios días apagada, al encender solo aparecen avisos de hoy.
- [ ] Una prueba automática pequeña cubre los 4 casos: inicio y cierre, solo inicio, sin hora y computadora dormida a la hora del aviso.

## Referencias
- Figma: archivo "Calendarizacion" (clave 5ZrhcMIJU0XcWDoA5UvO0h), página "Propuesta". Tablero "Flujo de una tarea" (22:3092); Escritorio / Aviso (6:209); Posición 3 (17:2052); Escritorio / Tarea en curso (20:3293).

## Fuera de alcance
- Aplazar avisos (no está en el diseño; propónlo a Rost si hace falta).
