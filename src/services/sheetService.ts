import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

// Inicialización condicional (Astro Edge)
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export async function fetchMatrizFlexible(forceRefresh = false) {
    if (!supabase) {
        console.warn('⚠️ IMPORTANTE: Credenciales de Supabase no configuradas (.env). Cargando datos Mock para propósitos de Testing visual.');
        return getMockData();
    }

    try {
        const { data, error } = await supabase
            .from('horarios')
            .select('*')
            // Opcional: ordenar si es necesario
            // .order('Día', { ascending: true })
            ;

        if (error) {
            throw error;
        }

        console.log(`✅ Datos cargados desde Supabase: ${data.length} registros (Ultra-rápidos).`);
        return data || [];
    } catch (error) {
        console.error('❌ Error crítico al consultar Supabase:', error);
        return []; // Fallback silencioso por seguridad
    }
}

// Mantenemos esto si hay otra tabla, pero en un caso ideal, esta config de usuarios
// también migraría a Supabase. De momento lo simularemos o ignoraremos, ya que el Auth puede suplirlo.
export async function fetchConfigUsers(forceRefresh = false) {
    return []; // Temporalmente desactivado hasta migrar Auth.
}

function getMockData() {
    const mockRows = [];
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    // Generar un registro Académico y uno Personalizado por cada día
    days.forEach(day => {
        mockRows.push({ Asesor: "Ing. Marlon Medellin", Día: day, Area: "Matemáticas", Hora_Inicio: "08:00", Hora_Fin: "11:00", Sede: "Robledo", Tipo: "Asesoría Académica", Asignatura: "Cálculo Diferencial", Modalidad: "Presencial" });
        mockRows.push({ Asesor: "Prof. Ana López", Día: day, Area: "Físicas", Hora_Inicio: "08:00", Hora_Fin: "10:00", Sede: "Poblado", Tipo: "Asesoría Personalizada", Asignatura: "Física Mecánica", Modalidad: "Virtual (Meet)", CTA: "Únete a la sesión" });
        mockRows.push({ Asesor: "Lic. Carlos Ruiz", Día: day, Area: "Químicas", Hora_Inicio: "14:00", Hora_Fin: "16:00", Sede: "Poblado", Tipo: "Asesoría Académica", Asignatura: "Química General", Modalidad: "Híbrido" });
        mockRows.push({ Asesor: "Luis Torres", Día: day, Area: "Cálculos", Hora_Inicio: "12:00", Hora_Fin: "14:00", Sede: "Robledo", Tipo: "Asesoría Académica", Asignatura: "Cálculo Integral", Modalidad: "Presencial" });
    });

    // Agregar un error simulado para validaciones
    mockRows.push({ Asesor: "Luis Torres", Día: "Vierness", Area: "Cálculos", Hora_Inicio: "12:0", Hora_Fin: "14:00", Sede: "Robledo", Tipo: "Asesoría Académica", Asignatura: "Cálculo Integral", Modalidad: "Presencial", hasTypoError: true, typoDetails: "Día inválido | Formato de hora incorrecto" });

    return mockRows;
}
