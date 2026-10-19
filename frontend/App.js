import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";

import Header from "./src/Component/Header";
import FoodMenu from "./src/Component/FoodMenu";
import Cart from "./src/Component/Cart";
import Footer from "./src/Component/Footer";
import About from "./src/Component/About";
import Contact from "./src/Component/Contact";
import Error from "./src/Component/Error";
import ProductView from "./src/Component/ProductView";
import UseContext from "./src/Component/Usercontext";
import Login from "./src/Component/Login";
import Register from "./src/Component/Register";
import Wishlist from "./src/Component/Wishlist";
import Checkout from "./src/Component/Checkout";
import Orders from "./src/Component/Orders";
import ProtectedRoute from "./src/Component/ProtectedRoute";
import Admin from "./src/Component/Admin";
import AdminOverview from "./src/Component/admin/AdminOverview";
import AdminOrders from "./src/Component/admin/AdminOrders";
import AdminFoods from "./src/Component/admin/AdminFoods";
import AdminInquiries from "./src/Component/admin/AdminInquiries";

import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./src/utils/Store";

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
