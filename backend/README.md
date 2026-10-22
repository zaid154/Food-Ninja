# Food Ninja - Backend REST API

The backend service for Food Ninja, built using **Node.js**, **Express 5**, and **MongoDB (Mongoose)**. It provides RESTful APIs for managing menu dishes, processing customer orders, user authentication, and customer contact inquiries.

---

## Architecture

The backend follows a clean **MVC (Model-Route-Controller)** pattern:

```
backend/
├── config/
│   └── connectionDb.js     # MongoDB connection setup with automatic reconnect
├── controller/             # Business logic & database operations
│   ├── inquiry.js          # Customer inquiry handlers
│   ├── order.js            # Order creation & status update handlers
│   ├── recipe.js           # Dish catalog CRUD handlers
│   └── user.js             # Authentication handlers (login / register)
├── models/                 # Mongoose schemas
│   ├── inquiry.js          # Customer contact form schema
│   ├── order.js            # Customer orders schema
│   ├── recipe.js           # Restaurant food items schema
│   └── user.js             # User accounts schema
├── routes/                 # Express route definitions
│   ├── inquiry.js          # /api/contact routes
│   ├── order.js            # /api/orders routes
│   ├── recipe.js           # /api/recipes routes
│   └── user.js             # /api/users routes
├── seedData.js             # Database seeder script with initial dishes
├── server.js               # Main application entry point
└── package.json
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5005
MONGO_URI=your_mongodb_connection_string
```

### 3. Seed Database
To populate the database with initial menu items and test accounts:
```bash
npm run seed
```

### 4. Start Server
Development mode with auto-reload:
```bash
npm run dev
```

Standard start:
```bash
npm start
```
The server will start listening at [http://localhost:5005](http://localhost:5005).

---

## API Summary

- **Health Check:** `GET /`
- **Menu Items:** `GET`, `POST` on `/api/recipes` | `GET`, `PUT`, `DELETE` on `/api/recipes/:id`
- **Orders:** `GET`, `POST` on `/api/orders` | `GET` on `/api/orders/:id` | `PUT` on `/api/orders/:id/status`
- **Authentication:** `POST /api/users/register`, `POST /api/users/login`, `GET /api/users`
- **Customer Inquiries:** `GET`, `POST` on `/api/contact` | `DELETE` on `/api/contact/:id` | `PUT` on `/api/contact/:id/reply`
