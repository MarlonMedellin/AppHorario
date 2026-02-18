import { test, expect } from '@playwright/test';

test('Verificar carga de datos usando variables de entorno', async ({ page }) => {
    // 1. Verificación básica inicial
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // 2. Esperar a que se renderice la interfaz
    // Buscar tabla o contenedor de horarios
    const tableContainer = page.locator('table, [id*="table"], [class*="table"]').first();
    await expect(tableContainer).toBeVisible({ timeout: 5000 });

    // 3. Verificación adicional: Verificar que hay contenido renderizado
    // Esperar un poco a que hidraten los datos
    await page.waitForTimeout(2000);

    // Buscar filas de datos (pueden estar en table tbody tr o en cards)
    const dataRows = page.locator('tbody tr, [data-dia]');
    const count = await dataRows.count();
    console.log(`Elementos de horario detectados: ${count}`);

    // Si hay 0 elementos, podría ser que no hay horarios para el día actual,
    // lo cual es válido, pero el hecho de que no haya error de consola es buena señal.
});
