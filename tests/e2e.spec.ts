import { test, expect } from '@playwright/test';

test('App de Horarios carga correctamente', async ({ page }) => {
    // Navegar a la página principal
    // Asume que el servidor de desarrollo está corriendo en el puerto 4321
    await page.goto('/');

    // Verificar que el título contiene "Dashboard" o "Colmayor"
    await expect(page).toHaveTitle(/Dashboard|Colmayor/i);

    // Pausa breve para que el usuario pueda ver la página
    await page.waitForTimeout(2000);
});
