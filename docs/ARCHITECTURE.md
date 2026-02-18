# Arquitectura del Sistema: HorariosQuedate

## Tech Stack
- **Framework:** Astro (SSG + Islas de React para interactividad).
- **Estilos:** Tailwind CSS (v4) con variables CSS nativas para temas.
- **Despliegue:** Cloudflare Pages (vía GitHub).
- **Fuente de Datos:** Google Sheets publicado como CSV.
- **Parsing:** PapaParse (procesamiento de CSV en el cliente).

## Estructura de Proyecto
- **Layouts:** 
  - `Layout.astro`: Layout base legado.
  - `DashboardLayout.astro`: Nuevo layout principal con Sidebar y TopBar.
- **Componentes:**
  - `SlimSidebar`: Navegación vertical colapsada.
  - `TopBar`: Barra superior con toggle de tema y perfil.
  - `SummaryCards`: Widgets de resumen académico.
  - `AnnouncementCard`: Banner de notificaciones.
  - `Dashboard.jsx`: Tabla de horarios interactiva (React).

## Estructura de Datos (Endpoints CSV)
1. **Matriz:** Hoja `EXPORTA` (Solo registros con Estado 'Activo').
2. **Matriz Completa:** Hoja `MATRIZ_FLEXIBLE` (Para vistas privadas de Asesores/Psicoeducadores).
3. **Usuarios:** Hoja `CONFIG` (Manejo de Roles y correos).
4. **Validadores:** Hoja `CATALOGOS` (Para mapeo de colores por Área y nombres de filtros).

## Flujo de Navegación
- **Dashboard (`/`):** Vista principal con resumen, anuncios y horario del día.
- **Horario Personal (`/horario-personal`):** Vista completa del calendario/tabla de todas las asesorías.
- **Personalizados (`/personalizados`):** Vista filtrada para asesorías personalizadas.
- **Auth:** Modal de login valida contra hoja `CONFIG` y persiste sesión en `localStorage`.