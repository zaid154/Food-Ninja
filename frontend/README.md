# 🍔 Food Ninja — Modern Food & Recipe Discovery Web App

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Parcel](https://img.shields.io/badge/Bundled_with-Parcel_2-85D3C9?logo=parcel&logoColor=black)](https://parceljs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Firebase Hosting](https://img.shields.io/badge/Hosted_on-Firebase-FFCA28?logo=firebase&logoColor=black)](https://Food Ninja-2e144.web.app)

> **Food Ninja** is a full-featured, fast, and responsive food delivery and recipe exploration single-page web application. Built with React 18, Redux Toolkit, and Tailwind CSS, it features real-time recipe discovery, an Instamart-style grocery market, instant checkout flows, persistent wishlist & cart management, and an intelligent multilingual culinary AI assistant powered by Google Gemini.

---

### 🔗 Live Links

- 🌐 **Live Demo:** [https://Food Ninja-2e144.web.app](https://Food Ninja-2e144.web.app)
- 📦 **GitHub Repository:** [https://github.com/zaid154/Food Ninja](https://github.com/zaid154/Food Ninja)

---

## ✨ Features

### 🍲 1. Recipe & Food Discovery
- **Rich Recipe Database:** Real-time recipe exploration (via DummyJSON Recipes API) displaying dish images, prep & cook times, calorie counts, difficulty levels, and user ratings.
- **Detailed Recipe Page (`/restaurant/:id`):** Full ingredient checklist, nutritional details, step-by-step cooking instructions, cuisine tags, and direct cart actions.

### 🔍 2. Dynamic Search & Smart Filtering
- **Live Search:** Instant search filter across recipe titles and ingredients.
- **Multi-criteria Filters:** Filter by difficulty (*Easy*, *Medium*, *All*), top-rated dishes (rating > 4.5⭐), cuisine categories, and preparation speed.

### 🛒 3. Cart & Instant "Buy Now" Checkout
- **Redux-Powered Cart:** Add/remove items, adjust quantities with automatic price recalculation, and persist data in `localStorage`.
- **Fast "Buy Now" Mode:** Skip the cart and jump straight to checkout for single-item instant purchasing.
- **Cart Summary:** Live price breakdown including subtotal, delivery estimates, taxes, and coupon discounts.

### ❤️ 4. Persistent Wishlist
- **Save Favorites:** One-click heart toggle on any recipe or grocery item.
- **Header Badge Sync:** Real-time badge counter in the navigation header.
- **Quick Action:** Seamlessly move items from wishlist directly to the cart.

### 🤖 5. Multilingual AI Food Assistant (`/chat`)
- **Powered by Google Gemini:** Uses the official `@google/genai` SDK (`gemini-flash-lite-latest`) to answer culinary queries, recommend meal pairings, suggest substitutions, and give recipes.
- **Multilingual Support:** Switch seamlessly between **English**, **Hindi (हिंदी)**, and **Spanish (Español)**.
- **Context-Aware Conversation:** Maintains multi-turn conversation memory with markdown formatting.

### 🏬 6. On-Demand Grocery Hub (`/grocery`)
- **Instamart-Style Catalog:** Dedicated grocery items categorized by essentials, dairy, produce, snacks, and beverages.
- **Code-Splitting / Lazy Loading:** Loaded asynchronously using `React.lazy()` and `<Suspense>` with shimmer skeletons to optimize initial bundle size.

### 🔐 7. User Authentication & Protected Routes
- **Registration & Login:** Client-side auth with session hydration via React Context (`UserContext`) and `localStorage`.
- **Protected Routes:** Route guards on `/checkout` and `/orders` ensuring safe transactions for authenticated users.

### 📦 8. Order History & Tracking (`/orders`)
- **Order Placement:** Simulated multi-payment checkout (Credit/Debit Card, UPI, Cash on Delivery) with custom delivery instructions.
- **Persistent Order History:** View past orders, placed dates, itemized invoices, and order status.

### 🌓 9. Dark Mode & Network Status
- **Theme Switcher:** Global dark/light mode toggle stored in browser preferences.
- **Online/Offline Tracker:** Custom `useOnline` hook displaying real-time internet connectivity status in the navbar.

---

## 🛠️ Tech Stack

| Category | Technology / Library |
|---|---|
| **Core Framework** | [React 18](https://react.dev/) (Hooks, Context, Lazy, Suspense) |
| **Routing** | [React Router v6](https://reactrouter.com/) (`createBrowserRouter`, `RouterProvider`, `Outlet`) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit`, `react-redux`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), PostCSS, Custom responsive styling |
| **AI / LLM** | [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai) (`@google/genai` / Gemini Flash Lite) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Bundler & Build Tool** | [Parcel 2](https://parceljs.org/), Babel |
| **Testing** | [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/) |
| **Deployment** | [Firebase Hosting](https://firebase.google.com/docs/hosting) |

---

## 📁 Project Structure

```
Food Ninja/
├── App.js                     # Root router setup, theme hydration, and layout shell
├── App.css                    # Tailwind imports and global style definitions
├── index.html                 # Main HTML entry point
├── babel.config.js            # Babel compiler configuration
├── jest.config.js             # Jest test suite configuration
├── package.json               # Dependencies and build scripts
├── scripts/
│   └── fix-native-dll.cjs     # Native module DLL post-install helper
└── src/
    ├── Component/             # React UI components & pages
    │   ├── Header.js          # Navigation bar with badges, dark mode & network status
    │   ├── Footer.js          # Responsive footer with social & platform links
    │   ├── Cart.js            # Main home page / recipe grid with search & filters
    │   ├── ProductView.js     # Detailed single recipe page with ingredients & steps
    │   ├── addToCart.js       # Shopping cart page with price breakdown
    │   ├── Checkout.js        # Protected order checkout & payment form
    │   ├── Orders.js          # Protected past order history & details
    │   ├── Wishlist.js        # Saved items & quick add-to-cart
    │   ├── Grocery.js         # Lazy-loaded grocery store catalogue
    │   ├── ChatGptModel.js    # Google Gemini AI culinary assistant
    │   ├── Login.js           # User login page
    │   ├── Register.js        # New user registration page
    │   ├── ProtectedRoute.js  # Auth route guard
    │   ├── About.js           # About Us page
    │   ├── Contact.js         # Contact & feedback form
    │   ├── Shimmer.js         # Skeleton loading states
    │   ├── InstructionsView.js# Recipe instructions viewer
    │   ├── Cartwithdifficulty.js # Difficulty badge component
    │   ├── Usercontext.js     # React Context for auth session
    │   ├── useRecipes.js      # Custom hook for recipe data fetching
    │   ├── Usegroceries.js    # Custom hook for grocery data fetching
    │   └── __tests__/         # Unit and integration test suites
    ├── utils/                 # Redux store, slices, and helper constants
    │   ├── Store.js           # Central Redux store configuration
    │   ├── cartSlice.js       # Cart state slice (add, remove, clear)
    │   ├── wishlistSlice.js   # Wishlist state slice (add, remove, clear)
    │   ├── ordersSlice.js     # Orders history slice (placeOrder, clearOrders)
    │   ├── Constants.js       # App-wide constants and API key bindings
    │   ├── constToggle.js     # Chat translation strings (EN / HI / ES)
    │   └── useOnline.js       # Network status hook
    └── mockData/              # Test mock data
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- `npm` (comes bundled with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/zaid154/Food Ninja.git
cd Food Ninja
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example`):

```bash
cp .env.example .env
```

Add your Gemini API key inside `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id   # (Optional) For contact form
```

> 💡 **Get a free Gemini API Key:** Visit [Google AI Studio](https://aistudio.google.com/) to generate your API key.

---

## 💻 Available Scripts

| Command | Description |
|---|---|
| `npm start` or `npm run dev` | Runs the development server at `http://localhost:1234` |
| `npm run build` | Builds the optimized production bundle into the `dist/` directory |
| `npm test` | Runs the Jest test suite |
| `npm run watch-jest` | Runs Jest in interactive watch mode |

---

## 🗺️ Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home / Recipe explore page with search, filters, and cards |
| `/restaurant/:id` | Public | Recipe & Dish details, ingredients, nutrition, cooking instructions |
| `/grocery` | Public | Lazy-loaded grocery catalogue with categories |
| `/cart` | Public | Cart items, quantity controls, coupon input, and pricing |
| `/wishlist` | Public | Favorited items with 1-click cart transfer |
| `/checkout` | **Protected** | Shipping address, payment method selection, order placement |
| `/orders` | **Protected** | Past orders list, status badges, and invoice breakdown |
| `/chat` | Public | Multilingual Google Gemini AI culinary assistant |
| `/login` | Public | User authentication login |
| `/register` | Public | New account registration |
| `/about` | Public | About the platform and story |
| `/contact` | Public | Contact support form |

---

## 🚀 Deployment (Firebase Hosting)

Food Ninja is deployed using **Firebase Hosting** with SPA routing rewrite configuration.

To deploy your own instance:

```bash
# 1. Install Firebase CLI (one-time)
npm install -g firebase-tools

# 2. Login to your Firebase account
firebase login

# 3. Build the production package
npm run build

# 4. Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## 👨‍💻 Author

**Zaid**
- GitHub: [@zaid154](https://github.com/zaid154)
- Live App: [Food Ninja](https://Food Ninja-2e144.web.app)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
