import React, { useState, useEffect } from "react";
import { NavLink, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminLogin from "./admin/AdminLogin";
import Header from "./Header";
import Footer from "./Footer";
import { API_BASE_URL, LOGO } from "../utils/Constants";

const Admin = () => {
  const [isAdminAuth, setIsAdminAuth] = useState(() => sessionStorage.getItem("adminAuth") === "true");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

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
    navigate("/");
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

  const handleReplyInquiry = async (id, replyMessage) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact/${id}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Reply sent & recorded successfully!");
        setInquiries((prev) =>
          prev.map((i) =>
            (i._id || i.id) === id
              ? { ...i, status: "Replied", replyMessage, repliedAt: new Date().toISOString() }
              : i
          )
        );
        return true;
      } else {
        alert(data.message || "Failed to record reply.");
        return false;
      }
    } catch (err) {
      console.error("Error replying to inquiry:", err);
      alert("Error connecting to server to send reply.");
      return false;
    }
  };

  if (!isAdminAuth) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1">
          <AdminLogin
            adminEmail={adminEmail}
            setAdminEmail={setAdminEmail}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
            authError={authError}
            onLogin={handleAdminLogin}
          />
        </main>
        <Footer />
      </div>
    );
  }

  const navLinks = [
    {
      to: "/admin",
      end: true,
      label: "Overview",
      badge: null,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      to: "/admin/orders",
      end: false,
      label: "Live Orders",
      badge: orders.length,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      to: "/admin/foods",
      end: false,
      label: "Food Dishes",
      badge: foods.length,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      to: "/admin/inquiries",
      end: false,
      label: "Customer Messages",
      badge: inquiries.length,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-2xs">
        {/* Top Branding Row */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
          {/* Brand Logo */}
          <Link to="/admin" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 p-1">
              <img src={LOGO} alt="Food Ninja" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                  Food<span className="text-emerald-600">Ninja</span>
                </span>
                <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Admin Dashboard</p>
            </div>
          </Link>

          {/* Right Tools & Admin Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync Button */}
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-50"
              title="Refresh store data"
            >
              <svg className={`h-3.5 w-3.5 ${loading ? "animate-spin text-emerald-600" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">{loading ? "Syncing..." : "Sync Data"}</span>
            </button>

            {/* View Customer Store Link */}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              title="Open customer website in new tab"
            >
              <span>View Store</span>
              <span className="text-slate-400">↗</span>
            </Link>

            {/* Admin Profile */}
            <div className="hidden md:block pl-2 border-l border-slate-200 text-right text-xs leading-tight">
              <p className="font-semibold text-slate-800">Store Admin</p>
              <p className="text-[11px] text-slate-400">admin@foodninja.com</p>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleAdminLogout}
              className="flex h-8 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
              title="Logout from Admin"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Clean Top Navigation Bar (Tabs) */}
        <div className="border-t border-slate-100 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none text-xs font-semibold">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                    isActive
                      ? "border-emerald-600 text-slate-900 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge !== null && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Main Full-Width Content Area */}
      <main className="mx-auto max-w-7xl w-full flex-1 px-4 sm:px-6 lg:px-8 py-6">
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
            handleReplyInquiry,
          }}
        />
      </main>
    </div>
  );
};

export default Admin;
