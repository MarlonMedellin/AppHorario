# Esquema de Datos (Estructura de Google Sheets)

## Hoja: MATRIZ_FLEXIBLE
| Campo | Tipo | Función |
| :--- | :--- | :--- |
| Orden_Dia | Int | Para ordenar cronológicamente (1=Lunes, etc). |
| Día | String | Nombre del día para pestañas. |
| Hora_Inicio / Fin | Time | Rango de la asesoría. |
| Asesor | String | Nombre completo del profesional. |
| Asignatura | String | Nombre de la materia o actividad. |
| Sede | String | Ubicación general (Robledo, C4TA, etc). |
| Modalidad | String | Presencial, Virtual (Meet/Teams/WA), Híbrido. |
| Ubicación_Detalle | String | Aula física o Enlace directo (URL). |
| Estado | String | Activo, Interno, Cancelado. |
| AUTO_ID_Unico | ID | [Día]-[Hora]-[Asesor]. |
| Area | String | Categoría para filtros del Sidebar y código de colores. |
| Tipo | String | 'Asesoría Académica' (Pública) o 'Asesoría Personalizada' (Privada/Filtrada). |

## Hoja: CONFIG
- `Asesores`, `Correo`, `Rol` (Asesor/Psicoeducador/Ambos), `WhatsApp`, `Link_Foto`.

## Hoja: CATALOGOS
- Manejada como **listas verticales independientes** (Rangos A2:A, B2:B, etc.) para alimentar las validaciones de la matriz y las opciones de los filtros en el Sidebar.