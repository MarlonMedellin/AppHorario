# Características Destacadas de la Interfaz (AppHorario)

El frontend de "Quédate en Colmayor" fue diseñado con atención al detalle y enfocándose en la Experiencia de Usuario (UX). Además de la estructura básica de mostrar los horarios obtenidos de Google Sheets, la aplicación cuenta con varias lógicas enriquecidas (`Smart UI`) que operan por detrás para dinamizar la navegación.

Aquí se documentan las características interactivas más relevantes implementadas en los componentes principales:

## 1. Auto-Reconocimiento del Día de la Semana
Los componentes encargados de listar los horarios (como `Dashboard.jsx`) detectan automáticamente el día en que el estudiante ingresa a la aplicación web.
*   **Comportamiento**: En lugar de mostrar la agenda completa y obligar al usuario a filtrar, la página lee el reloj del sistema o del navegador (`new Date().getDay()`). Automáticamente marca la pestaña superior (por ejemplo *"Martes"*) y carga los horarios de ese mismo día al instante. 
*   **Días Inhábiles**: Si un usuario entra un domingo, se ha configurado la lógica para saltar automáticamente al "Lunes", asumiendo que el usuario está buscando prepararse para el inicio de semana.

## 2. Indicador "En Vivo" (Sombreado Dinámico y Status Badge)
El componente de la tabla de visualización (`HorarioTable.astro` y su contraparte en React) implementa una función de monitoreo de tiempo llamada `highlightActiveSlots()` que corre apenas montada la tabla y se auto-ejecuta cada 60 segundos.
*   **Resaltado Visual**: Si el "Día" corresponde al día actual, la aplicación evalúa la `hora_inicio` y `hora_fin` de cada registro. Si la clase "debería estar dándose ahora mismo", la fila entera se ilumina o sombrea con tonos verdes (`bg-green-50`); además, la barra lateral cambia de gris a verde brillante.
*   **Badge Pulsante**: Durante ese bloque de tiempo, inyecta un pequeño letrero animado que dice **"En Curso"**, acompañado de un punto de notificación latiendo (`animate-ping`) para guiar velozmente la vista hacia los profesores que están sentados asesorando justo en ese minuto.

## 3. Arquitectura de Íconos y Temáticas por Área
En vez de texto plano, la tabla detecta de qué "Materia" o "Área" se trata el bloque y aplica un mapa semántico de diseño modular.
*   **Colores y SVG**: Existen vectores inyectados específicamente. Por ejemplo, si un estudiante busca "Matemáticas", siempre verá iconos de calculadoras en fondos azulados (`bg-blue-50 text-blue-600`); si es "Química", iconos de matraces en fondos naranjas. Todo regido por la constante `areaColorMap`.

## 4. Generación de Enlaces Inteligentes (Deep Linking)
Al filtrar en el *Dashboard*, la app reescribe el estado para poder compartir ese mismo filtro.
*   **Exportación de Filtros**: Se implementó una lógica donde, si un coordinador agrupa buscar al asesor *"Marlon"*, materia *"Álgebra"* y sede *"Robledo"*, al presionar el botón de compartir, la aplicación encapsula las variables y arroja una URL con el payload exacto (`?asesor=Marlon&sede=Robledo`).
*   **Lectura a la entrada**: Así mismo, la inicialización del `useEffect` de la página lee la barra de navegación. Si un alumno abre el enlace anterior en WhatsApp de un solo toque, no verá la landing genérica, verá exactamente la lista de Marlon preconfigurada en segundos.

## 5. Prevención de Interacciones "Muertas" (Filtros Inteligentes)
La estructura del Sidebar (filtros a la izquierda) no es estática. A través de la lógica de *Smart Filters* (`calculateAvailable()`), el sistema evalúa la colección de datos disponible. 
*   **Comportamiento**: Si seleccionas la sede "Robledo", el filtro de "Asesores" se actualizará instantáneamente para **ocultar a los profesores que no enseñen en Robledo**. No es posible seleccionar combinaciones incongruentes que devuelvan "0 Resultados", evitando frustración por búsquedas vacías.

## 6. Advertencias Internas y Estados Especiales
Los estados como "Cancelado" o "Interno" sobrescriben los colores.
*   Un evento Cancelado formatea la ficha en color Rojo translúcido bloqueando su selección o enlace hipervínculo.
*   Un evento Interno despliega una notificación visible amarilla: *"⚠️ Solo contratistas/docentes"*, evitando confusiones de estudiantes presentándose a lugares corporativos.
