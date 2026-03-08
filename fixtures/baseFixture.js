/**
 * Custom Playwright fixtures: auth reuse, page object injection.
 * Implementation in Phase 4 (auth) and when building POM.
 */

const { test: base } = require('@playwright/test');

const test = base.extend({
  // Extended fixtures (e.g. authenticated page, page objects) in later phases
});

module.exports = { test };
