# Technical Overview — CRM Admin Products Automation

A Senior QA Automation Architect–style review of the Playwright framework: architecture, test design, coverage, test data, API validation, CI/CD, stability, and how to run it.

---

## 1. Architecture

### Project structure

```
crm-playwright-framework/
├── tests/
│   ├── auth.setup.js              # Standalone login + save storageState (optional)
│   └── products/
│       ├── productCRUD.spec.js    # Full CRUD + dashboard smoke
│       ├── productSearch.spec.js  # Search/filter by name
│       ├── productNegative.spec.js # Validation (missing required field)
│       └── pagination.spec.js      # Pagination controls
├── pages/
│   ├── LoginPage.js               # Email, password, OTP flow
│   ├── DashboardPage.js           # Merchant switch, navigate to products
│   └── ProductsPage.js            # CRUD, search, delete, pagination
├── utils/
│   ├── randomData.js              # getUniqueProductName()
│   ├── productFactory.js          # createProductData(prefix)
│   ├── apiHelper.js               # waitForProductCreate(page)
│   └── authHelper.js              # ensureLoggedIn(page) — optional re-login
├── config/
│   └── env.js                     # baseURL, credentials, merchantId from .env
├── docs/                          # Checklists, structure, verification
├── fixtures.js                    # Shared context + custom page fixture
├── playwright.config.js
├── .env                           # Secrets (gitignored)
└── .github/workflows/
    └── playwright-tests.yml       # CI pipeline
```

