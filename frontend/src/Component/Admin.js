import React, { useState, useEffect } from "react";
import AdminLogin from "./admin/AdminLogin";
import AdminOverview from "./admin/AdminOverview";
import AdminOrders from "./admin/AdminOrders";
import AdminFoods from "./admin/AdminFoods";
import AdminGroceries from "./admin/AdminGroceries";

const Admin = () => {
  const [isAdminAuth, setIsAdminAuth] = useState(() => sessionStorage.getItem("adminAuth") === "true");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'orders' | 'foods' | 'groceries'
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordRes, foodRes, grocRes] = await Promise.all([
        fetch("http://localhost:5000/api/orders").then((r) => r.json()),
        fetch("http://localhost:5000/api/recipes").then((r) => r.json()),
        fetch("http://localhost:5000/api/groceries").then((r) => r.json()),
      ]);
      setOrders(ordRes.orders || []);
      setFoods(foodRes.recipes || []);
      setGroceries(grocRes.products || []);
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
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
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

  const tabs = [
    {
      id: "overview",
      label: "Overview Stats",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: "orders",
      label: `Live Orders (${orders.length})`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: "foods",
      label: `Food Dishes (${foods.length})`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: "groceries",
      label: `Grocery Items (${groceries.length})`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
  ];

  return (
    <section className="bg-slate-100 min-h-[90vh] pb-12">
      {/* Top Admin Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-black text-white uppercase tracking-wider">
              ADMIN PORTAL
            </span>
            <h1 className="text-sm font-black text-slate-900 tracking-tight">Food Ninja Store Management</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{loading ? "Syncing..." : "Refresh"}</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {msg && (
          <div className="mb-4 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm flex items-center justify-between">
            <span>{msg}</span>
            <button onClick={() => setMsg("")} className="text-white/80 hover:text-white text-sm">✕</button>
          </div>
        )}

        {/* Tab Navigation with Clean SVG Icons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition ${
                activeTab === t.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Modular Tabs */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <AdminOverview
              orders={orders}
              foods={foods}
              groceries={groceries}
              onNavigateToOrders={() => setActiveTab("orders")}
            />
          )}

          {activeTab === "orders" && (
            <AdminOrders
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === "foods" && (
            <AdminFoods
              foods={foods}
              onRefresh={fetchData}
              showToast={showToast}
            />
          )}

          {activeTab === "groceries" && (
            <AdminGroceries
              groceries={groceries}
              onRefresh={fetchData}
              showToast={showToast}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Admin;
