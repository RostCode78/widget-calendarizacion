# Calendarizacion: guía de uso

Un widget para el escritorio de Windows 11 con tus tareas de hoy (Notion), tus eventos de la semana (Google Calendar), la hora y un mini calendario.

## Instalar

1. Abre `Calendarizacion Setup 1.0.0.exe` (está en la carpeta `instalador` del proyecto; se crea con `npm run instalador`).
2. Si Windows muestra **"Windows protegió su PC"**, pulsa **Más información → Ejecutar de todas formas**. Sale porque la app no tiene firma digital de pago; es tuya.
3. Se instala solo, sin preguntas, en tu usuario. Queda un acceso **Calendarizacion** en el menú Inicio.
4. La primera vez que lo abres, el widget queda listo para **arrancar solo con Windows**.

## Uso diario

- El widget vive pegado al escritorio, debajo de tus ventanas. Para verlo, minimiza todo con **Win + D**.
- **Hoy:** tus tareas de Notion de hoy. Toca el círculo de una tarea para marcarla como hecha (o regresarla a pendiente). "Ver N más" abre la lista completa.
- **Esta semana:** tus eventos de los próximos 7 días. El mini calendario marca con un punto los días con eventos.
- Si algo falla (sin internet, cuenta desconectada), aparece un aviso corto junto al título del módulo. El widget sigue mostrando lo último que leyó.

## Avisos

- Cuando una tarea con hora llega a su **hora de inicio**, aparece un aviso flotante. Se queda hasta que lo aceptes.
- **Iniciar** pone la tarea **en curso** en Notion. Si la tarea tiene hora de cierre, a esa hora aparece **Terminar**, que la marca como **hecha**.
- Las tareas con una sola hora solo tienen aviso de inicio; márcalas como hechas desde la lista.
- Los avisos no te quitan el foco al aparecer. Con el teclado: **Ctrl + Alt + Enter** acepta el aviso de arriba, estés en la app que estés.
- Si la computadora estaba apagada o dormida, al volver solo aparecen los avisos pendientes de hoy.

## Configuración

Haz clic en el ícono del calendario en la **bandeja de Windows** (junto al reloj; quizá esté dentro de la flecha **^**).

- **General:** pantalla (1 o 2), posición del widget (9 lugares), modo oscuro o claro, y mostrar u ocultar la hora.
- **Cuentas:** conectar o desconectar Notion y Google Calendar. Tus claves se guardan en el Administrador de credenciales de Windows, nunca en archivos.
- Clic derecho en el ícono: **Iniciar con Windows** (casilla para encender o apagar el arranque) y **Salir**.

Consejo: con fondos claros o muy brillantes usa el **modo claro**; con fondos oscuros, el **modo oscuro**.

## Conectar las cuentas (una sola vez)

**Notion**
1. En notion.so/my-integrations crea una integración **interna** y copia su clave.
2. En tu base **Tareas de carrera**: **••• › Conexiones** y agrega la integración.
3. En el widget: Configuración › Cuentas › Notion › **Conectar**, pega la clave y pulsa Conectar.

**Google Calendar**
1. En console.cloud.google.com, en tu proyecto "Widget Calendarizacion": **Clientes → Crear cliente → App de escritorio** y descarga el JSON.
2. En el widget: Configuración › Cuentas › Google Calendar › **Conectar** y elige ese archivo.
3. En el navegador, elige tu cuenta y acepta. Si sale "Google no verificó esta app": **Configuración avanzada → Ir a Widget Calendarizacion**.

El permiso es solo de lectura: el widget no crea, edita ni borra eventos.

## Desinstalar

Configuración de Windows › Aplicaciones › Aplicaciones instaladas › **Calendarizacion** › Desinstalar. Tus ajustes quedan en `%APPDATA%\Calendarizacion`, por si lo vuelves a instalar.

## Si algo no se ve bien

- **No veo el widget:** pulsa Win + D. Si no está, ábrelo desde el menú Inicio.
- **Desconecté el segundo monitor:** el widget pasa solo a la pantalla principal y regresa cuando lo vuelves a conectar.
- **"· vuelve a conectar Google" o "· revisa la clave de Notion":** entra a Configuración › Cuentas y conecta otra vez.
