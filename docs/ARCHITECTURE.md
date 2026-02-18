# Arquitectura del Sistema: HorariosQuedate

## Tech Stack
- **Framework:** Astro (SSG + scripts cliente en componentes `.astro`).
- **Estilos:** Tailwind CSS (v4) con variables CSS nativas para temas.
- **Despliegue:** Cloudflare Pages (vía GitHub).
- **Fuente de Datos:** Google Sheets publicado como CSV.
- **Parsing:** PapaParse (procesamiento de CSV en servicio compartido).

## Estructura de Proyecto
- **Layouts:** 
  - `DashboardLayout.astro`: Layout principal activo (Sidebar, TopBar, Footer).
- **Componentes:**
  - `SlimSidebar`: Navegación vertical colapsada.
  - `TopBar`: Barra superior con toggle de tema y perfil.
  - `SummaryCards`: Widgets de resumen académico.
  - `AnnouncementCard`: Banner de notificaciones.
  - `HorarioTable.astro`: Render de horarios (tabla desktop + cards mobile).
  - `DayTabs.astro`: Filtro por día.
  - `SidebarFilters.astro`: Filtros por área/sede/asesor.
- **Feature module:**
  - `src/features/schedule/types.ts`: Tipos compartidos del dominio horario.
  - `src/features/schedule/filters.ts`: Helpers de filtrado reutilizables.

## Estructura de Datos (Endpoints CSV)
1. **Matriz Completa:** Hoja `MATRIZ_FLEXIBLE` (horarios de asesorías).
2. **Usuarios:** Hoja `CONFIG` (correos y roles para acceso).
3. **Validadores:** Hoja `CATALOGOS` (catálogos operativos, cuando aplique).

## Flujo de Navegación
- **Dashboard (`/`):** Vista principal con resumen, anuncios y horario del día.
- **Horario Personal (`/horario-personal`):** Vista completa del calendario/tabla de todas las asesorías.
- **Personalizados (`/personalizados`):** Vista filtrada para asesorías personalizadas.
- **Auth simple:** Modal de login valida correo contra `CONFIG`, persiste sesión en `localStorage` y aplica guard cliente para rutas protegidas.
