# Arquitectura de Software: Backend Implícito

**Propósito:** Procesamiento de reglas de negocio, mutaciones en vivo y transformación de datos brutos.

Actualmente, AppHorario no tiene una base de datos tradicional, sino que usa un Backend *Implícito* que se reparte entre las fórmulas directas de los administradores en Google Sheets y los parses CSV iniciales del cliente JS.

## Nueva Propuesta de Validación Severa (Zod)
Como se diagnosticó en la auditoría técnica, la lectura cruda vía `Papa.parse` convierte la data de la hoja de cálculo en objetos JavaScript volátiles. Un espacio en blanco de un administrador en "Hora Inicio" podría romper el dashboard de todo el colegio.

*   **Integración Propuesta (Zod + TypeScript):** En la capa del Node.js enviada a Cloudflare, toda fila del Dataframe pasará por un *esquema tipado* antes de enviarlo al cliente (React).

```typescript
// src/schemas/HorarioSchema.ts
import { z } from 'zod';

export const HorarioRowSchema = z.object({
  Asesor: z.string().min(2, "Requiere mínimo 2 caracteres"),
  Día: z.enum(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]),
  Area: z.string().default("Asesoría General"),
  Hora_Inicio: z.string().regex(/^\d{1,2}:\d{2}$/, "Formato HH:mm"),
  Hora_Fin: z.string().regex(/^\d{1,2}:\d{2}$/, "Formato HH:mm"),
  Sede: z.string(),
  Estado: z.string().optional()
});
```

*   **Filtrado Estricto (SafeParse):** Si un administrador escribe `Luness` en vez de `Lunes`, `Zod.safeParse()` omitirá esa fila del arreglo final y no corromperá la vista de los estudiantes (`silently failing` o bien se logueará internamente en consola).

## Manejo de Reglas de Negocio Centralizado
*   **Filtros Inteligentes de Negocio (`calculateAvailable`)**: Parte del procesamiento que cruzaba áreas vs. sedes (Smart Filters) ahora será unificado y validado a través de utilidades puras encapsuladas (`utils/filterEngine.ts`) exportadas al componente unificado de React. Esto separa por completo "quién calcula qué se muestra" de "quién lo dibuja".
*   **Gestión de Privacidad (Estado: Interno):** La regla condicional de negocio donde se descarta cualquier bloque marcado "Interno" para el Dashboard Main (público) ocurrirá del lado del servidor de Astro antes de que baje la información JSON al Payload del HTML final.
