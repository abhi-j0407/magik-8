import { defineConfig, devices } from '@playwright/test';

const previewHost = '127.0.0.1';
const previewPort = 4173;
const baseURL = `http://${previewHost}:${previewPort}`;

const previewCmd = `npm run build && npm run preview -- --host ${previewHost} --port ${previewPort}`;
const previewWebglCmd =
  'VITE_WEBGL=true VITE_WEBGL_E2E=true npm run build && npm run preview -- --host 127.0.0.1 --port 4173';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/webgl.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      webServer: {
        command: previewCmd,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
      },
    },
    {
      name: 'chromium-webgl',
      testMatch: '**/webgl.spec.ts',
      timeout: 60_000,
      use: { ...devices['Desktop Chrome'] },
      webServer: {
        command: previewWebglCmd,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 240_000,
      },
    },
  ],
});
