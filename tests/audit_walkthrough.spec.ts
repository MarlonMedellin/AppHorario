import { test, expect } from '@playwright/test';

test.describe('Auditoría MVP vs Documentación', () => {

    test('Navegación Completa y Verificación UI', async ({ page }) => {
        // 1. Carga inicial y Header
        await page.goto('/');
        await expect(page).toHaveTitle(/Dashboard|Colmayor/i);

        // Verificar Sidebar (DashboardLayout usa SlimSidebar)
        await expect(page.locator('aside')).toBeVisible();

        // 2. Tema Oscuro/Claro (UI_STYLE_GUIDE.md)
        const themeBtn = page.locator('#theme-toggle');
        await themeBtn.click(); // Cambiar a oscuro/claro
        await page.waitForTimeout(1000); // Pausa visual
        await themeBtn.click(); // Regresar

        // 3. Visualización de Datos (Index)
        // Verificar presencia de contenido principal
        await expect(page.locator('main')).toBeVisible();

        // Verificar búsqueda si existe
        const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"]');
        const searchCount = await searchInput.count();
        if (searchCount > 0) {
            await searchInput.first().fill('Matemáticas');
            await page.waitForTimeout(1000); // Ver filtrado
            await searchInput.first().clear();
        }

        // 4. Navegación a Personalizados
        // Simular autenticación para evitar redirect
        await page.evaluate(() => {
            localStorage.setItem('horarios_session', JSON.stringify({
                nombre: 'Test User',
                correo: 'test@example.com',
                rol: 'Estudiante'
            }));
        });

        // Buscar link de personalizados en sidebar
        const personalLink = page.locator('a[href="/personalizados"]');
        if (await personalLink.count() > 0) {
            await personalLink.first().click();
            await expect(page).toHaveURL(/.*personalizados/);
            await page.waitForTimeout(1500);
        }

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
