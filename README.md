# Food Ninja - Full Stack Food Delivery Web App

Food Ninja is a high-performance, production-ready full-stack food ordering platform built using the MERN stack (MongoDB, Express, React 18, Node.js). It delivers an authentic, chef-crafted restaurant experience with real-time cart persistence, verified buyer dish reviews, kitchen operating hours scheduling, and an enterprise admin suite with POS 80mm thermal receipt printing.

---

## Live Demo & Links

- **Frontend:** [food-ninja.vercel.app](https://portfolio-zeta-drab-97.vercel.app/)
- **Backend API:** [food-ninja-api.onrender.com](https://food-ninja-backend.onrender.com)
- **Author:** Mohd Zaid ([GitHub](https://github.com/zaid154) | [LinkedIn](https://www.linkedin.com/in/mohd-zaid-794090231/))

---

## Features

### Customer Experience
- **Extensive Authentic Catalog (128 Dishes):** Explore 128 authentic dishes across 11 culinary categories (Biryani, Pizza, Burgers, Chinese, Indian, Rolls, Momos, Desserts, Beverages, Snacks, Healthy) with verified photos, live search, and dietary badges (`Veg`, `Non-Veg`, `Vegan`).
- **Smart Truncated Pagination:** Clean, responsive pagination with ellipsis (`•••`) and smooth navigation arrows across 10+ pages (12 dishes per page).
- **Dish Details & Portion Pricing:** Real-time portion selector (Full, Half, Quarter plates) with automatic price calculations, calories, macro nutrients (protein, carbs, fat), ingredients, delivery estimates, and strikethrough MRP discounts.
- **Verified Buyer Reviews & Badges:** Verified customer reviews unlocked strictly after order delivery, backed by server-side delivery validation.
- **Cart & Wishlist:** Redux Toolkit-backed cart with quantity modifiers, subtotal calculations, and `localStorage` persistence across page reloads.
- **Store Hours & Operating Schedule:** Real-time banner notices in header, cart, and checkout reflecting live kitchen operating hours (IST daytime or overnight ranges) or custom emergency pause notices. Server automatically rejects orders outside operational windows.
- **Order Placement & Tracking:** Seamless checkout with address verification and payment modes (Online Razorpay / Card / UPI / COD). Dedicated order tracking page (`/orders/:id`) with live visual progress (`Placed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`).
- **Order Support & Ticket Desk:** Dedicated in-app order issue reporting linking customer tickets directly to the kitchen desk.

### Admin Operations (`/admin`)
- **Dishes Inventory (`/admin/dishes`):** Real-time stock toggle (In Stock / Sold Out), category filter chips, search query, dietary badges, and instant edit/delete controls.
- **Dedicated Dish Editor Page (`/admin/foods/new` & `/admin/foods/edit/:id`):** Full-screen recipe formulation workspace with live card preview, portion pricing (Full, Half, Quarter), image fit modes (`cover` / `contain`), custom cuisine creation, and nutrition macros.
- **Order Management & Fulfillment:** Real-time order lookup, date filters, status transitions, and customer contact details.
- **80mm Thermal Receipt & KOT Printing:** Unified `Bill / KOT` action rendering isolated 80mm POS slips formatted for standard thermal receipt printers.
- **Category & Showcase Manager (`/admin/categories`):** Manage categories, card background presets, display order, and Homepage Showcase (Top 7–8) selections.
- **Store Settings & Hours (`/admin/settings`):** Toggle store open/pause status, define custom customer announcement banners, set morning/evening kitchen hours (IST), and configure GST and delivery fees.
- **Customer Account Controls:** Review registered customers, purchase metrics, and block/unblock accounts to prevent fraudulent orders.
- **Resolution Desk (`/admin/inquiries`):** Separate tabs for urgent live order tickets and general inquiries with one-click Gmail reply and direct phone dialer actions.

---

## Production Hardening & Reliability (Client Ready)

During our comprehensive audit and delivery preparation:
- **Search & Regex Sanitization:** Sanitized all backend regex search inputs (`recipeController.js`, `categoryController.js`) with an `escapeRegex` utility, eliminating server 500 errors when users search with symbols like `(`, `[`, `*`, or `+`.
- **Payment Verification Security:** In `paymentController.js`, restricted `{ isDemo: true }` mock verification strictly to development environments without configured Razorpay keys. Live keys enforce cryptographic HMAC SHA256 signature verification.
- **Order Payload & State Validation:** Added server-side validation rejecting empty orders (`items: []`) and non-positive totals. Enforced `ALLOWED_ORDER_STATUSES` enum state transitions (`Placed`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`).
- **Dual-ID Compatibility (`resolveDishQuery`):** Unified handling of numeric IDs and MongoDB `_id` strings across dish and order controllers to prevent 404 lookup failures.
- **Admin Session Security:** Synchronously clears both `localStorage` and `sessionStorage` upon admin logout in `Header.js`, eliminating unauthorized re-access vulnerabilities.
- **Clean Customer Checkout UX:** Removed hardcoded dummy data (`"Store Administrator"`, dummy phone, placeholder address) from `CheckoutPage.js`, ensuring new customers start with clean inputs and automatic address collection.
- **Dead Code & Package Purge:** Removed unused libraries, purged legacy dead components (`Shimmer.js`), and optimized bundle footprint.

---

## Tech Stack

- **Frontend:** React 18, React Router v6, Redux Toolkit, Tailwind CSS v4, Parcel
- **Backend:** Node.js, Express.js 5, Mongoose ODM
- **Database:** MongoDB Atlas Cloud
- **Testing:** Jest and React Testing Library (11 tests across 4 test suites - 100% pass)
- **Deployment:** Vercel (Frontend), Render (Backend API)

---

## Project Structure

```
Food Ninja/
├── backend/
│   ├── config/
│   │   └── connectionDb.js        # MongoDB connection and reconnect handling
│   ├── controllers/               # Recipe, category, order, inquiry, review, settings logic
│   ├── models/                    # Mongoose schemas (Recipe, Order, Category, User, Settings)
│   ├── routes/                    # REST routes (/recipes, /orders, /categories, /settings, /payment)
│   ├── data/                      # 120-dish authentic seed datasets (North, South, World)
│   ├── seedData.js                # Database seeder script
│   └── server.js                  # Express 5 application entry point
├── frontend/
│   ├── src/
│   │   ├── Component/             # UI views, route pages, and customer dialogs
│   │   │   ├── admin/             # Admin management suite
│   │   │   │   ├── AdminDishesPage.js     # Live menu inventory & stock manager
│   │   │   │   ├── AdminDishFormPage.js   # Dish editor & formulation page
│   │   │   │   ├── AdminCategoriesPage.js # Menu & showcase category manager
│   │   │   │   ├── AdminOrdersPage.js     # Live orders fulfillment dashboard
│   │   │   │   ├── AdminSettingsPage.js   # Store hours, notice & fees manager
│   │   │   │   ├── AdminInquiriesPage.js  # Customer tickets & inquiry resolution desk
│   │   │   │   ├── OrderInvoiceModal.js   # 80mm thermal receipt & KOT print modal
│   │   │   │   └── AdminDropdown.js       # Reusable searchable dropdown with add-option
│   │   │   ├── DishCard.js        # Reusable dish presentation card component
│   │   │   └── __tests__/         # Jest & React Testing Library test suite
│   │   ├── utils/                 # Redux slices, pricing math, store notice helpers
│   │   ├── App.css                # Tailwind imports & custom utilities
│   │   └── App.js                 # App routes and master navigation layout
│   ├── index.html                 # Parcel HTML entry point
│   ├── jest.config.js             # Jest unit test configuration
│   └── package.json
└── README.md
```

---

## Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas URI or local MongoDB instance

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5005
MONGO_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id        # Optional for local demo
RAZORPAY_KEY_SECRET=your_razorpay_key_secret  # Optional for local demo
```

Seed the database with authentic dishes and default accounts:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
# Server running at http://localhost:5005
```

### 2. Frontend Setup
In a separate terminal window:
```bash
cd frontend
npm install
npm start
# Application running at http://localhost:1234
```

### 3. Running Automated Tests
To run the automated Jest test suite:
```bash
cd frontend
npm test
```

### 4. Production Build
```bash
cd frontend
npm run build
```

---

## Default Demo Accounts

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@foodninja.com` | `admin123` | Full access to menu editor, inventory, orders, KOT/Bill printer, store hours & settings |
| **Customer 1** | `zaid@foodninja.com` | `password123` | Customer profile with delivered orders and verified review privileges |
| **Customer 2** | `sara@foodninja.com` | `password123` | Customer profile with order history and favorites |

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recipes` / `/api/foods` | Get paginated menu dishes (supports `?page=1&limit=12&all=true&search=...&category=...`) |
| `GET` | `/api/recipes/:id` | Get single dish by numeric `id` or MongoDB `_id` |
| `POST` | `/api/recipes` | Add new dish to menu (Admin) |
| `PUT` | `/api/recipes/:id` | Update dish details and portion pricing (Admin) |
| `DELETE`| `/api/recipes/:id` | Remove dish from catalog (Admin) |
| `PATCH`, `PUT` | `/api/recipes/:id/stock` | Toggle live kitchen stock (`inStock: true/false`) |
| `GET` | `/api/recipes/:id/reviews` | Fetch verified customer reviews |
| `POST` | `/api/recipes/:id/reviews` | Submit a review (Verified delivered buyer check) |
| `GET` | `/api/recipes/:id/review-eligibility` | Verify review eligibility for customer email |
| `GET` | `/api/orders` | Fetch customer orders or all orders (Admin) |
| `GET` | `/api/orders/:id` | Fetch detailed order with saved item pricing breakdown |
| `POST` | `/api/orders` | Place order (Strictly verified against store hours and payload integrity) |
| `PUT` | `/api/orders/:id/status` | Update fulfillment state (`Placed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered` ➔ `Cancelled`) |
| `GET`, `PUT` | `/api/settings` | Retrieve or configure store hours, pause notice, and pricing fees |
| `GET`, `POST` | `/api/categories` | List active categories or create a new category (Admin) |
| `PUT`, `DELETE` | `/api/categories/:id` | Update category details or delete category (Admin) |
| `POST` | `/api/contact` | Submit support ticket or order help issue |
| `GET` | `/api/contact` | View all customer tickets (Admin) |
| `PUT` | `/api/contact/:id/reply` | Record inquiry reply notes (Admin) |
| `PATCH` | `/api/contact/:id/resolve` | Toggle ticket resolution state |
| `DELETE`| `/api/contact/:id` | Delete inquiry (Admin) |
| `POST` | `/api/users/login` | Authenticate customer or admin account |
| `POST` | `/api/users/register` | Register new customer account |
| `PATCH` | `/api/users/:id/block` | Block or unblock customer account |
| `GET` | `/api/payment/key` | Retrieve Razorpay public key ID |
| `POST` | `/api/payment/create-order`| Generate payment order |
| `POST` | `/api/payment/verify` | Verify payment HMAC signature or mock authorization |

---

## License

This project is open source and available under the [MIT License](LICENSE).
