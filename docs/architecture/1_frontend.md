# Arquitectura de Software: Capa Frontend

**Propósito:** Definir la interfaz de usuario, experiencia interactiva (UX/UI) y manipulación del Document Object Model (DOM) de la aplicación *AppHorario*.

## Componentes Principales
1. **Astro (Framework Orquestador)**: Encargado del enrutamiento base, la estructura semántica de HTML (`Layouts/Pages`) y el inyectado de estilos principales.
2. **React (Islas Interactivas)**: Orquestador reactivo para las secciones que demandan alta manipulación del estado (v.g. la tabla de horarios, filtros laterales, búsquedas en vivo).
3. **Tailwind CSS v4**: Motor de estilos por clases atómicas. 

## Solución a la Deuda Técnica (Unificación DRY)
Actualmente existen versiones paralelas de componentes visuales (e.g. `HorarioTable.astro` vs `HorarioTable.jsx`, `SidebarFilters.astro` vs `SidebarFilters.jsx`).
*   **Decisión Arquitectónica:** Se migrarán las tablas y los filtros laterales complejos estrictamente al ecosistema React. Astro solo envolverá estos elementos como "Islas" (`client:load` o `client:visible`).
*   **Objetivo:** Reducir las líneas de código un 40% y evitar que un cambio de diseño de una tarjeta (como el indicador rojo de "Cancelado") tenga que hacerse en dos lenguajes distintos.

## Características Transferidas a React
Las siguientes interacciones (ahora nativas en React) continuarán siendo la base de la UX:
*   **Auto-Selección del Día:** Uso de `new Date().getDay()` para posicionamiento inicial de pestañas.
*   **Sombreado Dinámico y "En Curso":** `useEffect` cada 60s comparando la hora local con la fila actual para aplicar el highlight en verde.
*   **Arquitectura Modular de Iconos:** Continuamos con el diccionario `areaColorMap`.
*   **Deep Linking:** Parseo nativo de los `window.location.search` (`?asesor=XXX`) gestionado por el state del cliente para pre-llenado en vivo de los Sidebars.
