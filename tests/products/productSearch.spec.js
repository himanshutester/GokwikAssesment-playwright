/**
 * Product search / filter: create product, search by name, verify result.
 */

const { test, expect } = require('../../fixtures');
const DashboardPage = require('../../pages/DashboardPage');
const ProductsPage = require('../../pages/ProductsPage');
const env = require('../../config/env');
const { createProductData } = require('../../utils/productFactory');

test.describe('Product Search @regression', () => {
  test('Search product by name @search', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const products = new ProductsPage(page);

    const product = createProductData('Search');

    await page.goto('/', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await dashboard.merchantDropdown.waitFor({ state: 'visible', timeout: 45000 });

    await dashboard.switchMerchant(env.merchantId);
    await dashboard.navigateToProducts(env.merchantId);

    await products.createProduct(product);

    await dashboard.navigateToProducts(env.merchantId);
    await products.searchInput.waitFor({ state: 'visible', timeout: 15000 });

    await products.searchProduct(product.name);
    // Wait for row to appear (search is async; list can take time to update)
    await products.getProductRow(product.name).waitFor({ state: 'visible', timeout: 40000 });

    await expect(products.getProductRow(product.name)).toBeVisible();
    await expect(products.getProductRow(product.name)).toHaveCount(1);

    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText(product.name);
  });
});
