import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Utilizando fetch de Node (disponible >= 18)
async function fetchAndSaveMatriz() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Necesitamos pasar la URL como argumento ya que no estamos en el contexto astro
    const sheetsUrl = process.argv[2];

    if (!sheetsUrl) {
        console.error("❌ Por favor pasa la URL pública de tu CSV de Google Sheets como argumento.");
        console.log("👉 Uso: node syncMatriz.mjs 'https://docs.google.com/spreadsheets/d/e/2PACX.../pub?output=csv'");
        process.exit(1);
    }

    try {
        console.log("⏳ Forzando obtención en tiempo real desde Google Sheets...");
        console.log("🌐 URL:", sheetsUrl.substring(0, 50) + "...");

        const timestamp = new Date().getTime();
        const fetchUrl = `${sheetsUrl}${sheetsUrl.includes('?') ? '&' : '?'}cache_buster_id=${timestamp}`;

        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error(`Error en la Petición: ${response.status} ${response.statusText}`);
        }

        const csvText = await response.text();

        // Vamos a guardar una copia fresca local (puede ser .json o el mismo .csv) 
        // para que Astro lo absorba durante el dev mode.
        const targetPath = path.resolve(__dirname, '../data/matriz_fresca.csv');

        // Aseguramos que el dir exista
        const fs = await import('fs');
        const dir = path.dirname(targetPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        writeFileSync(targetPath, csvText, 'utf8');
        console.log(`✅ ¡Sincronizado Mágicamente!`);
        console.log(`📁 Guardado en ${targetPath}`);
        console.log(`⌚ El caché ha sido evadido exitosamente a las ${new Date().toLocaleTimeString()}`);

    } catch (error) {
        console.error("❌ Fallo durante la sincronización: ", error);
        process.exit(1);
    }
}

fetchAndSaveMatriz();
