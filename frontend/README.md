# Food Ninja Frontend

React 18 storefront and admin dashboard, built with React Router v6, Redux Toolkit, Tailwind CSS v4, and Parcel.

## Main Features

- **Storefront & Menu:** Browse and search 120+ authentic dishes across 24 categories with dietary markers (`Veg`, `Non-Veg`, `Vegan`) and smart truncated pagination.
- **Portion Selection & Nutrition:** Full, Half, and Quarter plate pricing, nutrition information (calories, protein, carbs, fat), ingredients, and delivery estimates.
- **Cart & Persistence:** Redux Toolkit cart with `localStorage` persistence, portion pricing math, and delivery fee calculation.
- **Verified Reviews:** Verified buyer review submission unlocked only after order delivery.
- **Store Hours & Notices:** Real-time operating hours schedule (IST) and manual pause banners displayed across storefront headers, cart, and checkout.
- **Admin Dashboard (`/admin`):**
  - **Dishes Inventory (`/admin/dishes`):** Real-time stock toggle, category chips, search, and delete/edit navigation.
  - **Dish Form Page (`/admin/foods/new` & `/admin/foods/edit/:id`):** Dedicated dish editor with portion pricing, live visual card preview, image fit (`contain`/`cover`), and custom cuisine addition.
  - **Categories Manager (`/admin/categories`):** Reorder categories, manage homepage showcase badges, and card color presets.
  - **Orders Fulfillment (`/admin/orders`):** Date & status filters, order details, and unified **80mm POS Thermal Receipt / KOT printing** via `OrderInvoiceModal`.
  - **Inquiries Desk (`/admin/inquiries`):** Separate tabs for urgent live order tickets and general customer inquiries with one-click Gmail and phone calling actions.
  - **Store Settings (`/admin/settings`):** Store pause state, custom closed announcement banners, morning/evening kitchen operating hours, and fees.

## Production Hardening & Reliability

- **Search Safety:** Regular expression characters (`(`, `[`, `*`, `+`) are escaped before query execution, preventing crashes.
- **Admin Session Security:** Multi-storage token purge on logout prevents unauthorized re-entry.
- **Dynamic Admin Authentication:** Authenticates against `POST /api/users/login` with offline fallback.
- **Clean Checkout Flow:** Hardcoded dummy data removed; clean input fields with automatic address capture for new buyers.

## Source Layout

```text
frontend/
├── src/
│   ├── Component/             # UI views, route pages, and customer dialogs
│   │   ├── admin/             # Admin management suite
│   │   │   ├── AdminDishesPage.js     # Live menu inventory & stock manager
│   │   │   ├── AdminDishFormPage.js   # Dish editor & formulation page
│   │   │   ├── AdminCategoriesPage.js # Menu & showcase category manager
│   │   │   ├── AdminOrdersPage.js     # Live orders fulfillment dashboard
│   │   │   ├── AdminSettingsPage.js   # Store hours, notice & fees manager
│   │   │   ├── AdminInquiriesPage.js  # Customer tickets & inquiry resolution desk
│   │   │   ├── OrderInvoiceModal.js   # 80mm thermal receipt & KOT print modal
│   │   │   └── AdminDropdown.js       # Reusable searchable dropdown with add-option
│   │   ├── DishCard.js        # Reusable dish presentation card component
│   │   └── __tests__/         # Jest & React Testing Library test suite
│   ├── utils/                 # Redux state, API constants, and store notice helpers
│   ├── App.js                 # Routes and application layout
│   └── App.css                # Global styles and Tailwind imports
├── index.html                 # Parcel HTML entry point
├── jest.config.js             # Jest unit test configuration
└── package.json
```

## Run Locally

Install dependencies and start Parcel development server:

```bash
cd frontend
npm install
npm start
```

Parcel serves the storefront at [http://localhost:1234](http://localhost:1234). Make sure the backend API is also running on [http://localhost:5005](http://localhost:5005).

To configure a custom backend API URL, set `REACT_APP_API_URL` or `API_URL` in `frontend/.env`:

```env
API_URL=http://localhost:5005/api
```

## Available Scripts

| Command | Purpose |
|---|---|
| `npm start` | Start Parcel development server at `http://localhost:1234` |
| `npm test` | Run frontend Jest unit & integration test suite |
| `npm run build` | Create production-ready bundle in `dist/` |
