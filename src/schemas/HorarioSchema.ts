import { z } from 'zod';

export const HorarioRowSchema = z.object({
    Asesor: z.string().min(2, "Requiere mínimo 2 caracteres"),
    Día: z.enum(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"], {
        errorMap: (issue, _ctx) => {
            return { message: "Día inválido. Revise la ortografía (e.g. 'Miércoles')." };
        }
    }),
    Area: z.string().default("Asesoría General"),
    Hora_Inicio: z.string().regex(/^\d{1,2}:\d{2}$/, "Formato HH:mm"),
    Hora_Fin: z.string().regex(/^\d{1,2}:\d{2}$/, "Formato HH:mm"),
    Sede: z.string().min(1, "Campo vacío"),
    Modalidad: z.string().optional(),
    Estado: z.string().optional(),
    Tipo: z.string().optional(),
    Asignatura: z.string().optional(),
    Ubicación_Detalle: z.string().optional(),
    Link_Foto: z.string().optional(),
});

export type AsesoriaRow = z.infer<typeof HorarioRowSchema>;
