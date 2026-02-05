import { test, expect } from '@playwright/test';

test('Usuario puede abrir el modal de login', async ({ page }) => {
    // 1. Ir a la página principal
    await page.goto('/');

    // 2. Verificar que el modal está oculto inicialmente
    const modal = page.locator('#login-modal');
    await expect(modal).toHaveClass(/hidden/);

    // 3. Hacer clic en el botón "Iniciar Sesión"
    await page.click('#login-btn');

    // 4. Verificar que el modal ya NO tiene la clase 'hidden' y es visible
    await expect(modal).not.toHaveClass(/hidden/);
    await expect(modal).toBeVisible();

    // 5. Verificar que el título del modal es correcto
    const modalTitle = page.locator('#modal-title');
    await expect(modalTitle).toHaveText('Iniciar Sesión');

    // Pausa intencional para demostración visual
    await page.waitForTimeout(3000);
});