- **tests/** — Specs only; no page logic. Product specs live under `tests/products/`.
- **pages/** — Page Object classes: one file per screen/flow (Login, Dashboard, Products).
- **utils/** — Shared helpers: unique data, product factory, API wait helpers.
- **config/** — Central env loading via `dotenv`; no credentials in code.
- **fixtures.js** — Custom Playwright fixtures (shared context, login once per worker).
- **docs/** — Project structure, assignment checklist, reviewer verification.

### Page Object Model (POM)

- **One class per logical screen/flow**, each taking a `page` in the constructor.
- **Locators** are defined as class properties; **actions** as async methods.
- **LoginPage** — `navigate(baseURL)`, `login(email, password, otp)`; locators: email, password, OTP, Next.
- **DashboardPage** — `switchMerchant(merchantId)`, `navigateToProducts(merchantId)`; locators: merchant dropdown, search, Set Merchant, dynamic `getMerchantOption(merchantId)`.
- **ProductsPage** — `createProduct(product)`, `searchProduct(name)`, `getProductRow(name)`, `openProduct(name)`, `updateProduct(updates)`, `deleteProduct()`, `goToNextPage()`, `createProductWithoutTitle()`; locators use `data-test-id` and roles where possible.

Tests instantiate page objects with the current `page` (from fixtures) and call methods; they do not hold locators or low-level waits.

---

## 2. Test framework design

### Playwright configuration

- **Config file:** `playwright.config.js` (root).
- **testDir:** `./tests`.
- **timeout:** 120 000 ms per test; **expect.timeout:** 15 000 ms.
- **retries:** `process.env.CI ? 2 : 0` — retries only in CI to absorb flakiness without slowing local runs.
- **workers:** 1 — single worker so one browser context is shared and login (OTP) runs once per run.
- **fullyParallel:** false — consistent with one worker.
- **baseURL:** From `process.env.BASE_URL` (`.env`).
- **headless:** From `process.env.HEADLESS` (default true in CI).
- **Reporter:** list (console) + HTML (`open: 'never'`).
- **use:** screenshot only on failure, video and trace retained on failure; actionTimeout 15 000 ms, navigationTimeout 60 000 ms.

### Parallel execution strategy

- **Single worker** is used so that:
  - One browser context is created per run.
  - Login (email → password → OTP) runs once in the fixture.
  - All tests reuse the same context; no session invalidation between tests.
- To scale to more workers later, the app would need to support multiple sessions or reusable OTP.

### Session reuse (no storageState in main run)

- The main run **does not** use `storageState.json`.
- **Custom fixtures** (`fixtures.js`):
  - **sharedContext** (worker-scoped): creates a context, opens a page, runs full login via `LoginPage`, waits for dashboard, closes that page, then passes the context to tests.
  - **page** (test-scoped): each test gets a new **page** from the same **sharedContext**, so cookies/session are reused and the user stays logged in.
- **auth.setup.js** is present for optional use (e.g. generating `storageState.json` for other workflows) but is **excluded** from the default run via `testIgnore: /.*\.setup\.js/`.

---

## 3. Test coverage

| Spec file | Purpose |
|-----------|--------|
| **auth.setup.js** | Standalone auth flow: navigate to base URL, login (email, password, OTP), wait for dashboard, save `storageState.json`. Not run in the default suite; useful for generating a saved session. |
| **productCRUD.spec.js** | **Smoke + CRUD:** (1) Dashboard loads with session (goto `/`, assert merchant dropdown visible). (2) Full CRUD: switch merchant → products → create product (with API check) → list → search → open → update name → delete → search again and assert product is gone (`toHaveCount(0)`). |
| **productSearch.spec.js** | **Search:** Create a product, go to list, search by name, assert exactly one row visible, table has one row, and that row contains the product name. |
| **pagination.spec.js** | **Pagination:** `beforeEach` goes to dashboard, switches merchant, navigates to products; test asserts “Show per page” and next-page button, clicks next page, asserts next button still visible. |
| **productNegative.spec.js** | **Validation:** `beforeEach` same as pagination; test submits create form without title and asserts “Title is required” on the title field (scoped to `[data-test-id="title_input_form_item"]` to avoid strict-mode issues). |

Tags: `@smoke`, `@regression`, `@crud`, `@search` — used for filtered runs (e.g. `--grep @crud`).

---

## 4. Test data strategy

### getUniqueProductName(prefix)

- **File:** `utils/randomData.js`.
- **Purpose:** Generates a unique product name to avoid collisions and ordering issues.
- **Implementation:** `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`.
- **Usage:** Direct use when only a name is needed; also used inside the product factory.

### productFactory.js — createProductData(prefix)

- **File:** `utils/productFactory.js`.
- **Purpose:** Single place for full product payload; ensures unique name and SKU.
- **Implementation:** Calls `getUniqueProductName(prefix)` for `name`, uses `Date.now()` for `sku`; returns `{ name, description, price, comparePrice, cost, sku }` with sensible defaults.
- **Usage:** `const product = createProductData('Automation')` or `createProductData('Search')` in CRUD and search specs so tests stay DRY and data is consistent and parallel-safe.

---

## 5. API validation

- **File:** `utils/apiHelper.js`.
- **Function:** `waitForProductCreate(page)`.
- **Behavior:** Returns a promise that resolves when a response matches: URL contains `"product"` or method is `POST`, and status is 200 (timeout 20 s). Resolves to `null` on timeout so tests can continue.
- **Usage in productCRUD.spec.js:** Before `createProduct(product)`, the test calls `const createResponsePromise = waitForProductCreate(page)`, then performs `createProduct(product)`, then `await createResponsePromise` and, if non-null, `expect(createResponse.ok()).toBeTruthy()`. This adds optional API-level validation without blocking the UI flow.

---

## 6. CI/CD pipeline

- **File:** `.github/workflows/playwright-tests.yml`.
- **Triggers:** Push and pull_request to `main` and `master`.
- **Env:** `CI: true` at job level so Playwright config uses 2 retries in CI.

**Steps:**

1. **Checkout** — `actions/checkout@v4`.
2. **Node 18** — `actions/setup-node@v4`, `node-version: 18`, `cache: 'npm'` for faster installs.
3. **Install dependencies** — `npm ci` (lockfile-based, reproducible).
4. **Cache Playwright browsers** — `actions/cache@v4` for `~/.cache/ms-playwright` (key from `package-lock.json` hash) to speed up subsequent runs.
5. **Install Playwright browsers** — `npx playwright install --with-deps`.
6. **Run tests** — `npx playwright test --workers=1` with env from GitHub Secrets: `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `LOGIN_OTP`, `MERCHANT_ID`, `BASE_URL`, `HEADLESS=true`.
7. **Upload report** — `actions/upload-artifact@v4`, artifact name `playwright-report`, path `playwright-report`, `if: always()` so the HTML report is kept even when tests fail.
8. **Job summary** — Writes to `GITHUB_STEP_SUMMARY` so the run page shows a note to download the **playwright-report** artifact.

Secrets are configured in the repo (Settings → Secrets and variables → Actions); the workflow does not log credentials.

---

## 7. Stability features

- **CI retries:** `retries: process.env.CI ? 2 : 0` — 2 retries in CI only; 0 locally for fast feedback.
- **Trace on failure:** `trace: 'retain-on-failure'` in config for post-failure debugging.
- **Screenshot / video:** `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`.
- **Explicit waits:** No fixed `setTimeout`. Tests use:
  - `waitFor({ state: 'visible', timeout: ... })` for critical elements (e.g. dashboard, search input, more-actions).
  - `waitForLoadState('networkidle')` or `domcontentloaded` where needed.
  - Assertion timeouts (e.g. 25 s for row visibility, 60 s for dashboard).
- **Locator strategy:**
  - Prefer **role + name:** `getByRole('button', { name: '...' })`, `getByRole('menuitem', { name: /delete/i })`, `getByRole('radio', { name: RegExp })`.
  - Prefer **data-test-id** where available: `[data-test-id="products_add_button"]`, `[data-test-id="title_input"]`, etc.
  - Fallback for delete menu: `data-test-id` or `data-testid` plus role-based menuitem; click uses `force: true` to reduce flakiness when the dropdown re-renders.
- **Post-save stability:** After update, the flow waits for `networkidle` and for the more-actions button so the delete menu is not clicked during re-render.

---

## 8. How to run the project

### Prerequisites

- Node.js 18+
- npm (or yarn)

### Install dependencies

```bash
git clone <repo-url>
cd crm-playwright-framework
npm install
npx playwright install
```

Create a `.env` in the project root (see `.env.example` if present) with:

- `BASE_URL`
- `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `LOGIN_OTP`
- `MERCHANT_ID`
- `HEADLESS` (e.g. `true` for CI, `false` for local debugging)

### Run tests locally

```bash
# Full suite (1 worker, shared context)
npm test

# Same with browser visible
npm run test:headed

# UI mode
npm run test:ui

# Debug (step-through)
npm run test:debug
```

### Run tagged tests

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @crud
npx playwright test --grep @search
```

Or use the npm scripts: `npm run test:smoke`, `npm run test:regression`.

### View HTML report

After a run:

```bash
npx playwright show-report
```

Or use the script: `npm run report`. In CI, download the **playwright-report** artifact from the workflow run and open `index.html` in a browser.

### Optional: generate storageState (auth.setup.js)

To run only the auth setup (e.g. to produce `storageState.json`):

```bash
npx playwright test tests/auth.setup.js --headed
```

Note: the default suite does not depend on this; it uses the shared-context fixture instead.

---

## 9. How this demonstrates Senior SDET practices

- **Architecture:** Clear separation of tests, page objects, utils, and config; single responsibility and no business logic in specs.
- **POM:** Page objects encapsulate locators and actions; tests read as user flows and stay stable when the UI changes.
- **Session reuse:** One login per run via a worker-scoped context and a custom `page` fixture, avoiding repeated OTP and session expiry issues.
- **Test data:** Unique names and SKUs via `randomData.js` and a dedicated `productFactory.js` for consistent, parallel-safe data.
- **API + UI:** Optional network checks (`apiHelper.js`) for create flow without coupling tests to implementation details.
- **CI awareness:** Retries only in CI, deterministic installs with `npm ci`, and HTML report artifact for every run.
- **Stability:** No sleep-based waits; explicit waits and assertion timeouts; role and test-id locators; trace/screenshot/video on failure; careful handling of dropdowns (e.g. force click, post-save waits).
- **Maintainability:** Env-based config, tags for filtering, and docs (structure, checklist, reviewer verification) make the suite easy to extend and review.
- **Deliverables:** Full CRUD with create verification, dedicated search and pagination tests, negative validation, and a single CI workflow that runs the suite and publishes the report.

---

*This document is the technical overview of the framework as of the last review. For setup and quick reference, see the main [README](../README.md).*
