# task-08 — Conectar con Notion (tareas)

## Objetivo
Leer las tareas de Rost desde Notion y mostrarlas en el módulo Hoy.

## Contexto
- Antes de empezar, pregunta a Rost: qué base de datos de Notion usa para sus tareas y cómo se llaman sus propiedades (título, fecha de inicio, fecha de cierre, estado).
- Una tarea puede tener una sola hora o inicio y cierre. Con una sola hora solo hay aviso de inicio y se marca como hecha desde la lista.
- Marcar una tarea como en curso o hecha debe escribirse de vuelta en Notion.
- Nunca guardes tokens en archivos del proyecto (regla de `CLAUDE.md`).

## Qué hacer
- [ ] Conexión con **integración interna** de Notion (decidido por Rost; no uses OAuth). Al pulsar **Conectar** en la pestaña Cuentas, la fila pasa al estado **pegar-clave**: Rost pega la clave de su integración, se valida y se guarda en el Administrador de credenciales de Windows, nunca en archivos del proyecto. Guía a Rost paso a paso para crear la integración y compartirle su base de tareas. Mostrar la fila como **conectada** (con el nombre de la base) y permitir **Desconectar**.
- [ ] Leer las tareas de hoy y de los próximos días.
- [ ] Actualizar el módulo Hoy y la barra de progreso con datos reales.
- [ ] Marcar tareas como en curso o hechas desde la lista y reflejarlo en Notion.
- [ ] Manejar errores sin romper el widget (sin internet, token inválido): mostrar un estado discreto, no una pantalla de error.
- [ ] Si un cambio de estado (en curso o hecha) no se puede enviar a Notion, guardarlo en el equipo y reenviarlo al volver la conexión. Mientras tanto, el widget muestra el estado nuevo, no el que vuelve a leer de Notion.

## Criterios de aceptación
- [ ] Las tareas del widget coinciden con las de Notion.
- [ ] Marcar una tarea como hecha cambia también Notion.
- [ ] Sin internet, el widget sigue mostrando lo último que leyó.
- [ ] Una tarea marcada como hecha sin internet sigue hecha en el widget y llega a Notion cuando vuelve la conexión.

## Referencias
- Figma: pantalla Configuración · Cuentas (pegar clave de Notion) 31:4216; componente Fila de cuenta, variante pegar-clave.
- `DESIGN-SYSTEM.md`, secciones 12, 17 y 19.

## Fuera de alcance
- Crear tareas desde el widget (va en `task-12.md`).
