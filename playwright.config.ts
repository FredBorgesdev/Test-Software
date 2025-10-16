import { defineConfig, devices } from '@playwright/test';

const API_BASE_URL = 'https://restful-booker.herokuapp.com';
const WEB_BASE_URL = 'https://automationintesting.online';
const authFile = 'playwright/.auth/user.json';

export default defineConfig({
    testDir: './tests',
    timeout: 60 * 1000,
    fullyParallel: true, // Execução paralelizada dos testes
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    // Uso eficiente de workers para paralelismo
    workers: process.env.CI ? 2 : undefined, 
    reporter: 'html',

    use: {
        trace: 'on-first-retry',
        // baseURL: 'http://localhost:3000', 
    },

    projects: [
        {
            name: 'api setup',
            testMatch: 'tests/api/api.setup.ts',
        },
        {
            name: 'api',
            testDir: './tests/api', 
            dependencies: ['api setup'],
            use: {
                baseURL: API_BASE_URL,
                storageState: authFile, 
                extraHTTPHeaders: {
                    'Accept': 'application/json',
                },
            },
        },

        {
            name: 'web',
            testDir: './tests/web',
            use: {
                baseURL: WEB_BASE_URL,
                ...devices['Desktop Chrome'],
                headless: true,
            },
        },
    ],
});