import Papa from 'papaparse';
import { HorarioRowSchema } from '../schemas/HorarioSchema';

const GOOGLE_SHEET_URL = import.meta.env.PUBLIC_CSV_URL_MATRIZ;
const CONFIG_SHEET_URL = import.meta.env.PUBLIC_CSV_URL_CONFIG;

// Memoria Caché para evitar "Rate limit" de Google
let cachedMatrizData: any[] | null = null;
let lastMatrizFetchTime = 0;

let cachedConfigData: any[] | null = null;
let lastConfigFetchTime = 0;

// Configurado a 3 minutos
const CACHE_DURATION_MS = 3 * 60 * 1000;

export async function fetchMatrizFlexible(forceRefresh = false) {
    if (!GOOGLE_SHEET_URL) {
        console.warn('⚠️ IMPORTANTE: PUBLIC_CSV_URL_MATRIZ no está definida. Cargando datos Mock para propósitos de Testing visual.');
        return getMockData();
    }

    const now = Date.now();
    // Cache Check
    if (!forceRefresh && cachedMatrizData && (now - lastMatrizFetchTime < CACHE_DURATION_MS)) {
        console.log(`⚡ Retornando Matriz Flexible desde Caché (Válido por ${Math.round((CACHE_DURATION_MS - (now - lastMatrizFetchTime)) / 1000)}s más)`);
        return cachedMatrizData;
    }

    try {
        const timestamp = new Date().getTime();
        const fetchUrl = `${GOOGLE_SHEET_URL}${GOOGLE_SHEET_URL.includes('?') ? '&' : '?'}t=${timestamp}`;

        const response = await fetch(fetchUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvContent = await response.text();

        const { data: rawData } = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false
        });

        const cleanData = (rawData as any[])
            .filter(row => row.Asesor && row.Asesor.trim() !== '' && row.Día && row.Día.trim() !== '')
            .map(row => {
                const keys = Object.keys(row);
                const areaKey = keys.find(k => k.toLowerCase().includes('rea')) || 'Area';
                const startKey = keys.find(k => k.toLowerCase().includes('inicio')) || 'Hora_Inicio';
                const endKey = keys.find(k => k.toLowerCase().includes('fin')) || 'Hora_Fin';
                const ctaKey = keys.find(k => k.toLowerCase() === 'cta') || 'CTA';
                const fotoKey = keys.find(k => k.toLowerCase().includes('foto')) || 'Link_Foto';

                const mappedRow = {
                    ...row,
                    Area: row[areaKey],
                    Hora_Inicio: row[startKey],
                    Hora_Fin: row[endKey],
                    CTA: row[ctaKey],
                    Link_Foto: row[fotoKey],
                };

                // Zod Validation (Notice Error)
                const validation = HorarioRowSchema.safeParse(mappedRow);

                if (!validation.success) {
                    return {
                        ...mappedRow,
                        hasTypoError: true,
                        // Convertir errores a string legible
                        typoDetails: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(" | ")
                    };
                }

                return {
                    ...mappedRow,
                    hasTypoError: false
                };
            });

        console.log(`✅ Datos cargados y validados: ${cleanData.length} registros (Zod applied). Caché actualizado.`);

        // Guardar en caché el éxito
        cachedMatrizData = cleanData;
        lastMatrizFetchTime = now;

        return cleanData;
    } catch (error) {
        console.error('❌ Error al cargar datos desde Google Sheets:', error);
        return cachedMatrizData || []; // Salvavidas: devolver data vieja si Google falló.
    }
}

export async function fetchConfigUsers(forceRefresh = false) {
    if (!CONFIG_SHEET_URL) {
        console.error('❌ ERROR CRÍTICO: PUBLIC_CSV_URL_CONFIG no está definida en las variables de entorno.');
        return [];
    }

    const now = Date.now();
    if (!forceRefresh && cachedConfigData && (now - lastConfigFetchTime < CACHE_DURATION_MS)) {
        return cachedConfigData;
    }

    try {
        const timestamp = new Date().getTime();
        const fetchUrl = `${CONFIG_SHEET_URL}${CONFIG_SHEET_URL.includes('?') ? '&' : '?'}t=${timestamp}`;

        const response = await fetch(fetchUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvContent = await response.text();

        const { data: rawData } = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false
        });

        const cleanData = (rawData as any[]).filter(row => row.Correo && row.Correo.trim() !== '');

        cachedConfigData = cleanData;
        lastConfigFetchTime = now;

        return cleanData;
    } catch (error) {
        console.error('❌ Error al cargar CONFIG:', error);
        return cachedConfigData || [];
    }
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
