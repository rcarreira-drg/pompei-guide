import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173/pompei-guide/',
    trace: 'retain-on-failure',
    permissions: ['geolocation'],
    geolocation: { latitude: 40.7484, longitude: 14.4816 },
    locale: 'es-ES',
  },
  projects: [
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', browserName: 'chromium' } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/pompei-guide/',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
