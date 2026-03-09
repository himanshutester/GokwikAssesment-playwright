/**
 * Product CRUD: Create, Read (search + open), Update, Delete.
 * Uses shared context from fixtures (one login per run, session stays alive).
 */

const { test, expect } = require('../../fixtures');
const DashboardPage = require('../../pages/DashboardPage');
const ProductsPage = require('../../pages/ProductsPage');
const env = require('../../config/env');
const { createProductData } = require('../../utils/productFactory');
const { waitForProductCreate } = require('../../utils/apiHelper');

test.describe('Product CRUD @smoke', () => {
  test('@smoke verify dashboard loads with saved session', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: 'qa.gokwik down' })).toBeVisible({ timeout: 60000 });
  });

  test('Complete Product CRUD Flow @crud', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const products = new ProductsPage(page);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await dashboard.merchantDropdown.waitFor({ state: 'visible', timeout: 60000 });

    await dashboard.switchMerchant(env.merchantId);
    await dashboard.navigateToProducts(env.merchantId);

    const product = createProductData('Automation');

    const createResponsePromise = waitForProductCreate(page);
    await products.createProduct(product);
    const createResponse = await createResponsePromise;
    if (createResponse) expect(createResponse.ok()).toBeTruthy();

    await dashboard.navigateToProducts(env.merchantId);
    await products.searchInput.waitFor({ state: 'visible', timeout: 20000 });
    await products.searchProduct(product.name);
    await page.waitForLoadState('networkidle').catch(() => {});

    await expect(products.getProductRow(product.name)).toBeVisible({ timeout: 25000 });

    await products.openProduct(product.name);

    const updatedName = `${product.name}_updated`;
    await products.updateProduct({ name: updatedName });

    await products.moreActions.waitFor({ state: 'visible', timeout: 20000 });
    await products.deleteProduct();

    await dashboard.navigateToProducts(env.merchantId);
    await products.searchInput.waitFor({ state: 'visible', timeout: 20000 });
    await products.searchProduct(updatedName);
    await page.waitForLoadState('networkidle').catch(() => {});

    await expect(products.getProductRow(updatedName)).toHaveCount(0);
  });
});
