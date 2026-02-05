import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'line',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:4321',
        reuseExistingServer: true,
    },
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:4321',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',

        /* CRITICAL: Show the browser window so the user sees what's happening */
        headless: false,

        /* Slow down operations slightly so they are visible */
        launchOptions: {
            slowMo: 500,
        }
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
