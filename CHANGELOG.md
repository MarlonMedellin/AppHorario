# Changelog

All notable changes to this project will be documented in this file.

## [1.3.1] - 2026-02-05

### Fixed
- **Critical Auth:** Corrección de inconsistencia en clave de sesión (`user_session` -> `horarios_session`) que impedía detectar el login en el header y páginas protegidas.
- **Critical Theme:** Activación explícita de `darkMode: 'class'` para compatibilidad con Tailwind.

## [1.3.0] - 2026-02-05

### Added
- **Smart Filters:** Lógica dinámica en cascada para filtros (Sede -> Asesores/Áreas disponibles).
- **UX:** Auto-selección de día actual y soporte para Deep Linking (e.g., `/?asesor=Juan`).
- **Security:** Bloqueo inmediato de rutas privadas con alerta en cliente.

### Fixed
- **Theme:** Reparación del botón de modo oscuro (compatibilidad Tailwind v4).
- **Security:** Mejoras en la gestión de seguridad de rutas.

## [1.2.0] - 2026-02-05

### Changed
- **Architecture:** Migración total a **Client-Side Fetching** (React). Ahora los datos se cargan en vivo desde el navegador, eliminando la dependencia del build de Cloudflare.
- **Components:** Conversión de `HorarioTable`, `SidebarFilters` y `DayTabs` a componentes de React.
- **Deploy:** Eliminación de `wrangler.json` para permitir la inyección correcta de variables de entorno desde el panel de Cloudflare.

## [1.1.1] - 2026-02-05

### Fixed
- **Build:** Added null check for environment variables to prevent build failure (`fetch(undefined)` error).

## [1.1.0] - 2026-02-05

### Added
- **Security:** Implementación de variables de entorno para proteger las URLs de Google Sheets.
- **Config:** Soporte para `.env` local y `wrangler.json` (Cloudflare).

## [1.0.1] - 2026-02-05

### Fixed
- **Deploy:** Added `wrangler.json` to fix Cloudflare Pages deployment issues.

## [1.0.0] - 2026-02-05

### Added
- **Core:** Initial release of "HorariosQuedate" application.
- **Features:**
    - Visualización de horarios por día y tipo (Grid/Cards).
    - Filtrado dinámico por Área y Asesor.
    - Autenticación básica via email (Google Sheets verify).
    - Soporte para Tema Claro/Oscuro.
- **Testing:**
    - Configuración de Playwright para E2E testing.
    - Scripts de navegación en vivo (`test:live`).
    - Auditoría visual automatizada.
- **Documentation:**
    - Architecture, Business Logic, and UI Style Guide.
    - Setup and deployment instructions.
