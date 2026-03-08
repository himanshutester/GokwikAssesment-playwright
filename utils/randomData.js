/**
 * Dynamic test data generation to avoid collisions in parallel runs.
 */

function getUniqueProductName(prefix = 'Automation_Product') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

module.exports = {
  getUniqueProductName,
};
