# 🍔 Food Ninja — Full-Stack MERN Food Delivery Platform

> A full-stack **MERN (MongoDB, Express.js, React, Node.js)** restaurant food ordering and delivery application. Features interactive dining menus, Redux Toolkit state architecture, live order status progression, and an administrative restaurant catalog control suite.

---

## 👨‍💻 Author & Developer

* **Developer Name**: Mohd Zaid
* **Portfolio**: [portfolio-zeta-drab-97.vercel.app](https://portfolio-zeta-drab-97.vercel.app/)
* **GitHub**: [github.com/zaid154](https://github.com/zaid154)
* **LinkedIn**: [linkedin.com/in/mohd-zaid-794090231/](https://www.linkedin.com/in/mohd-zaid-794090231/)
* **Email**: [zaidm1323@gmail.com](mailto:zaidm1323@gmail.com)

---

## 🌟 Key Features & Capabilities

### 🍕 1. Restaurant Food Ordering & 38-Dish Catalog
- **Interactive Multi-Cuisine Menu**: 38 curated restaurant dishes categorized by Fast Food, North Indian, Chinese, Italian, and Healthy Bowls.
- **Detailed Nutritional Profiles**: Calorie counter per serving, preparation times, dietary tags (Pure Veg / Non-Veg badges), ingredient checklists, and step-by-step chef instructions.
- **Dynamic Multi-Parameter Filters**: Real-time filtering by price range, star ratings (4.5★+), prep time (<25 mins), and cuisine tags.

### ⚡ 2. Redux Toolkit Centralized State Management
- **Cart & Wishlist Slices**: Real-time quantity recalculation, promotional coupon discounts, delivery fee thresholds, and persistent state across reloads.
- **Optimistic UI**: Instant cart addition and badge updates without interface lag.

### 📦 3. Real-Time Order Lifecycle & Status Progression
- **Order State Machine**:
  $$\text{Placed} \longrightarrow \text{Preparing in Kitchen} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
- **Interactive Tracking Visualizer**: Live stepper timeline displaying real-time delivery estimates, delivery partner contact, and order summary invoices.

### 🛡️ 4. Role-Based Admin Management Console
- **Restaurant Catalog CRUD**: Admins can add new recipes, adjust real-time pricing, toggle in-stock status, and manage incoming customer orders.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | React 18, React Router v6, Parcel Bundler 2.x |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`), React-Redux |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons |
| **Backend API** | Node.js, Express.js 5.x REST API Architecture |
| **Database & ODM** | MongoDB Atlas Cloud, Mongoose ODM 9.x |
| **Testing Suite** | Jest, React Testing Library (`@testing-library/react`), Babel |
| **Security & Utilities** | CORS, Dotenv, Bcryptjs, JSON Web Tokens |

---

## 📁 Project Architecture & Layout

```
Food Ninja/
├── backend/
│   ├── config/
│   │   └── connectionDb.js      # MongoDB Atlas connection handler
│   ├── controller/
│   │   ├── order.js             # Order placement & status updates
│   │   ├── recipe.js            # Restaurant recipe CRUD controller
│   │   └── user.js              # User authentication & profile controller
│   ├── models/
│   │   ├── Order.js             # Mongoose schema for orders & tracking
│   │   ├── Recipe.js            # Mongoose schema for dishes & nutrition
│   │   └── User.js              # Mongoose schema for users & RBAC roles
│   ├── routes/
│   │   ├── order.js             # /api/orders endpoints
│   │   ├── recipe.js            # /api/recipes endpoints
│   │   └── user.js              # /api/users endpoints
│   ├── server.js                # Express 5 server initialization
│   ├── package.json             # Backend dependencies
│   └── .env                     # MongoDB URI & server secrets
├── frontend/
│   ├── src/
│   │   ├── Component/           # UI components, cards, navigation & modals
│   │   ├── Store/               # Redux Toolkit store, cartSlice, userSlice
│   │   ├── utils/               # Constants, mock data, API wrappers
│   │   └── App.js               # React Router layout & routes
│   ├── package.json             # Frontend dependencies & Parcel scripts
│   └── index.html
└── README.md                    # Technical documentation
```

---

## 🗄️ Database Schemas & Models

### 1. Recipe Model (`Recipe.js`)
- `id` (Number, unique)
- `name` (String, required)
- `category` (String, default "Fast Food")
- `price` (Number, required)
- `image` (String, CDN URL)
- `isVeg` (Boolean, default true)
- `rating` (Number, default 4.5)
- `reviewCount` (Number)
- `deliveryTime` (String, e.g., "25-30 mins")
- `cuisine` (String, e.g., "Indian", "Italian")
- `caloriesPerServing` (Number)
- `ingredients` (Array of Strings)
- `instructions` (Array of Strings)

### 2. Order Model (`Order.js`)
- `id` (Number, unique)
- `userEmail` (String)
- `customerName` (String)
- `phone` (String)
- `address` (String)
- `payment` (String, e.g., "Cash on Delivery", "UPI")
- `items` (Array of order item snapshots)
- `total` (Number)
- `status` (Enum: `Placed`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`)
- `date` (String / Timestamps)

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/recipes` | Fetch all 38 restaurant menu dishes | Public |
| `GET` | `/api/recipes/:id` | Fetch detailed dish information & recipe | Public |
| `POST` | `/api/recipes` | Add new recipe dish to catalog | Admin |
| `PUT` | `/api/recipes/:id` | Update recipe price, details, or stock | Admin |
| `DELETE` | `/api/recipes/:id` | Remove dish from restaurant menu | Admin |
| `POST` | `/api/orders` | Create and place a new food order | Customer |
| `GET` | `/api/orders` | Fetch customer orders or all orders | Customer / Admin |
| `PUT` | `/api/orders/:id/status`| Update order status progression | Admin / Rider |
| `POST` | `/api/users/login` | User/Admin authentication | Public |
| `POST` | `/api/users/register` | Register customer account | Public |

---

## 🔑 Pre-Seeded Accounts

- **Store Admin**: `admin@foodninja.com` / `admin123`
- **Customer User**: `zaid@foodninja.com` / `password123`

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js v18.0.0 or higher
- MongoDB Atlas cluster or local MongoDB instance

### 1. Backend Setup
```bash
cd backend
npm install
```

Configure `backend/.env`:
```env
PORT=5005
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/food_ninja?retryWrites=true&w=majority
```

Start the backend server:
```bash
npm run dev
# Server running at: http://localhost:5005
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm start
# Parcel application running at: http://localhost:1234
```

---

## 📄 License

Engineered and maintained by **Mohd Zaid**. Released under the [MIT License](LICENSE).
