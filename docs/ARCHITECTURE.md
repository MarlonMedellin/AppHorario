# Arquitectura del Sistema: HorariosQuedate

## Tech Stack
- **Framework:** Astro (SSG para rutas estáticas / Client-side para filtrado dinámico).
- **Despliegue:** Cloudflare Pages (vía GitHub).
- **Fuente de Datos:** Google Sheets publicado como CSV.
- **Parsing:** PapaParse (procesamiento de CSV en el cliente).

## Estructura de Datos (Endpoints CSV)
1. **Matriz:** Hoja `EXPORTA` (Solo registros con Estado 'Activo').
2. **Matriz Completa:** Hoja `MATRIZ_FLEXIBLE` (Para vistas privadas de Asesores/Psicoeducadores).
3. **Usuarios:** Hoja `CONFIG` (Manejo de Roles y correos).
4. **Validadores:** Hoja `CATALOGOS` (Para mapeo de colores por Área y nombres de filtros).

## Flujo de Navegación
- **Pestaña Única (Google Sites):** Embebe la App de Astro.
- **Deep Linking:** El sistema escucha parámetros en la URL (p.e. `?asesor=Marlon`) para abrir el `index` con filtros pre-aplicados.