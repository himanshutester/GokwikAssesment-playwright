const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({

  testDir: './tests',

  timeout: 60000,

  expect: { timeout: 10000 },

  retries: 2,

  workers: 4,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
      retries: 0  // Don't retry auth; if login fails, fail fast
    },
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        storageState: 'storageState.json'
      },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.js/
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
