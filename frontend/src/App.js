import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";

import Header from "./Component/Header";
import FoodMenu from "./Component/FoodMenu";
import Cart from "./Component/Cart";
import Footer from "./Component/Footer";
import About from "./Component/About";
import Contact from "./Component/Contact";
import Error from "./Component/Error";
import ProductView from "./Component/ProductView";
import UseContext from "./Component/Usercontext";
import Login from "./Component/Login";
import Register from "./Component/Register";
import Wishlist from "./Component/Wishlist";
import Checkout from "./Component/Checkout";
import Orders from "./Component/Orders";
import OrderDetail from "./Component/OrderDetail";
import ProtectedRoute from "./Component/ProtectedRoute";
import Admin from "./Component/Admin";
import AdminOverview from "./Component/admin/AdminOverview";
import AdminOrders from "./Component/admin/AdminOrders";
import AdminFoods from "./Component/admin/AdminFoods";
import AdminInquiries from "./Component/admin/AdminInquiries";

import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/Store";

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
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
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
    errorElement: <Error />,
    children: [
      { path: "/", element: <FoodMenu /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/cart", element: <Cart /> },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      },
      { path: "/orders", element: <Orders /> },
      { path: "/orders/:id", element: <OrderDetail /> },
      { path: "/order/:id", element: <OrderDetail /> },
      {
        path: "/admin",
        element: <Admin />,
        children: [
          { index: true, element: <AdminOverview /> },
          { path: "overview", element: <AdminOverview /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "foods", element: <AdminFoods /> },
          { path: "inquiries", element: <AdminInquiries /> }
        ]
      },
      { path: "/restaurant/:id", element: <ProductView /> }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
