const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({

  testDir: './tests',

  timeout: 120000,

  expect: { timeout: 15000 },

  retries: process.env.CI ? 2 : 0,

  workers: 1,  // One context per run = one login (OTP); session stays alive for all tests
  fullyParallel: false,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
      testIgnore: /.*\.setup\.js/
      // Auth via fixtures.js: one shared context per worker, login once
    }
  ],

  use: {
    baseURL: process.env.BASE_URL,
    headless: process.env.HEADLESS === 'true',

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    actionTimeout: 15000,
    navigationTimeout: 60000
  }

});
