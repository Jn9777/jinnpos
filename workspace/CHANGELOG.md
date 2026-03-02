<instructions>
## 🚨 MANDATORY: CHANGELOG TRACKING 🚨

You MUST maintain this file to track your work across messages. This is NON-NEGOTIABLE.

---

## INSTRUCTIONS

- **MAX 5 lines** per entry - be concise but informative
- **Include file paths** of key files modified or discovered
- **Note patterns/conventions** found in the codebase
- **Sort entries by date** in DESCENDING order (most recent first)
- If this file gets corrupted, messy, or unsorted -> re-create it. 
- CRITICAL: Updating this file at the END of EVERY response is MANDATORY.
- CRITICAL: Keep this file under 300 lines. You are allowed to summarize, change the format, delete entries, etc., in order to keep it under the limit.

</instructions>

<changelog>
<!-- NEXT_ENTRY_HERE -->

### 2026-03-02 (session 4)
- Made 调价 button in `CartItemCard.tsx` more prominent: primary blue color, larger (h-10, text-sm, bold), blue glow shadow.

### 2026-03-02 (session 3)
- Unified `DiscountModal.tsx` into a 3-tab "Price Adjust" modal: 减价 (presets + custom), 换价格 (new RM/kg), 手动金额 (manual total override).
- Added `manualTotal?: number` to `CartItem` type; added `setItemPrice` + `setManualTotal` to `AppContext`.
- `CartItemCard.tsx` simplified: single "调价" button replaces Discount + More + Change Price; colored border indicates state (green=manual, orange=discount).
- Added 8 new i18n keys across EN/中文/BM in `utils/i18n.ts`.

### 2026-03-02 (session 2)
- Added dark mode toggle (Moon/Sun) in `HeaderBar.tsx`; `AppContext.tsx` manages `isDarkMode` + applies `dark` class to `<html>`.
- Added `ProductCategory` type to `types/index.ts`; expanded `data/products.ts` to 21 products across 4 categories (fruits, vegetables, herbs, meat).
- Rewrote `ProductGrid.tsx` with search bar + horizontal category filter tabs + empty state.
- Added `dark:` Tailwind classes to all components: cards, modals, keypad, footer, weight display.
- Updated `index.css` with dark scrollbar styles and `.scrollbar-hide` utility.

### 2026-03-02
- Fixed build error in `src/index.css`: removed stray `</style>` tag at line 68 causing "Unknown word" PostCSS parse error.
</changelog>
