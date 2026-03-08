/**
 * Page Object: Dashboard – merchant switching, navigation to Products.
 * Uses radio option (stable) instead of text span for merchant selection.
 */

class DashboardPage {
  constructor(page) {
    this.page = page;

    this.merchantDropdown = page.getByRole('button', { name: 'qa.gokwik down' });
    this.merchantSearch = page.getByRole('textbox');
    this.setMerchantButton = page.getByRole('button', { name: 'Set Merchant' });
  }

  /** Radio option for merchant (contains merchantId in name). */
  getMerchantOption(merchantId) {
    return this.page.getByRole('radio', { name: new RegExp(merchantId, 'i') });
  }

  async switchMerchant(merchantId) {
    await this.merchantDropdown.click();
    await this.merchantSearch.fill(merchantId);
    await this.getMerchantOption(merchantId).check();
    await this.setMerchantButton.click();
  }

  async navigateToProducts(merchantId) {
    await this.page.goto(`/gk-pages/store/${merchantId}/products`);
  }
}

module.exports = DashboardPage;
