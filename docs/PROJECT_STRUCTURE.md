# Submission-ready project structure

This is the folder layout reviewers see when they open the repo. Each part has a single responsibility.

---

## Tree (source only; excludes `node_modules`, reports, `.env`)

```
crm-playwright-framework/
│
├── tests/                          # Test specs only
│   ├── auth.setup.js               # Runs first: login, save storageState
│   └── products/
│       ├── productCRUD.spec.js     # Full CRUD + dashboard check
│       ├── productNegative.spec.js # Create without title → validation
│       └── pagination.spec.js      # Next page + controls
│
├── pages/                          # Page Object Model
│   ├── LoginPage.js                # Email, password, OTP, login()
│   ├── DashboardPage.js           # Merchant dropdown, switch, navigateToProducts
│   └── ProductsPage.js            # Create, search, open, update, delete, pagination
│
├── api/                            # API layer (optional / bonus)
│   └── productAPI.js
│
├── fixtures/                       # Playwright fixtures
│   └── baseFixture.js
│
├── utils/                          # Reusable utilities
│   ├── logger.js
│   ├── randomData.js               # getUniqueProductName()
│   └── helpers.js
│
├── config/                         # Configuration
│   └── env.js                      # Loads .env, exports baseURL, login, merchantId
│
├── test-data/                      # Static test data
│   └── productData.json
│
├── docs/                           # Documentation
│   ├── ASSIGNMENT_CHECKLIST.md
│   ├── LOCATOR_CHECKLIST.md
│   └── PROJECT_STRUCTURE.md       # This file
│
├── .github/
│   └── workflows/
│       └── playwright-tests.yml  # CI: Playwright on push/PR
│
├── playwright.config.js            # Projects, retries, reporters, timeouts
├── package.json
├── .env                            # Not committed; credentials + BASE_URL
└── .gitignore
```

---

## What reviewers look for

| Expectation        | Location / how it’s done                    |
|--------------------|---------------------------------------------|
| POM                | `pages/` – one file per screen/flow        |
| No credentials in code | `config/env.js` + `.env`              |
| Clear test names   | `productCRUD.spec.js`, `productNegative`, etc. |
| Reusable logic     | `utils/`, `pages/` methods                  |
| Session reuse      | `auth.setup.js` → `storageState.json`      |
| Parallel-safe data | `utils/randomData.js`                      |
| Tags               | `@smoke`, `@regression` in describe/test titles |

This structure is intended to match what a Senior SDET submission looks like.
