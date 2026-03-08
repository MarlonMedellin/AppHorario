import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

// Inicialización condicional (Astro Edge)
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Cache en memoria con TTL para evitar consultas repetidas a Supabase
let cachedHorarios: any[] | null = null;
let cacheTimestampHorarios = 0;
let cachedUsuarios: any[] | null = null;
let cacheTimestampUsuarios = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export async function fetchMatrizFlexible(forceRefresh = false) {
    if (!supabase) {
        console.warn('⚠️ IMPORTANTE: Credenciales de Supabase no configuradas (.env). Cargando datos Mock para propósitos de Testing visual.');
        return getMockData();
    }

    // Retornar caché si es válido y no se fuerza refresh
    if (!forceRefresh && cachedHorarios && (Date.now() - cacheTimestampHorarios < CACHE_TTL)) {
        console.log(`⚡ Datos servidos desde caché (${cachedHorarios.length} registros).`);
        return cachedHorarios;
    }

    try {
        const { data, error } = await supabase
            .from('horarios')
            .select('Asesor,Día,Area,Hora_Inicio,Hora_Fin,Sede,Tipo,Asignatura,Modalidad,Ubicación_Detalle,CTA,Link_Foto,Estado,hasTypoError,typoDetails');

        if (error) {
            throw error;
        }

        console.log(`✅ Datos cargados desde Supabase: ${data.length} registros (Ultra-rápidos).`);
        cachedHorarios = data || [];
        cacheTimestampHorarios = Date.now();
        return cachedHorarios;
    } catch (error) {
        console.error('❌ Error crítico al consultar Supabase:', error);
        // Si hay caché expirado, usarlo como fallback
        if (cachedHorarios) {
            console.warn('⚠️ Usando caché expirado como fallback.');
            return cachedHorarios;
        }
        return []; // Fallback silencioso por seguridad
    }
}

export async function fetchConfigUsers(forceRefresh = false) {
    if (!supabase) {
        console.warn('⚠️ IMPORTANTE: Credenciales de Supabase no configuradas. Retornando lista vacía de usuarios.');
        return [];
    }

    // Retornar caché si es válido
    if (!forceRefresh && cachedUsuarios && (Date.now() - cacheTimestampUsuarios < CACHE_TTL)) {
        return cachedUsuarios;
    }

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*');

        if (error) {
            throw error;
        }

        console.log(`✅ Usuarios cargados desde Supabase: ${data?.length || 0} registros.`);
        cachedUsuarios = data || [];
        cacheTimestampUsuarios = Date.now();
        return cachedUsuarios;
    } catch (error) {
        console.error('❌ Error al consultar usuarios en Supabase:', error);
        if (cachedUsuarios) {
            return cachedUsuarios;
        }
        return [];
    }
}

function getMockData() {
    const mockRows: any[] = [];
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
