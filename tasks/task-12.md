# task-12 — Crear tareas desde el widget

## Objetivo
Poder crear una tarea nueva desde el widget y que se guarde en Notion.

## Contexto
- Entrada: botón **+** en el encabezado del módulo Hoy. Abre el Formulario / Nueva tarea hacia el lado con más espacio (a la derecha si el widget está en la columna izquierda; a la izquierda en las demás), alineado con el módulo Hoy y a 12 px del widget; solo puede haber una ventana lateral abierta a la vez (`DESIGN-SYSTEM.md`, secciones 16 y 20).
- Campos: Nombre (obligatorio, abre enfocado), Día (por defecto Hoy), Inicio y Cierre (opcionales).
- Avisos según las horas: inicio y cierre = dos avisos; solo inicio = un aviso y se marca hecha desde la lista; sin hora = sin avisos.
- Requiere `task-08.md` (Notion conectado). Si Notion no está conectado, el botón + debe llevar a la pestaña Cuentas en vez de abrir el formulario.

## Qué hacer
- [ ] Botón + en el módulo Hoy (Boton icono "mas").
- [ ] Formulario con los estados vacío y completo, y validación: Nombre obligatorio; si hay cierre debe ser posterior al inicio.
- [ ] Selector de Día y de horas fácil de usar con teclado.
- [ ] Crear la página en la base de Notion con las propiedades acordadas en `task-08.md`.
- [ ] Mostrar la tarea nueva en la lista de Hoy sin esperar a la siguiente lectura.
- [ ] Programar sus avisos (`task-10.md`).
- [ ] Manejar errores (sin internet, Notion no responde): conservar lo escrito y avisar con un mensaje discreto.
- [ ] Cerrar con la X, Cancelar o la tecla Escape.

## Criterios de aceptación
- [ ] La tarea creada aparece en Notion y en el widget.
- [ ] Los avisos se comportan según las horas capturadas.
- [ ] Sin internet no se pierde lo que Rost escribió.
- [ ] El formulario coincide con las vistas de Figma.
- [ ] El formulario se ve completo en las 9 posiciones.

## Referencias
- Figma: archivo "Calendarizacion" (clave 5ZrhcMIJU0XcWDoA5UvO0h) Organismo Formulario / Nueva tarea; frames Escritorio / Nueva tarea (vacía) 27:4307 y (completa) 27:4444.
- `DESIGN-SYSTEM.md`, sección 20.

## Fuera de alcance
- Editar o borrar tareas.
- Tareas repetidas o con recordatorios distintos al aviso de inicio y fin.
