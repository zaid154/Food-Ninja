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
- **Menu Browsing & Search:** Explore restaurant dishes across categories (Biryani, North Indian, Fast Food, Chinese, Desserts) with instant text search and pure-veg filters.
- **Dish Details:** View detailed nutritional info, ingredients, delivery estimates, and price per dish.
- **Cart & Wishlist:** Redux Toolkit-backed cart with quantity controls, subtotal calculations, and `localStorage` persistence so cart items remain saved on page refresh.
- **Order Placement & Tracking:** Seamless checkout with address and payment details. Dedicated order history and tracking page with live status updates (`Placed` -> `Preparing` -> `Out for Delivery` -> `Delivered`).
- **User Authentication:** Simple signup and login with role management (`user` / `admin`).

### Admin Dashboard (`/admin`)
- **Menu Management:** Add new dishes, edit pricing and descriptions, or remove items.
- **Order Management:** View all incoming orders, customer details, and update live delivery status.
- **Inquiry Management:** Review customer contact messages with direct one-click email and phone call actions.

---

## Tech Stack

- **Frontend:** React 18, React Router v6, Redux Toolkit, Tailwind CSS v4, Parcel
- **Backend:** Node.js, Express.js 5, Mongoose ODM
- **Database:** MongoDB Atlas Cloud
- **Testing:** Jest, React Testing Library (100% pass)

---

## Project Structure

```
Food Ninja/
├── backend/
│   ├── config/
│   │   └── connectionDb.js     # MongoDB connection setup
│   ├── controller/             # Business logic
│   │   ├── inquiry.js          # Contact messages controller
│   │   ├── order.js            # Orders & status progression
│   │   ├── recipe.js           # Menu dishes CRUD
│   │   └── user.js             # Registration & login
│   ├── models/                 # Mongoose schemas (User, Recipe, Order, Inquiry)
│   ├── routes/                 # Express route definitions
│   ├── seedData.js             # Initial database seeder script
│   └── server.js               # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── Component/          # UI views, pages, and components
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── food/           # Food cards and list items
│   │   │   └── __tests__/      # Jest & React Testing Library test suite
│   │   ├── mockData/           # Test fixtures
│   │   ├── utils/              # Redux store, slices, and constants
│   │   ├── App.css             # Tailwind imports & custom utilities
│   │   └── App.js              # Root router & layout
│   ├── index.html              # Parcel HTML entry point
│   ├── jest.config.js          # Jest unit test configuration
│   └── package.json
└── README.md
```

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

| Role | Email | Password |
|---|---|---|
| Admin | `admin@foodninja.com` | `admin123` |
| User | `zaid@foodninja.com` | `password123` |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recipes` | Get all menu dishes |
| `GET` | `/api/recipes/:id` | Get single dish by ID |
| `POST` | `/api/recipes` | Add new dish (Admin) |
| `PUT` | `/api/recipes/:id` | Update dish details (Admin) |
| `DELETE`| `/api/recipes/:id` | Delete dish (Admin) |
| `GET` | `/api/orders` | Get orders (filtered by user or all for admin) |
| `POST` | `/api/orders` | Place a new order |
| `PUT` | `/api/orders/:id/status` | Update order delivery status |
| `POST` | `/api/users/register` | Register new user account |
| `POST` | `/api/users/login` | Login user |
| `GET` | `/api/contact` | Get all customer inquiries (Admin) |
| `POST` | `/api/contact` | Submit contact form inquiry |
| `PUT` | `/api/contact/:id/reply` | Record reply to customer inquiry |
| `DELETE`| `/api/contact/:id` | Delete inquiry (Admin) |

---

## License

This project is open source and available under the [MIT License](LICENSE).
