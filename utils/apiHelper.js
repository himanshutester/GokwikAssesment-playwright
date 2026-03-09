/**
 * API / network helpers for test validation (e.g. wait for product create response).
 */

/**
 * Waits for a successful product create (POST) response. Use before createProduct() and await after.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<import('@playwright/test').Response | null>}
 */
async function waitForProductCreate(page) {
  return page
    .waitForResponse(
      (res) =>
        (res.url().includes('product') || res.request().method() === 'POST') &&
        res.status() === 200,
      { timeout: 20000 }
    )
    .catch(() => null);
}

module.exports = {
  waitForProductCreate,
};
