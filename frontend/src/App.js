import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";

import Header from "./Component/Header";
import HomePage from "./Component/HomePage";
import MenuPage from "./Component/MenuPage";
import CartPage from "./Component/CartPage";
import Footer from "./Component/Footer";
import AboutPage from "./Component/AboutPage";
import ContactPage from "./Component/ContactPage";
import TermsPage from "./Component/TermsPage";
import PrivacyPage from "./Component/PrivacyPage";
import RouteErrorPage from "./Component/RouteErrorPage";
import DishPage from "./Component/DishPage";
import UseContext from "./Component/Usercontext";
import LoginPage from "./Component/LoginPage";
import RegisterPage from "./Component/RegisterPage";
import WishlistPage from "./Component/WishlistPage";
import CheckoutPage from "./Component/CheckoutPage";
import OrderConfirmationPage from "./Component/OrderConfirmationPage";
import OrdersPage from "./Component/OrdersPage";
import OrderDetailsPage from "./Component/OrderDetailsPage";
import ProtectedRoute from "./Component/ProtectedRoute";
import AdminLayout from "./Component/AdminLayout";
import AdminOverviewPage from "./Component/admin/AdminOverviewPage";
import AdminOrdersPage from "./Component/admin/AdminOrdersPage";
import AdminDishesPage from "./Component/admin/AdminDishesPage";
import AdminDishFormPage from "./Component/admin/AdminDishFormPage";
import AdminInquiriesPage from "./Component/admin/AdminInquiriesPage";
import AdminCategoriesPage from "./Component/admin/AdminCategoriesPage";
import AdminCustomersPage from "./Component/admin/AdminCustomersPage";
import AdminSettingsPage from "./Component/admin/AdminSettingsPage";

import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/Store";
import { AppDialogProvider } from "./Component/AppDialog";

const App = () => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedUser")) || null;
    } catch {
      return null;
    }
  });
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Provider store={appStore}>
      <UseContext.Provider value={{ user, setUser }}>
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
          {!isAdminRoute && <Header />}
          <main className="flex-1">
            <Outlet />
          </main>
          {!isAdminRoute && <Footer />}
        </div>
      </UseContext.Provider>
    </Provider>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/menu", element: <MenuPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/help", element: <ContactPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/cart", element: <CartPage /> },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        )
      },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/order-confirmation/:id", element: <OrderConfirmationPage /> },
      { path: "/orders/:id", element: <OrderDetailsPage /> },
      { path: "/order/:id", element: <OrderDetailsPage /> },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminOverviewPage /> },
          { path: "overview", element: <AdminOverviewPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "foods", element: <AdminDishesPage /> },
          { path: "foods/new", element: <AdminDishFormPage /> },
          { path: "foods/add", element: <AdminDishFormPage /> },
          { path: "foods/edit/:id", element: <AdminDishFormPage /> },
          { path: "dishes", element: <AdminDishesPage /> },
          { path: "dishes/new", element: <AdminDishFormPage /> },
          { path: "dishes/edit/:id", element: <AdminDishFormPage /> },
          { path: "categories", element: <AdminCategoriesPage /> },
          { path: "customers", element: <AdminCustomersPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
          { path: "inquiries", element: <AdminInquiriesPage /> }
        ]
      },
      { path: "/restaurant/:id", element: <DishPage /> },
      { path: "/food/:id", element: <DishPage /> },
      { path: "/dish/:id", element: <DishPage /> }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppDialogProvider>
    <RouterProvider router={appRouter} />
  </AppDialogProvider>
);
