# Food Ninja Backend

REST API for the Food Ninja storefront and admin dashboard. The backend uses Node.js, Express 5, and MongoDB through Mongoose.

## Project layout

```text
backend/
├── config/connectionDb.js       # MongoDB connection and reconnect handling
├── controllers/                 # Catalog, category, inquiry, order, review, settings, and user logic
├── data/                        # Initial dish data used by the seeder
├── models/                      # Mongoose schemas
├── routes/                      # API route definitions, including Razorpay payments
├── seedData.js                  # Database seeder (npm run seed)
├── server.js                    # Express app and route mounts
└── package.json
```

## Finding API code

`server.js` connects each API prefix to a route file. Route files end in `Routes.js`, request logic files in `controllers/` end in `Controller.js`, and Mongoose schema files in `models/` end in `Model.js`.

For example, `/api/categories` uses `routes/categoriesRoutes.js`, `controllers/categoryController.js`, and `models/categoryModel.js`. `/api/orders` uses the corresponding `ordersRoutes.js`, `orderController.js`, and `orderModel.js` files. The recipes router also serves `/api/foods` for compatibility.

## Run locally

Install dependencies from this directory:

```bash
npm install
```

Create `backend/.env`:

```env
PORT=5005
MONGO_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Razorpay keys are optional in local demo mode. Start the API with `npm run dev` or `npm start`. Seed sample data with `npm run seed`.

## Store hours and closed notices

`GET /api/settings` returns the store settings and the computed `isEffectiveOpen`, `isWithinHours`, and `effectiveClosedReason` values. `PUT /api/settings` updates settings such as `restaurantOpen`, `openingTime`, `closingTime`, `autoScheduleEnabled`, and `closedNoticeMessage`.

- Scheduled hours use India Standard Time (IST), regardless of the server's timezone.
- Daytime hours such as `06:00`–`20:00` and overnight hours such as `18:00`–`02:00` are supported. Opening is inclusive and closing is exclusive; equal opening and closing times mean open all day.
- When `autoScheduleEnabled` is on, the schedule closes the store outside its hours. Turning it off disables schedule-based closure, while manual pause still works.
- A non-empty `closedNoticeMessage` is shown whenever the store is closed. Without one, the API supplies a default pause or kitchen-hours notice.
- `POST /api/orders` checks the effective store status on the server and rejects order creation with HTTP `403` while closed.

## Customer account blocking

`PATCH /api/users/:id/block` accepts `{ "isBlocked": true }` to block a customer or `false` to unblock them. Admin accounts cannot be blocked. Blocked customers cannot log in, create orders, or start a payment checkout. Existing orders are left unchanged.

## API routes

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Health check |
| `GET`, `POST` | `/api/recipes` | List dishes or add a dish |
| `GET`, `PUT`, `DELETE` | `/api/recipes/:id` | Read, update, or delete a dish |
| `PUT`, `PATCH` | `/api/recipes/:id/stock` | Update dish availability |
| `GET`, `POST` | `/api/recipes/:id/reviews` | Read or submit dish reviews |
| `GET` | `/api/recipes/:id/review-eligibility` | Check review eligibility |
| `GET`, `POST` | `/api/orders` | List or create orders |
| `GET` | `/api/orders/:id` | Read one order |
| `PUT` | `/api/orders/:id/status` | Update order status |
| `POST` | `/api/users/register`, `/api/users/login` | Register or log in |
| `GET` | `/api/users` | List users |
| `PATCH` | `/api/users/:id/block` | Block or unblock a customer account |
| `GET`, `POST` | `/api/categories` | List or create categories |
| `PUT`, `DELETE` | `/api/categories/:id` | Update or delete a category |
| `GET`, `POST` | `/api/contact` | List or create inquiries |
| `DELETE` | `/api/contact/:id` | Delete an inquiry |
| `PUT` | `/api/contact/:id/reply` | Record an inquiry reply |
| `PUT`, `PATCH` | `/api/contact/:id/resolve` | Resolve an inquiry |
| `GET`, `PUT` | `/api/settings` | Read or update store settings |
| `GET` | `/api/payment/key` | Read payment configuration |
| `POST` | `/api/payment/create-order` | Create a Razorpay or demo payment order |
| `POST` | `/api/payment/verify` | Verify a payment |

For compatibility, the recipe router is also mounted at `/api/foods`. Reviews are also available under `/api/reviews/:id` and `/api/reviews/:id/eligibility`.
