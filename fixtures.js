/**
 * Custom fixtures: one browser context per worker, login once per worker.
 * Keeps session alive for all tests so the app doesn't log us out after the 1st test.
 * We use a custom fixture name (sharedContext) because Playwright does not allow
 * overriding the built-in "context" fixture with a different scope.
 */

const { test: baseTest } = require('@playwright/test');
const LoginPage = require('./pages/LoginPage');
const env = require('./config/env');

const test = baseTest.extend({
  sharedContext: [
    async ({ browser }, use) => {
      const context = await browser.newContext({
        baseURL: env.baseURL
      });
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      await loginPage.navigate(env.baseURL);
      await loginPage.login(env.login.email, env.login.password, env.login.otp);
      await page.getByRole('button', { name: 'qa.gokwik down' }).waitFor({ state: 'visible', timeout: 60000 });
      await page.close();
      await use(context);
      await context.close();
    },
    { scope: 'worker' }
  ],
  page: [
    async ({ sharedContext }, use) => {
      const page = await sharedContext.newPage();
      await use(page);
      await page.close();
    },
    { scope: 'test' }
  ]
});

module.exports = { test, expect: require('@playwright/test').expect };
