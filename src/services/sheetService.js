import Papa from 'papaparse';

// URL del Google Sheet publicado como CSV - MATRIZ_FLEXIBLE (gid=667862355)
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS7jPz93GM6sBo6PFYh5jtVK6TUEZGE8dD8xXz1YK6Sfvon4hIC4F4BFkfElzFoaOJN19VGezSUdtYF/pub?gid=667862355&single=true&output=csv';

// URL del Google Sheet publicado como CSV - CONFIG (gid=1307903452)
const CONFIG_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS7jPz93GM6sBo6PFYh5jtVK6TUEZGE8dD8xXz1YK6Sfvon4hIC4F4BFkfElzFoaOJN19VGezSUdtYF/pub?gid=1307903452&single=true&output=csv';

export async function fetchMatrizFlexible() {
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
        const cleanData = rawData.filter(row =>
            row.Asesor && row.Asesor.trim() !== '' &&
            row.Día && row.Día.trim() !== ''
        );

        console.log(`✅ Datos cargados: ${cleanData.length} registros desde Google Sheets`);

        return cleanData;
    } catch (error) {
        console.error('❌ Error al cargar datos desde Google Sheets:', error);

        // Fallback: retornar array vacío o datos dummy
        return [];
    }
}

export async function fetchConfigUsers() {
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
