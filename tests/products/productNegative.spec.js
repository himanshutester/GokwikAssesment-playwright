/**
 * Negative: create product without required field (title), assert validation.
 */

const { test, expect } = require('@playwright/test');
const DashboardPage = require('../../pages/DashboardPage');
const ProductsPage = require('../../pages/ProductsPage');
const env = require('../../config/env');

test.describe('Product Negative @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const dashboard = new DashboardPage(page);
    await dashboard.merchantDropdown.waitFor({ state: 'visible' });
    await dashboard.switchMerchant(env.merchantId);
    await dashboard.navigateToProducts(env.merchantId);
  });

  test('create product without title shows validation error', async ({ page }) => {
    const products = new ProductsPage(page);

    await products.createProductWithoutTitle();

    // Single element: title field error (strict mode – avoid multiple matches)
    await expect(page.locator('[data-test-id="title_input_form_item"]').getByText('Title is required')).toBeVisible({ timeout: 10000 });
  });
});
