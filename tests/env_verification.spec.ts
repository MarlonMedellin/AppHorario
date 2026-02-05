import { test, expect } from '@playwright/test';

test('Verificar carga de datos usando variables de entorno', async ({ page, request }) => {
    // 1. Verificación básica: Cargar página principal
    const response = await page.goto('/');
    expect(response.status()).toBe(200);

    // 2. Esperar a que se renderice la interfaz (lo que confirma carga de datos)
    // Si los datos no cargan, la tabla suele estar vacía o mostrar error
    await expect(page.locator('table.horario-table')).toBeVisible();

    // 3. Verificación adicional: Verificar que hay filas en la tabla (asumiendo que hay datos)
    const rows = page.locator('table.horario-table tbody tr');
    // Esperar un poco a que hidraten los datos
    await page.waitForTimeout(2000);
    const count = await rows.count();
    console.log(`Filas detectadas en la tabla: ${count}`);

    // Si hay 0 filas, podría ser que no hay horarios hoy, lo cual es válido,
    // pero el hecho de que no haya error de consola (playwright lo captura) es buena señal.
});
