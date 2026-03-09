/**
 * Page Object: Products module – CRUD, search, pagination (data-test-id from Codegen).
 */

class ProductsPage {
  constructor(page) {
    this.page = page;

    this.addProductButton = page.locator('[data-test-id="products_add_button"]');
    this.generateAllButton = page.locator('[data-test-id="create_product_generate_all_button"]');
    this.titleInput = page.locator('[data-test-id="title_input"]');
    this.descriptionEditor = page.locator('.ql-editor').first();
    this.priceInput = page.locator('[data-test-id="pricing_card_price_input"]');
    this.comparePriceInput = page.locator('[data-test-id="pricing_card_compare_price_input"]');
    this.costInput = page.locator('[data-test-id="pricing_card_cost_input"]');
    this.skuInput = page.locator('[data-test-id="inventory_card_sku_input"]');
    this.submitButton = page.locator('[data-test-id="create_product_submit_button"]');
    this.saveButton = page.locator('[data-test-id="product_form_save_button"]');
    this.searchInput = page.locator('[data-test-id="products_search_input"]');
    this.moreActions = page.locator('[data-test-id="bulk_action_toolbar_more_actions_button"]');
    this.deleteOption = page.locator('[data-test-id="product_details_delete_action"], [data-testid="product_details_delete_action"]').or(page.getByRole('menuitem', { name: 'delete Delete' })).first();
    this.confirmDeleteButton = page.getByRole('button', { name: /delete|confirm|yes/i }).last();
    this.nextPageButton = page.locator('[data-test-id="generic_table_next_page_button"]');
  }

  async createProduct(product) {
    await this.addProductButton.click();
    await this.titleInput.fill(product.name);
    await this.descriptionEditor.fill(product.description || '');
    await this.priceInput.fill(product.price);
    await this.comparePriceInput.fill(product.comparePrice || '');
    await this.costInput.fill(product.cost || '');
    await this.skuInput.fill(product.sku || '');
    await this.submitButton.click();
  }

  async searchProduct(name) {
    await this.searchInput.fill(name);
    await this.searchInput.press('Enter');
  }

  getProductRow(name) {
    return this.page.locator('tr').filter({ hasText: name });
  }

  async openProduct(name) {
    await this.page.getByText(name).click();
  }

  async updateProduct(updates) {
    await this.titleInput.waitFor({ state: 'visible', timeout: 25000 });
    if (updates.name != null) await this.titleInput.fill(updates.name);
    if (updates.description != null) await this.descriptionEditor.fill(updates.description);
    await this.saveButton.click();
    // Wait for save to finish and page to stabilize (avoids dropdown detaching when we delete)
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.moreActions.waitFor({ state: 'visible', timeout: 20000 });
  }

  async deleteProduct() {
    await this.moreActions.click();
    // Menu item can detach if the overlay re-renders; use role-based locator and force to reduce flakiness
    const deleteMenuItem = this.page.getByRole('menuitem', { name: /delete/i }).first();
    await deleteMenuItem.waitFor({ state: 'visible', timeout: 15000 });
    await deleteMenuItem.click({ timeout: 15000, force: true });
    // If confirmation modal appears, confirm
    await this.confirmDeleteButton.click({ timeout: 5000 }).catch(() => {});
  }

  async goToNextPage() {
    await this.nextPageButton.click();
  }

  async createProductWithoutTitle() {
    await this.addProductButton.click();
    await this.submitButton.click();
  }
}

module.exports = ProductsPage;
