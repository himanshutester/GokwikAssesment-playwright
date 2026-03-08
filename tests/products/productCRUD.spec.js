/**
 * Product CRUD: Create, Read (search + open), Update, Delete.
 * Uses session from auth setup; credentials from env.
 */

const { test, expect } = require('@playwright/test');
const DashboardPage = require('../../pages/DashboardPage');
const ProductsPage = require('../../pages/ProductsPage');
const env = require('../../config/env');
const { getUniqueProductName } = require('../../utils/randomData');

test.describe('Product CRUD @smoke', () => {
  test('@smoke verify dashboard loads with saved session', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('@smoke @regression Complete Product CRUD Flow', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const products = new ProductsPage(page);

    await page.goto('/');
    await dashboard.merchantDropdown.waitFor({ state: 'visible' });

    await dashboard.switchMerchant(env.merchantId);
    await dashboard.navigateToProducts(env.merchantId);

    const productName = getUniqueProductName('Automation');
    const product = {
      name: productName,
      description: 'Automation description',
      price: '100',
      comparePrice: '120',
      cost: '50',
      sku: `SKU-${Date.now()}`
    };

    await products.createProduct(product);

    await dashboard.navigateToProducts(env.merchantId);
    await products.searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await products.searchProduct(product.name);

    await expect(products.getProductRow(product.name)).toBeVisible();

    await products.openProduct(product.name);

    const updatedName = `${productName}_updated`;
    await products.updateProduct({ name: updatedName });

    // Wait for detail page to settle after save (navigation/reload) so delete menu is stable
    await products.moreActions.waitFor({ state: 'visible', timeout: 20000 });

    await products.deleteProduct();

    await dashboard.navigateToProducts(env.merchantId);
    await products.searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await products.searchProduct(updatedName);

    await expect(products.getProductRow(updatedName)).not.toBeVisible();
  });
});
