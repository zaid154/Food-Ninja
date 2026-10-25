# Food Ninja - Full Stack Food Delivery Web App

Food Ninja is a full-stack food ordering platform built using the MERN stack (MongoDB, Express, React, Node.js). It includes a customer-facing ordering experience with real-time cart and order tracking, alongside an admin dashboard for managing dishes, orders, and customer inquiries.

---

## Live Demo & Links

- **Frontend:** [food-ninja.vercel.app](https://portfolio-zeta-drab-97.vercel.app/)
- **Backend API:** [food-ninja-api.onrender.com](https://food-ninja-backend.onrender.com)
- **Author:** Mohd Zaid ([GitHub](https://github.com/zaid154) | [LinkedIn](https://www.linkedin.com/in/mohd-zaid-794090231/))

---

## Features

### Customer Experience
- **Extensive Menu Browsing (158 Dishes):** Explore 158 authentic dishes across 24 regional Indian and international categories (Biryani, North Indian, South Indian, Street Food, Rolls, Chinese, Momos, Italian, Desserts, Beverages, etc.) with verified authentic photos, instant search, and pure-veg filters.
- **Smart Truncated Pagination:** Clean, responsive pagination with ellipsis (`•••`) and smooth navigation arrows across 14 pages (12 dishes per page).
- **Dish Details & Nutrition:** View detailed nutritional info, calories per serving, ingredients, preparation steps, delivery time estimates, and pricing.
- **Customer Reviews & Badges:** Real-time customer feedback on dishes, featuring dynamic "Verified Customer - Delivered Order" badges.
- **Cart & Wishlist:** Redux Toolkit-backed cart with quantity controls, subtotal calculations, and `localStorage` persistence so cart items remain saved on page refresh.
- **Order Placement & Tracking:** Seamless checkout with address and payment details. Dedicated order history and tracking page with live status updates (`Placed` -> `Preparing` -> `Out for Delivery` -> `Delivered`).
- **Store Hours & Closed Notices:** Customers see the store's closed notice in the header, cart, and checkout. The server blocks new orders when the store is paused or outside its scheduled hours.
- **User Authentication:** Simple signup and login with role management (`user` / `admin`).

### Admin Dashboard (`/admin`)
- **Menu Management:** Add new dishes, edit pricing and descriptions, or remove items.
- **Order Management:** Search orders, filter by date and status, distinguish today's and older orders, and update delivery status.
- **Categories & Customers:** Manage menu categories, review customer records, and block or unblock customer accounts. Blocked accounts cannot sign in or place new orders.
- **Store Settings:** Pause or reopen orders, enter a custom closed notice, set opening/closing times, and enable automatic closure outside those hours. The admin preview uses the backend schedule.
- **Inquiry Management:** Review customer contact messages with direct one-click email and phone call actions.

Scheduled hours support daytime ranges (for example, 06:00–20:00) and overnight ranges (for example, 18:00–02:00). They use India Standard Time (IST). A custom closed notice is shown to customers while the store is closed.

---

## Tech Stack

- **Frontend:** React 18, React Router v6, Redux Toolkit, Tailwind CSS v4, Parcel
- **Backend:** Node.js, Express.js 5, Mongoose ODM
- **Database:** MongoDB Atlas Cloud
- **Testing:** Jest and React Testing Library

---

## Project Structure

```
Food Ninja/
├── backend/
│   ├── config/
│   │   └── connectionDb.js     # MongoDB connection setup
│   ├── controllers/            # Business logic for catalog, orders, reviews, settings, etc.
│   ├── models/                 # Mongoose schemas for users, dishes, orders, reviews, settings, etc.
│   ├── routes/                 # Express route definitions, including payment
│   ├── data/                   # Seed dish data
│   ├── seedData.js             # Initial database seeder script
│   └── server.js               # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── Component/          # UI views, pages, and components
│   │   │   ├── admin/          # Admin pages and shared dropdowns
│   │   │   ├── food/           # Food cards and list items
│   │   │   └── __tests__/      # Jest & React Testing Library test suite
│   │   ├── utils/              # Redux store, slices, and constants
│   │   │   └── storeNotices.js # Shared closed-store notice and IST clock helpers
│   │   ├── App.css             # Tailwind imports & custom utilities
│   │   └── App.js              # Root router & layout
│   ├── index.html              # Parcel HTML entry point
│   ├── jest.config.js          # Jest unit test configuration
│   └── package.json
└── README.md
```

### Finding a page or API file

- Frontend route definitions are in `frontend/src/App.js`. Route pages use a `*Page.js` filename; for example, `/admin/categories` is rendered by `frontend/src/Component/admin/AdminCategoriesPage.js` and `/checkout` by `frontend/src/Component/CheckoutPage.js`.
- Shared UI pieces such as `frontend/src/Component/food/FoodCard.js` are reusable components, not route pages.
- Backend endpoints are mounted in `backend/server.js`. Their files use `backend/routes/*Routes.js`, `backend/controllers/*Controller.js`, and `backend/models/*Model.js`. For example, `/api/categories` is defined in `backend/routes/categoriesRoutes.js`, handled by `backend/controllers/categoryController.js`, and stored through `backend/models/categoryModel.js`.

---

## Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas URI or local MongoDB

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5005
MONGO_URI=your_mongodb_connection_string
```

Seed the database with sample dishes and accounts:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
# Server running at http://localhost:5005
```

### 2. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm start
# Application running at http://localhost:1234
```

### Running Tests
To run frontend unit and integration tests:
```bash
cd frontend
npm test
```

---

## Default Demo Accounts

| Role | Email | Password | Details |
|---|---|---|---|
| Admin | `admin@foodninja.com` | `admin123` | Full administrative control over menu, inquiries, and orders |
| Customer 1 | `zaid@foodninja.com` | `password123` | Customer account with historical delivered orders & verified reviews |
| Customer 2 | `sara@foodninja.com` | `password123` | Customer account with delivered orders & feedback |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recipes` | Get paginated menu dishes (supports `?page=1&limit=12&all=true`) |
| `GET` | `/api/recipes/:id` | Get single dish by ID |
| `POST` | `/api/recipes` | Add new dish (Admin) |
| `PUT` | `/api/recipes/:id` | Update dish details (Admin) |
| `DELETE`| `/api/recipes/:id` | Delete dish (Admin) |
| `PUT`, `PATCH` | `/api/recipes/:id/stock` | Update dish availability |
| `GET` | `/api/recipes/:id/reviews` | Get reviews for a dish |
| `POST` | `/api/recipes/:id/reviews` | Submit a review after delivered-order verification |
| `GET` | `/api/recipes/:id/review-eligibility` | Check whether the customer can review the dish |
| `GET` | `/api/orders` | Get orders (filtered by user or all for admin) |
| `GET` | `/api/orders/:id` | Get one order |
| `POST` | `/api/orders` | Place an order; closed stores reject the request with a notice |
| `PUT` | `/api/orders/:id/status` | Update order delivery status |
| `POST` | `/api/users/register` | Register new user account |
| `POST` | `/api/users/login` | Login user |
| `GET` | `/api/users` | List users |
| `PATCH` | `/api/users/:id/block` | Block or unblock a customer account |
| `GET` | `/api/contact` | Get all customer inquiries (Admin) |
| `POST` | `/api/contact` | Submit contact form inquiry |
| `PUT` | `/api/contact/:id/reply` | Record reply to customer inquiry |
| `DELETE`| `/api/contact/:id` | Delete inquiry (Admin) |
| `PATCH`, `PUT` | `/api/contact/:id/resolve` | Resolve an inquiry |
| `GET`, `PUT` | `/api/settings` | Read or update store hours, pause state, fees, and closed notice |
| `GET` | `/api/payment/key` | Get payment configuration status and public key |
| `POST` | `/api/payment/create-order` | Create a payment order |
| `POST` | `/api/payment/verify` | Verify a payment signature |
| `GET`, `POST` | `/api/categories` | List or create categories |
| `PUT`, `DELETE` | `/api/categories/:id` | Update or delete a category |

The recipe router is also mounted at `/api/foods` for compatibility. Review endpoints are also available under `/api/reviews/:id` and `/api/reviews/:id/eligibility`.

---

## License

This project is open source and available under the [MIT License](LICENSE).
