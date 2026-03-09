/**
 * Pagination: navigate to products, go to next page, assert UI.
 */

const { test, expect } = require('../../fixtures');
const DashboardPage = require('../../pages/DashboardPage');
const ProductsPage = require('../../pages/ProductsPage');
const env = require('../../config/env');

test.describe('Pagination @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const dashboard = new DashboardPage(page);
    await dashboard.merchantDropdown.waitFor({ state: 'visible', timeout: 60000 });
    await dashboard.switchMerchant(env.merchantId);
    await dashboard.navigateToProducts(env.merchantId);
  });

  test('next page and pagination controls visible', async ({ page }) => {
    const products = new ProductsPage(page);

    await products.searchInput.waitFor({ state: 'visible', timeout: 15000 });

    await expect(page.getByText('Show per page')).toBeVisible();
    await expect(products.nextPageButton).toBeVisible();

    await products.goToNextPage();

    await expect(products.nextPageButton).toBeVisible();
  });
});
