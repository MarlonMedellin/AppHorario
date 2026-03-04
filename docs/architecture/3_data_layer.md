# Arquitectura de Software: Capa de Datos

**Propósito:** Interconexión permanente de recolección de información fuente.

Este diseño se rige explícitamente por el requerimiento de mantener **Google Sheets** como única base de datos administrativa principal (Sin Bases de Datos tradicionales, y excluyendo Supabase/PostgreSQL/NoSQL).

## Endpoint de Verdad (CSV Públicos)
1.  **Orígenes Múltiples:** AppHorario extrae la información conectándose a varios parámetros `.CSV` habilitados públicamente vía Google:
    *   `PUBLIC_CSV_URL_MATRIZ`: Contiene el esquema completo de horarios.
    *   `PUBLIC_CSV_URL_CONFIG`: Contiene la información temporal de correos electrónicos habilitados para acceso a la web.
2.  **Lógica de Fetch:** (`services/sheetService.ts`) La extracción asíncrona es realizada usando directivas de "timestamp query strings" (`?t=34384938`) para puentear cachés estales del navegador y asegurar descarga fresca.
3.  **Procesamiento Liviano Base:** `PapaParse` iterará las decenas o centenas de filas de Google devolviéndolas parseadas nativamente separadas por comas hacia la capa del *Backend Implícito* (Quien usará el esquema de Zod para limpiarlas antes de dibujar).

## Consideraciones contra el Abuso (Rate Limiting de Google)
Dado que no existe Supabase para indexar las respuestas:
*   El **payload (tamaño de descarga de Google)** y la **frecuencia o cantidad de hilos de red (Network Requests)** están íntimamente ligados a cuántos estudiantes entren en período de finales al mismo tiempo intentando acceder al recurso web de forma aislada.
*   **Decisión Arquitectónica:** En un futuro cercano, el componente principal ya no hará `fetch` al Google Sheet desde el navegador del estudiante en CSR, sino que **lo hará el Edge Function de Cloudflare (SSI o ISR)**, mitigando drásticamente el impacto de peticiones masivas al proveedor e inyectando las filas dentro del DOM unificado.
