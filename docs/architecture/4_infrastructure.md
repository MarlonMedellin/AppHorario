# Arquitectura de Software: Infraestructura (Cloudflare)

**Propósito:** Despliegue, disponibilidad, enrutamiento, Edge Computing, SEO y caching del lado del servidor.

El proyecto de AppHorario se beneficia profundamente del despliegue en un modelo "Serverless" (Sin Servidor dedicado). Anteriormente, Astro se usaba como compilador estático (Vite Runner), lo cual significaba que el HTML nacía en "build-time".

## Estrategia de Cómputo Universal (Edge / Cloudflare Pages)
*   **Adaptador Específico:** Integrar el plugin `@astrojs/cloudflare` en `astro.config.mjs` modificando la propiedad hacia *`output: 'server'`* o preferiblemente *`output: 'hybrid'`*. 
*   **¿Por qué cambia todo?:** Permite que Astro construya el archivo inicial (e.g., `index.html`) dinámicamente "al momento". Antes de que Cloudflare devuelva el diseño renderizado a la pantalla del visitante, su propio nodo (Edge Data Center) intercepta momentáneamente el Google Sheet, y renderiza la maqueta vacía llenándola de reactividad y el DOM pesado y depurado de Excel sin obligar al navegador del usuario a sufrir o procesar datos lentos (*Server-Side Rendering* inicial con Arquitectura de Islas).
*   **Gestión Central de Secretos y Entornos:** Las API Keys y URLs maestras de Google Docs (`PUBLIC_CSV_URL_MATRIZ`) no flotarían en el cliente JS. Están guardadas y administradas seguramente en la consola remota de "Configuración de Variables de Entorno" de Cloudflare Pages (En la capa segura SSR de Astro).

## SEO & Rendimiento
El TBT (Total Blocking Time) y LCP (Largest Contentful Paint) mejoran ya que la infraestructura asume la carga matemática pesada y pre-calcula los componentes unificados en React. Un "robot" de Google Indexing logrará indexar exitosamente los horarios expuestos como texto renderizado nativo en el Edge y no únicamente componentes en Javascript de React en un SPA cargando (*Search Engine Optimization* amigable).
