/**
 * Product CRUD: Dashboard verification (session reuse).
 * Full CRUD flow (create → update → delete) can be run locally with: npx playwright test --grep "Complete Product CRUD"
 */

const { test, expect } = require('@playwright/test');

test.describe('Product CRUD @smoke', () => {
  test('@smoke verify dashboard loads with saved session', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/dashboard/);
  });
});
