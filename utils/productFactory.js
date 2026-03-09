/**
 * Test data factory for products. Generates unique names/skus for parallel-safe tests.
 */

const { getUniqueProductName } = require('./randomData');

/**
 * @param {string} [prefix='Automation']
 * @returns {{ name: string, description: string, price: string, comparePrice: string, cost: string, sku: string }}
 */
function createProductData(prefix = 'Automation') {
  const name = getUniqueProductName(prefix);
  const timestamp = Date.now();
  return {
    name,
    description: `${prefix} product description`,
    price: '100',
    comparePrice: '120',
    cost: '50',
    sku: `SKU-${timestamp}`,
  };
}

module.exports = {
  createProductData,
};
