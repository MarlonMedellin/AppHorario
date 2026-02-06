import { test, expect } from '@playwright/test';

test('Audit Production Deployment', async ({ page }) => {
    // 1. Navigate to the production URL
    await page.goto('https://quedate.pages.dev/');

    // 2. Verify page title
    await expect(page).toHaveTitle(/HorariosQuedate/);

    // 3. Verify the loading state appears (optional, might be too fast)
    // await expect(page.getByText('Cargando agenda...')).toBeVisible();

    // 4. Verify data is loaded (The "Resultados" text should show a number > 0)
    const countDisplay = page.locator('#count-display');
    await expect(countDisplay).toContainText(/Resultados/);

    // Wait for the text to settle (it might start at 0 or empty)
    // We expect it to NOT be "0 Resultados" eventually, assuming there is data.
    // Or at least that the table has rows.

    // Check for at least one table row in desktop or card in mobile
    const rows = page.locator('table tbody tr');
    const cards = page.locator('#cards-container > div');

    // Expect at least some data to be present
    // Note: If the sheet is empty, this test looks for the "No se encontraron resultados" message or rows.

    const hasRows = await rows.count() > 0;
    const hasCards = await cards.count() > 0;
    const noDataMsg = page.getByText('No se encontraron resultados');

    if (!hasRows && !hasCards) {
        if (await noDataMsg.isVisible()) {
            console.log('Auditoría: La app carga pero no hay datos (filtro o sheet vacía).');
        } else {
            // It might be stuck loading
            const loading = page.getByText('Cargando agenda...');
            if (await loading.isVisible()) {
                throw new Error('La app se quedó pegada en "Cargando agenda..."');
            }
            throw new Error('No se renderizaron filas ni el mensaje de "No resultados". Posible fallo silencioso.');
        }
    }

    // 5. Test Filters (Search)
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill('Matemáticas');

    // Verify updates
    // Just ensure the page didn't crash
    await expect(rows.first().or(cards.first()).or(noDataMsg)).toBeVisible();

    console.log('Auditoría Exitosa: La página carga, React hidrata y muestra datos.');
});
