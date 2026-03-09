# CRM Admin – Products Module Automation

Playwright (JavaScript) automation framework for the CRM Admin Products module: login, merchant switch, and full product CRUD with search, pagination, and negative validation.

**→ [Technical overview (architecture, test design, CI/CD, stability)](docs/TECHNICAL_OVERVIEW.md)** — full review suitable for Senior SDET evaluation.

---

## Project structure (submission-ready)

```
crm-playwright-framework/
├── tests/
│   ├── auth.setup.js              # Login once, save session (storageState)
│   └── products/
│       ├── productCRUD.spec.js    # Create, Read, Update, Delete flow
│       ├── productSearch.spec.js  # Search/filter by product name
│       ├── productNegative.spec.js # Validation error (missing required field)
│       └── pagination.spec.js     # Pagination controls
├── pages/
│   ├── LoginPage.js               # Email, password, OTP
│   ├── DashboardPage.js           # Merchant switch, navigate to products
│   └── ProductsPage.js            # CRUD, search, delete, pagination
├── api/
│   └── productAPI.js              # (Optional) API validation layer
├── fixtures/
│   └── baseFixture.js             # Custom fixtures
├── utils/
│   ├── logger.js                  # Structured logging
│   ├── randomData.js              # Unique product names (parallel-safe)
│   └── helpers.js                 # Shared helpers
├── config/
│   └── env.js                     # BASE_URL, credentials, merchantId from .env
├── test-data/
│   └── productData.json           # Static test data
├── docs/
│   ├── ASSIGNMENT_CHECKLIST.md    # Requirements vs implementation
│   └── LOCATOR_CHECKLIST.md       # Locator reference
├── .github/
│   └── workflows/
│       └── playwright-tests.yml  # CI: run tests on push/PR
├── playwright.config.js           # Projects, retries, reporters, timeouts
├── .env                           # Secrets (gitignored)
├── .gitignore
└── package.json
```

---

## Prerequisites

- **Node.js** 18+
- **npm** or yarn

---

## Setup

```bash
git clone <repo>
cd crm-playwright-framework
npm install
npx playwright install
```

Copy environment variables (or create `.env` from `.env.example` if you add one):

```env
BASE_URL=https://qa-mdashboard.dev.gokwik.in
LOGIN_EMAIL=your@email.com
LOGIN_PASSWORD=yourpassword
LOGIN_OTP=123456
MERCHANT_ID=19h577u3p4be
HEADLESS=true
```

---

## Run tests

| Command | Description |
|--------|-------------|
| `npm test` | Full run (shared-context auth, 1 worker) |
| `npm run test:single` | Same as `npm test` (1 worker) |
| `npm run test:headed` | Same as above with browser visible |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Open last HTML report |

### Run by tag

| Command | Description |
|--------|-------------|
| `npx playwright test --grep @smoke` | Smoke tests only |
| `npx playwright test --grep @regression` | Regression tests only |
| `npx playwright test --grep @crud` | Full CRUD flow only |
| `npx playwright test --grep @search` | Search test only |

---

## Flow covered

1. **Login** (once per run via fixtures) → shared context for all tests
2. **Merchant switch** → select merchant, navigate to products
3. **Full CRUD** → Create product → Search → Open → Update → Delete → verify gone
4. **Search** (dedicated test) → Create product → Search by name → Assert row visible
5. **Pagination** → next page and controls visible
6. **Negative** → submit without title → assert “Title is required”

---

## Framework highlights

- **Page Object Model** architecture (Login, Dashboard, Products)
- **Session reuse** via shared context (one login per run; no repeated OTP)
- **Configurable workers** (1 by default for single-session auth)
- **Unique test data** via `utils/randomData.js` and **test data factory** (`utils/productFactory.js`)
- **API + UI validation** (e.g. `utils/apiHelper.js` for product create response)
- **CI execution** via GitHub Actions; **deterministic installs** using `npm ci`
- **Role-based and test-id based locators** (stable, maintainable)
- **Retry support for CI stability** (`retries` in CI only)
- **Test tags** `@smoke`, `@regression`, `@crud`, `@search` for filtered runs

---

## Evaluation alignment

- ✅ Login (email, password, OTP), dashboard wait
- ✅ Product CRUD (Create, Read, Update, Delete)
- ✅ Search and pagination
- ✅ Negative validation (missing required field)
- ✅ POM, utilities, env config, folder structure
- ✅ Assertions, no hard waits, stable locators (data-test-id / role)
- ✅ **CI/CD** – GitHub Actions runs tests on push/PR

---

## CI/CD (GitHub Actions)

Tests run automatically on **push** and **pull_request** to `main` or `master`.

**Pipeline steps:** Checkout → Node 18 → `npm ci` → `npx playwright install --with-deps` → `npx playwright test --workers=1` → Upload **playwright-report** artifact.

**Secrets (repo Settings → Secrets and variables → Actions):**  
Add `LOGIN_EMAIL`, `LOGIN_PASSWORD`, `LOGIN_OTP`, `MERCHANT_ID`, `BASE_URL`. The workflow uses these so credentials are never in code. After a run, download the **playwright-report** artifact to view the HTML report.
