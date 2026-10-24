# Food Ninja Frontend

React 18 storefront and admin dashboard, built with React Router, Redux Toolkit, Tailwind CSS, and Parcel.

## Main features

- Browse and search dishes, filter categories and dietary choices, and view dish details and customer reviews.
- Manage the cart, wishlist, checkout, and customer order history.
- Use the `/admin` dashboard to manage dishes, categories, inquiries, customers, and orders.
- Filter admin orders by date and status, and search by order or customer details. Shared admin dropdowns are used for order filters and dish form selections; adding a custom cuisine remains supported.
- Configure manual store pause notices and kitchen hours in Admin Settings. The admin preview and storefront use the same closed-notice helpers and India Standard Time (IST) schedule.

## Source layout

```text
frontend/
├── src/
│   ├── Component/          # Storefront pages and reusable UI
│   │   ├── admin/          # Admin pages, forms, dropdown, and invoice views
│   │   ├── food/           # Dish presentation components
│   │   └── __tests__/      # Jest and React Testing Library tests
│   ├── utils/              # Redux state, API constants, and store notice helpers
│   ├── App.js              # Routes and application layout
│   └── App.css             # Global styles
├── index.html              # Parcel entry point
├── jest.config.js          # Jest configuration
└── package.json
```

## Run locally

Install dependencies and start the frontend:

```bash
npm install
npm start
```

Parcel serves the app at [http://localhost:1234](http://localhost:1234). Start the backend separately; see [the backend README](../backend/README.md).

To use a different API URL, set `REACT_APP_API_URL` or `API_URL` in `frontend/.env`:

```env
API_URL=http://localhost:5005/api
```

The app uses `http://localhost:5005/api` on localhost and the configured production API URL otherwise.

## Available scripts

| Command | Purpose |
|---|---|
| `npm start` | Start Parcel development server |
| `npm test` | Run frontend Jest tests |
| `npm run build` | Create the production bundle in `dist/` |
