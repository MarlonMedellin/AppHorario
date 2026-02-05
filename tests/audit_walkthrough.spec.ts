import { test, expect } from '@playwright/test';

test.describe('Auditoría MVP vs Documentación', () => {

    test('Navegación Completa y Verificación UI', async ({ page }) => {
        // 1. Carga inicial y Header
        await page.goto('/');
        await expect(page).toHaveTitle(/Horarios/i);

        // Verificar Subtítulo (BUSINESS_LOGIC.md)
        await expect(page.getByText('Ingreso permanente y graduación')).toBeVisible();

        // Verificar Nav Links (ARCHITECTURE.md - Rutas)
        const nav = page.locator('header nav').first();
        await expect(nav.getByText('Dashboard')).toBeVisible();
        await expect(nav.getByText('Personalizados')).toBeVisible();

        // 2. Tema Oscuro/Claro (UI_STYLE_GUIDE.md)
        const themeBtn = page.locator('#theme-toggle');
        await themeBtn.click(); // Cambiar a oscuro/claro
        await page.waitForTimeout(1000); // Pausa visual
        await themeBtn.click(); // Regresar

        // 3. Visualización de Datos (Index)
        // Verificar presencia de filtros (Sidebar)
        await expect(page.locator('aside')).toBeVisible();

        // Verificar búsqueda
        const searchInput = page.locator('input[placeholder*="Buscar"]'); // Ajustar selector si es necesario
        if (await searchInput.isVisible()) {
            await searchInput.fill('Matemáticas');
            await page.waitForTimeout(1000); // Ver filtrado
            await searchInput.clear();
        }

        // 4. Verificación de Colores de Área (UI_STYLE_GUIDE.md)
        // Busca algún elemento que deba tener borde de color (clase area-*)
        // Esto es heurístico, buscamos si existe al menos uno.
        const cardWithColor = page.locator('[class*="area-"]').first();
        if (await cardWithColor.isVisible()) {
            const classAttribute = await cardWithColor.getAttribute('class');
            console.log(`Clase de área detectada: ${classAttribute}`);
        }

        // 5. Navegación a Personalizados
        await page.getByRole('link', { name: 'Personalizados' }).click();
        await expect(page).toHaveURL(/.*personalizados/);
        await page.waitForTimeout(1500);

        // 6. Verificación de Auth (Login Modal)
        // Intentar ir a horario personal (debería requerir auth o mostrar botón login)
        await page.goto('/horario-personal');

        // Si no estamos logueados, ver si aparece el botón de login
        const loginBtn = page.locator('#login-btn');
        if (await loginBtn.isVisible()) {
            await loginBtn.click();
            await expect(page.locator('#login-modal')).toBeVisible();
            await expect(page.locator('#modal-title')).toHaveText('Iniciar Sesión');
            await page.waitForTimeout(1000);
            await page.locator('#close-modal').click();
        }

        // Finalizar en Home
        await page.goto('/');
        await page.waitForTimeout(1000);
    });
});
