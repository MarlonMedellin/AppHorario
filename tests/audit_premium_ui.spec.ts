import { test, expect } from '@playwright/test';

test.describe('Premium UI Enhancements Audit', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to a page with the schedule table (e.g., home or personal schedule)
        await page.goto('/');

        // Wait for the table to load its data
        await page.waitForSelector('table tbody tr', { state: 'visible', timeout: 10000 });
    });

    test('Phase 1: Verify Area badges have defined color classes (Heatmaps)', async ({ page }) => {
        // Find the first area badge in the table
        const areaBadge = page.locator('table tbody tr').first().locator('td').nth(1).locator('span.rounded-full').first();

        await expect(areaBadge).toBeVisible();

        // Assert it has at least one of our expected background classes (e.g., bg-blue-50, bg-green-50, bg-slate-50 for fallback)
        const className = await areaBadge.getAttribute('class');
        expect(className).toMatch(/bg-(blue|green|indigo|purple|yellow|orange|slate)-50/);
    });

    test('Phase 2: Verify Modality Icons (Video or Building)', async ({ page }) => {
        // Find the modality/sede badge in the last column (index 5)
        const modalityBadge = page.locator('table tbody tr').first().locator('td').nth(5).locator('span.inline-flex').first();

        await expect(modalityBadge).toBeVisible();

        // Check if an SVG icon exists inside the modality badge
        const svgIcon = modalityBadge.locator('svg');
        await expect(svgIcon).toHaveCount(1);
    });

    test('Phase 3: Verify Asesor Hover Popover works and displays Mock Data', async ({ page }) => {
        // Find the first advisor cell in the Desktop table
        const advisorCell = page.locator('table tbody tr .group\\/asesor').first();

        await expect(advisorCell).toBeVisible();

        // Hover over the advisor cell to trigger the hover state (opacity-100)
        await advisorCell.hover();

        // Look for the hover card container
        const hoverCard = advisorCell.locator('div').filter({ has: page.locator('img') }).first();

        // Ensure it's mounted and visible
        await expect(hoverCard).toBeVisible();

        // Check for Avatar image
        const avatarImage = hoverCard.locator('img');
        await expect(avatarImage).toBeVisible();
        await expect(avatarImage).toHaveAttribute('src', /ui-avatars\.com/);

        // Check that a CTA exists
        const ctaText = hoverCard.locator('p');
        await expect(ctaText).toBeVisible();
        await expect(ctaText).toContainText('éxito');
    });
});
