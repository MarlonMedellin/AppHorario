import Papa from 'papaparse';

// URL del Google Sheet publicado como CSV - MATRIZ_FLEXIBLE (gid=667862355)
const GOOGLE_SHEET_URL = import.meta.env.PUBLIC_CSV_URL_MATRIZ;

// URL del Google Sheet publicado como CSV - CONFIG (gid=1307903452)
const CONFIG_SHEET_URL = import.meta.env.PUBLIC_CSV_URL_CONFIG;

export async function fetchMatrizFlexible() {
    // Validar URL antes de fetch para evitar errores de compilación si falta la ENV
    if (!GOOGLE_SHEET_URL) {
        console.error('❌ ERROR CRÍTICO: PUBLIC_CSV_URL_MATRIZ no está definida en las variables de entorno.');
        return [];
    }

    try {
        // Fetch desde Google Sheets
        const response = await fetch(GOOGLE_SHEET_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvContent = await response.text();

        const { data: rawData } = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false
        });

        // Validar y limpiar datos
        // Se requiere que tenga al menos Asesor y Día para ser válido
        // Validar y limpiar datos
        // Se requiere que tenga al menos Asesor y Día para ser válido
        const cleanData = rawData
            .filter(row =>
                row.Asesor && row.Asesor.trim() !== '' &&
                row.Día && row.Día.trim() !== ''
            )
            .map(row => {
                // Robust key finding
                const keys = Object.keys(row);
                const areaKey = keys.find(k => k.toLowerCase().includes('rea')) || 'Area';
                const startKey = keys.find(k => k.toLowerCase().includes('inicio')) || 'Hora_Inicio';
                const endKey = keys.find(k => k.toLowerCase().includes('fin')) || 'Hora_Fin';

                return {
                    ...row,
                    Area: row[areaKey],
                    Hora_Inicio: row[startKey],
                    Hora_Fin: row[endKey],
                };
            });

        console.log(`✅ Datos cargados: ${cleanData.length} registros desde Google Sheets`);
        if (cleanData.length > 0) {
            console.log("Sample mapped row:", cleanData[0]);
        }

        return cleanData;
    } catch (error) {
        console.error('❌ Error al cargar datos desde Google Sheets:', error);

        // Fallback: retornar array vacío o datos dummy
        return [];
    }
}

export async function fetchConfigUsers() {
    if (!CONFIG_SHEET_URL) {
        console.error('❌ ERROR CRÍTICO: PUBLIC_CSV_URL_CONFIG no está definida en las variables de entorno.');
        return [];
    }

    try {
        const response = await fetch(CONFIG_SHEET_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvContent = await response.text();

        const { data: rawData } = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false
        });

        // Validar que tenga al menos Correo
        const cleanData = rawData.filter(row => row.Correo && row.Correo.trim() !== '');

        console.log(`✅ CONFIG cargado: ${cleanData.length} usuarios desde Google Sheets`);

        return cleanData;
    } catch (error) {
        console.error('❌ Error al cargar CONFIG desde Google Sheets:', error);
        return [];
    }
}
