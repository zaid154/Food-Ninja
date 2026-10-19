import React, { useState, useEffect } from "react";
import { NavLink, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminLogin from "./admin/AdminLogin";
import { API_BASE_URL, LOGO } from "../utils/Constants";

const Admin = () => {
  const [isAdminAuth, setIsAdminAuth] = useState(() => sessionStorage.getItem("adminAuth") === "true");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const showToast = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3500);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail.trim() === "admin@foodninja.com" && adminPassword === "admin123") {
      sessionStorage.setItem("adminAuth", "true");
      setIsAdminAuth(true);
      setAuthError("");
    } else {
      setAuthError("Invalid admin credentials. Use admin@foodninja.com / admin123");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAdminAuth(false);
    navigate("/admin");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordRes, foodRes, inqRes] = await Promise.all([
        fetch(`${API_BASE_URL}/orders`).then((r) => r.json()).catch(() => ({ orders: [] })),
        fetch(`${API_BASE_URL}/recipes`).then((r) => r.json()).catch(() => ({ recipes: [] })),
        fetch(`${API_BASE_URL}/contact`).then((r) => r.json()).catch(() => ({ inquiries: [] })),
      ]);
      setOrders(ordRes.orders || []);
      setFoods(foodRes.recipes || []);
      setInquiries(inqRes.inquiries || []);
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuth) fetchData();
  }, [isAdminAuth]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Order #${orderId} status updated to ${newStatus}`);
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      }
    } catch {
      alert("Failed to update order status");
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Do you want to delete this customer inquiry?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Customer inquiry deleted successfully");
        setInquiries((prev) => prev.filter((i) => (i._id || i.id) !== id));
      }
    } catch {
      alert("Failed to delete inquiry");
    }
  };

  if (!isAdminAuth) {
    return (
      <AdminLogin
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        authError={authError}
        onLogin={handleAdminLogin}
      />
    );
  }

  // Contextual Header Titles based on route
  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path.includes("/orders")) {
      return {
        title: "Customer Orders",
        subtitle: "View, filter, and manage live customer orders and delivery progress."
      };
    }
    if (path.includes("/foods")) {
      return {
        title: "Food Dishes & Menu",
        subtitle: "Add new dishes, manage pricing, categories, and dietary preferences."
      };
    }
    if (path.includes("/inquiries")) {
      return {
        title: "Customer Messages",
        subtitle: "Direct inquiries and feedback submitted from the customer contact page."
      };
    }
    return {
      title: "Dashboard Overview",
      subtitle: "High-level summary of store sales, live orders, dishes, and metrics."
    };
  };

  const pageInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 p-1 shrink-0">
              <img src={LOGO} alt="Food Ninja" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-black tracking-tight text-slate-900">
                Food<span className="text-emerald-600">Ninja</span>
              </span>
              <p className="text-[11px] font-semibold text-slate-500">Admin Dashboard</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Sidebar NavLinks */}
        <nav className="flex-1 space-y-1.5 p-4 text-xs font-bold">
          <p className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Navigation
          </p>

          <NavLink
            to="/admin"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Overview</span>
            </div>
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Live Orders</span>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              {orders.length}
            </span>
          </NavLink>

          <NavLink
            to="/admin/foods"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Food Dishes</span>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
              {foods.length}
            </span>
          </NavLink>

          <NavLink
            to="/admin/inquiries"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Customer Messages</span>
            </div>
            {inquiries.length > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                {inquiries.length}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Sidebar Footer Link to Customer Store */}
        <div className="border-t border-slate-200 p-4 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <span>← Customer Store</span>
          </Link>
          <div className="text-center text-[11px] text-slate-400">
            Food Ninja Platform v1.0
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              aria-label="Toggle navigation menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                {pageInfo.title}
              </h1>
              <p className="hidden sm:block text-xs text-slate-400 mt-1">
                {pageInfo.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync Data Button */}
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-60"
              title="Sync latest store data"
            >
              <svg className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-600" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">{loading ? "Syncing..." : "Sync Data"}</span>
            </button>

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden lg:block text-right text-xs leading-tight">
                <p className="font-bold text-slate-800">Store Admin</p>
                <p className="text-[11px] text-slate-400">admin@foodninja.com</p>
              </div>

              <button
                type="button"
                onClick={handleAdminLogout}
                className="flex h-9 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 hover:bg-red-100 transition"
                title="Logout from Admin"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {msg && (
            <div className="mb-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm flex items-center justify-between">
              <span>{msg}</span>
              <button type="button" onClick={() => setMsg("")} className="text-white/80 hover:text-white">✕</button>
            </div>
          )}

          {/* Child Page Rendered with Shared Context */}
          <Outlet
            context={{
              orders,
              foods,
              inquiries,
              loading,
              fetchData,
              showToast,
              handleUpdateOrderStatus,
              handleDeleteInquiry,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default Admin;
