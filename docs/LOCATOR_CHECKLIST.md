# Locator Checklist – Implemented from Codegen

**Status:** Locators applied in `DashboardPage.js` and `ProductsPage.js` from Codegen (data-test-id + getByRole).

---

## 1️⃣ Merchant dropdown ✅

- **Where:** Top bar? Avatar menu? Sidebar?
- **Trigger:** e.g. `[data-testid="merchant-dropdown"]` or `button:has-text("Select Merchant")`
- **Search inside dropdown?** Yes / No
- **Merchant display:** ID `19h577u3p4be` or name? How to select by ID?

**In code:** `getByRole('button', { name: 'qa.gokwik down' })`, search `getByRole('textbox')`, `getByRole('radio', { name: /merchantId/ })`, `getByRole('button', { name: 'Set Merchant' })`

---

## 2️⃣ Products navigation ✅

- **Strategy:** Direct URL ✅ (recommended) or via UI menu?
- **Direct URL:** `/gk-pages/store/{merchantId}/products`

**In code:** Direct URL in `DashboardPage.navigateToProducts(merchantId)`.

---

## 3️⃣ Products table ✅

- **Columns:** e.g. Name | Status | Variant | Vendor | Actions
- **Row locator:** e.g. `table tbody tr` or `[data-testid="product-row"]`
- **Delete:** Direct icon per row or row → menu (e.g. ⋮) → Delete?

**In code:** `page.locator('tr').filter({ hasText: name })` for row.

---

## 4️⃣ Create product form ✅

- **Mandatory fields:** e.g. Product Name, Category, …
- **Variants required?** Yes / No
- **Open create:** e.g. button "Add Product" / "Create Product"

**In code:** data-test-id: title_input, pricing_card_*, inventory_card_sku_input, create_product_submit_button.

---

## 5️⃣ Search ✅

- **Locator:** e.g. `input[placeholder="Search products"]` or `[data-testid="product-search"]`

**In code:** `[data-test-id="products_search_input"]`

---

## 6️⃣ Pagination

- **Present?** Yes / No
- **Pattern:** "1 2 3 … Next" or "Rows per page" dropdown?
- **Locators:** e.g. `[data-testid="next-page"]`, `button:has-text("Next")`

---

## 7️⃣ Delete confirmation modal

- **Title/body text:** e.g. "Are you sure?" / "Delete product?"
- **Confirm button:** "Delete" | "Confirm" | "Yes" (exact text for selector)

**In code (delete flow):** `[data-test-id="bulk_action_toolbar_more_actions_button"]`, `getByRole('menuitem', { name: 'delete Delete' })` – to be wired in Phase 6.

---

*Locators from Codegen are applied; update here if the app changes.*
