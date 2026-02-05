import { test, expect } from '@playwright/test';

test('App de Horarios carga correctamente', async ({ page }) => {
    // Navegar a la página principal
    // Asume que el servidor de desarrollo está corriendo en el puerto 4321
    await page.goto('/');

    // Verificar que el título contiene "Horario" o algún texto relevante
    // Ajusta esto según el contenido real de tu aplicación
    await expect(page).toHaveTitle(/Horario/i);

    // Pausa breve para que el usuario pueda ver la página
    await page.waitForTimeout(2000);
});
