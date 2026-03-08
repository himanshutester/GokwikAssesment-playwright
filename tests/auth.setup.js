const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const env = require('../config/env');

test('authenticate user session', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate(env.baseURL);
  await loginPage.login(env.login.email, env.login.password, env.login.otp);

  // App may stay on index.html (SPA); wait for dashboard content
  await page.getByRole('button', { name: 'qa.gokwik down' }).waitFor({ state: 'visible', timeout: 30000 });

  await page.context().storageState({ path: 'storageState.json' });
});
