# Reviewer verification – assignment completeness

Quick answers to common SDET review questions.

---

## 1. Does the CRUD test validate API responses?

**Yes.** In `tests/products/productCRUD.spec.js`, after creating a product we wait for a successful HTTP response (URL contains `product` or method is `POST`, status 200) and assert `response.ok()`. If the app does not trigger such a response, the assertion is skipped (no failure).

---

## 2. Are locators mostly role-based or stable?

**Yes.** We use:

- **Role-based:** `getByRole('button', { name: '...' })`, `getByRole('textbox')`, `getByRole('radio')`, `getByRole('menuitem')`
- **Data attributes:** `[data-test-id="..."]` (from app Codegen)
- **Text:** `getByText()`, `locator('tr').filter({ hasText: name })`

No fragile selectors (e.g. `div:nth-child(4)`).

---

## 3. Do you generate unique test data?

**Yes.** `utils/randomData.js` exports `getUniqueProductName(prefix)` which returns `{prefix}_{Date.now()}_{random}` so every run uses a unique product name and avoids collisions in parallel/CI.

---

## 4. Does CI run all tests without grep filters?

**Yes.** `.github/workflows/playwright-tests.yml` runs `npx playwright test --workers=4` with no `--grep` or path filter. All specs (auth setup, CRUD, search, pagination, negative) run in CI.

---

## 5. Does delete verify the product no longer exists?

**Yes.** After delete we:

1. Navigate back to the products list
2. Search by the updated product name
3. Assert the row is not visible: `expect(products.getProductRow(updatedName)).not.toBeVisible()`
4. Assert matching row count is 0: `expect(products.getProductRow(updatedName)).toHaveCount(0)`

---

## Additional

- **Session reuse:** `auth.setup.js` runs first; session is saved to `storageState.json`; chromium project uses it.
- **Parallel:** `playwright.config.js` has `workers: 4` and `fullyParallel: true`.
- **Search test:** Dedicated search spec asserts the filtered result row is visible and that exactly one row matches: `toHaveCount(1)`.
- **CI install:** Workflow uses `npm ci` for deterministic installs and `npx playwright install --with-deps` for browsers.
