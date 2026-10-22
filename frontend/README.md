# Food Ninja - Frontend Client

This is the frontend single-page application for Food Ninja, built with **React 18**, **Redux Toolkit**, and **Tailwind CSS**, bundled with **Parcel**.

---

## Features

- **Menu & Food Catalog:** Dynamic dish cards with dietary badges (Veg/Non-Veg), price, ratings, and instant "Add to Cart".
- **Search & Filters:** Real-time search across categories (Fast Food, North Indian, Biryani, Chinese, etc.) and pure-veg filters.
- **Cart & Wishlist:** Redux Toolkit slices (`cartSlice`, `wishlistSlice`) with automatic price recalculation and `localStorage` persistence.
- **Checkout & Tracking:** Form validation for address and payment method, order summary preview, and real-time status tracking.
- **Admin Dashboard:** Routes under `/admin` for restaurant owners to manage food items, customer orders, and inquiries.
- **Responsive Layout:** Clean mobile-first design using Tailwind CSS utility classes.

---

## Project Structure

```
frontend/
├── src/
│   ├── Component/           # UI components and pages
│   │   ├── admin/           # AdminOverview, AdminOrders, AdminFoods, AdminInquiries
│   │   ├── food/            # FoodCard component
│   │   ├── __tests__/       # Header, Cart, and Contact unit tests
│   │   ├── Header.js        # Global navigation header
│   │   ├── Footer.js        # Global footer
│   │   ├── FoodMenu.js      # Main restaurant menu view
│   │   ├── Cart.js          # Cart page
│   │   ├── Checkout.js      # Order checkout form
│   │   ├── Orders.js        # Customer orders list
│   │   └── OrderDetail.js   # Single order invoice & tracking
│   ├── mockData/            # JSON fixtures for Jest tests
│   ├── utils/               # Redux store, slices, and constants
│   │   ├── Store.js         # Configured Redux store
│   │   ├── cartSlice.js     # Cart state logic
│   │   ├── wishlistSlice.js # Wishlist state logic
│   │   └── Constants.js     # API endpoints and static assets
│   ├── App.css              # Global styles & Tailwind directives
│   └── App.js               # Router configuration & root layout
├── index.html               # Main HTML template
├── jest.config.js           # Jest configuration
└── package.json
```

---

## Available Scripts

In the frontend directory, you can run:

### `npm start`
Starts the Parcel development server on [http://localhost:1234](http://localhost:1234).  
Hot-reloading is enabled by default.

### `npm test`
Runs the Jest test suite using React Testing Library in band mode.

### `npm run build`
Compiles and bundles the application for production inside the `dist/` folder.

---

## Environment Variables

Create a `.env` file in the `frontend/` directory if you need to override the backend API URL:

```env
API_BASE_URL=http://localhost:5005/api
```
*(Defaults to `http://localhost:5005/api` in development).*
