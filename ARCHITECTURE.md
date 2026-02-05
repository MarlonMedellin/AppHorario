# Arquitectura del Sistema: HorariosQuedate

## Tech Stack
- **Framework:** Astro (Static Site Generation / Client-side Filtering).
- **Despliegue:** Cloudflare Pages (vía GitHub Repo).
- **Base de Datos (Headless):** Google Sheets publicado como CSV.
- **Estilos:** Tailwind CSS.
- **Parsing:** PapaParse.

## Flujo de Datos
1. Google Sheets expone 2 URLs de CSV (Matriz y Usuarios).
2. El cliente (Astro) hace un `fetch` inicial de los datos.
3. Los datos se almacenan en memoria y se filtran dinámicamente según la interacción del usuario.

## Rutas y Acceso
- `/` (Público): Dashboard con filtros laterales por Asesor, Área y Sede.
- `/login`: Autenticación por correo (sin contraseña).
- `/horario-personal`: (Privado - Perfil Asesor) Horario propio filtrado por día actual.
- `/personalizados`: (Privado - Perfil Psicoeducador/Asesor) Lista total de asesorías de tipo 'Personalizada'.