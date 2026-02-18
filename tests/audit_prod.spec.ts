import { test, expect } from '@playwright/test';

test('Audit Production Deployment', async ({ page }) => {
    // 1. Navigate to the production URL
    await page.goto('https://quedate.pages.dev/');

    // 2. Verify page title
    await expect(page).toHaveTitle(/HorariosQuedate|Colmayor/i);

    // 3. Verify the loading state appears (optional, might be too fast)
    // await expect(page.getByText('Cargando agenda...')).toBeVisible();

    // 4. Verify data rendering (table rows or cards, or empty-state message)

    // Check for at least one table row in desktop or card in mobile
    const rows = page.locator('table tbody tr');
    const cards = page.locator('#cards-container > div');
    const noDataMsg = page.getByText('No se encontraron resultados');
    const renderedState = rows.first().or(cards.first()).or(noDataMsg);

    // Wait until any expected render state becomes visible
    await expect(renderedState).toBeVisible({ timeout: 15000 });

    // Expect at least some data to be present
    // Note: If the sheet is empty, this test looks for the "No se encontraron resultados" message or rows.

    const hasRows = await rows.count() > 0;
    const hasCards = await cards.count() > 0;

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

    // 5. Test search only when the current deployment exposes a search input
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    const hasSearch = (await searchInput.count()) > 0;
    if (hasSearch) {
        await searchInput.first().fill('Matemáticas');
    }

    // Verify updates
    // Just ensure the page didn't crash
    await expect(renderedState).toBeVisible();

    console.log('Auditoría Exitosa: La página carga y muestra datos o estado vacío.');
});
