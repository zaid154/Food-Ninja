# 🍔 Food Ninja — Frontend Web App

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Parcel](https://img.shields.io/badge/Bundled_with-Parcel_2-85D3C9?logo=parcel&logoColor=black)](https://parceljs.org/)

> **Food Ninja** is a fast, responsive restaurant food delivery single-page web application. Built with React 18, Redux Toolkit, and Tailwind CSS, it features real-time dish discovery, instant checkout flows, persistent wishlist & cart management, and seamless communication with the Express/MongoDB backend.

---

## ✨ Features

### 🍲 1. Recipe & Food Discovery
- **Restaurant Menu Catalog:** Live restaurant dish browsing fetched directly from MongoDB Atlas backend via Express REST endpoints.
- **Detailed Dish View (`/restaurant/:id`):** Full ingredient list, nutritional details, preparation times, veg/non-veg tags, and direct cart actions.

### 🔍 2. Dynamic Search & Smart Filtering
- **Live Search:** Instant search filter across dish titles and categories.
- **Multi-criteria Filters:** Filter by category (Biryani, North Indian, Pizza, Chinese, etc.) and pure vegetarian toggle.

### 🛒 3. Cart & Instant "Buy Now" Checkout
- **Redux-Powered Cart:** Add/remove items, adjust quantities with automatic price recalculation, and persist data in `localStorage`.
- **Fast "Buy Now" Mode:** Skip the cart and jump straight to checkout for single-item instant purchasing.
- **Cart Summary:** Live price breakdown including subtotal, delivery fee, taxes, and grand total.

### ❤️ 4. Persistent Wishlist
- **Save Favorites:** One-click heart toggle on any recipe dish.
- **Header Badge Sync:** Real-time badge counter in the navigation header.

### 🔐 5. User Authentication & Protected Routes
- **Registration & Login:** Full backend user authentication against MongoDB with session hydration via React Context and `localStorage`.
- **Protected Routes:** Route guards on `/checkout` ensuring safe transactions for authenticated users.

### 📦 6. Order History & Management (`/orders`)
- **Order Placement:** Integrated checkout with address, phone, and payment options saved directly to MongoDB Atlas.
- **Live Order History:** View past orders, placed dates, itemized invoices, and order status tracking.

---

## 🛠️ Tech Stack

| Category | Technology / Library |
|---|---|
| **Core Framework** | React 18 (Hooks, Context, Lazy, Suspense) |
| **Routing** | React Router v6 (`createBrowserRouter`, `RouterProvider`, `Outlet`) |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`), `react-redux` |
| **Styling** | Tailwind CSS v4, PostCSS, Custom responsive styling |
| **Icons** | Lucide React |
| **Bundler & Build Tool** | Parcel 2, Babel |
| **Testing** | Jest, React Testing Library |

---

## 🚦 Getting Started

### Prerequisites
- Node.js (version 18.x or higher recommended)
- Backend running on `http://localhost:5000`

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create or verify `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm start
# Development server running at: http://localhost:1234
```

---

## 🗺️ Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home / Food menu explore page with search, filters, and cards |
| `/restaurant/:id` | Public | Dish details, ingredients, nutrition, and ordering |
| `/cart` | Public | Cart items, quantity controls, and pricing breakdown |
| `/wishlist` | Public | Favorited items with 1-click cart transfer |
| `/checkout` | **Protected** | Shipping address, payment method selection, order placement |
| `/orders` | Public/Auth | Order history, status badges, and invoice breakdown |
| `/login` | Public | User authentication login |
| `/register` | Public | New account registration |
| `/about` | Public | About the platform and story |
| `/contact` | Public | Contact support form |
| `/admin` | Admin | Store inventory and orders dashboard |

---

## 👨‍💻 Author

**Mohd Zaid**
- GitHub: [@zaid154](https://github.com/zaid154)
- Portfolio: [portfolio-zeta-drab-97.vercel.app](https://portfolio-zeta-drab-97.vercel.app/)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
