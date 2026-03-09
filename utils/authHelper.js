/**
 * Ensures the user is logged in. If session expired (login page visible), re-runs login.
 * Use after page.goto('/') so tests don't fail when the app logs the user out after a while.
 */

const LoginPage = require('../pages/LoginPage');
const env = require('../config/env');

const DASHBOARD_DROPDOWN = 'qa.gokwik down';
const LOGIN_EMAIL_FIELD = 'example@email.com';

async function ensureLoggedIn(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const loginVisible = await page
    .getByRole('textbox', { name: LOGIN_EMAIL_FIELD })
    .isVisible()
    .catch(() => false);

  if (loginVisible) {
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.baseURL);
    await loginPage.login(env.login.email, env.login.password, env.login.otp);
  }

  await page.getByRole('button', { name: DASHBOARD_DROPDOWN }).waitFor({ state: 'visible', timeout: 60000 });
}

module.exports = { ensureLoggedIn };
