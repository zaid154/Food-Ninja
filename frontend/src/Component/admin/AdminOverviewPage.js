import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";

const getStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "Out for Delivery":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "Preparing":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "Placed":
      return "bg-purple-50 text-purple-800 border-purple-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const AdminOverviewPage = (props) => {
  const context = useOutletContext() || {};
  const orders = props.orders || context.orders || [];
  const foods = props.foods || context.foods || [];
  const categories = props.categories || context.categories || [];
  const inquiries = props.inquiries || context.inquiries || [];
  const onRefresh = props.fetchData || context.fetchData;
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [filterTab, setFilterTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const handleManualRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total || 0 : 0), 0),
    [orders]
  );

  const deliveredOrders = useMemo(() => orders.filter((o) => o.status === "Delivered"), [orders]);
  const placedOrders = useMemo(() => orders.filter((o) => o.status === "Placed"), [orders]);
  const preparingOrders = useMemo(() => orders.filter((o) => o.status === "Preparing"), [orders]);
  const outForDeliveryOrders = useMemo(() => orders.filter((o) => o.status === "Out for Delivery"), [orders]);
  const cancelledOrders = useMemo(() => orders.filter((o) => o.status === "Cancelled"), [orders]);

  const pendingOrders = placedOrders.length + preparingOrders.length + outForDeliveryOrders.length;
  const avgOrderValue = deliveredOrders.length > 0 ? Math.round(totalRevenue / deliveredOrders.length) : 0;

  const vegCount = useMemo(() => foods.filter((f) => f.isVeg).length, [foods]);
  const nonVegCount = foods.length - vegCount;

  // Filtered orders list for the live orders table
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filterTab === "active" && !["Placed", "Preparing", "Out for Delivery"].includes(o.status)) return false;
      if (filterTab === "delivered" && o.status !== "Delivered") return false;
      if (filterTab === "cancelled" && o.status !== "Cancelled") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = String(o.id || "").includes(q);
        const matchesCustomer = (o.customerName || "").toLowerCase().includes(q);
        const matchesItem = (o.items || []).some((item) => (item.name || "").toLowerCase().includes(q));
        if (!matchesId && !matchesCustomer && !matchesItem) return false;
      }
      return true;
    });
  }, [orders, filterTab, searchQuery]);

  const isStoreOpen = settings ? settings.isEffectiveOpen !== false && settings.restaurantOpen !== false : true;

  return (
    <div className="space-y-6">
      {/* Food Ninja Branded Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Food Ninja Dashboard
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  isStoreOpen
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isStoreOpen ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
                {isStoreOpen ? "Store Open • Accepting Orders" : "Store Closed Currently"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Welcome back, <span className="text-emerald-600">Store Admin</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Track live kitchen orders, manage food menus, review customer inquiries, and oversee your restaurant operations in real-time.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/admin/foods/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 shadow-xs transition active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Dish</span>
            </Link>

            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 shadow-xs transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Live Orders ({pendingOrders})</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2.5 transition"
            >
              <span>Storefront</span>
              <span className="text-slate-400">↗</span>
            </Link>

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 p-2.5 text-slate-600 hover:text-slate-900 transition disabled:opacity-50 cursor-pointer"
              title="Refresh Data"
            >
              <svg
                className={`h-4 w-4 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Operating Hours & Announcement Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
              <span>Hours: <strong className="text-slate-800">{settings?.operatingHoursText || "6:00 AM – 12:00 AM"}</strong></span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-600">
              Free delivery on orders above <strong className="text-emerald-700">₹{settings?.freeDeliveryThreshold || 499}</strong>
            </span>
          </div>

          <Link to="/admin/settings" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
            Manage Store Hours & Charges →
          </Link>
        </div>
      </div>

      {/* 6 Metric & Module Stat Cards in Site Theme */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue */}
        <div
          onClick={() => navigate("/admin/orders")}
          className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:scale-105 transition-transform">
              <span className="font-black text-lg">₹</span>
            </div>
            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
              {deliveredOrders.length} Completed
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
            <p className="text-3xl font-black tracking-tight text-slate-900 mt-0.5">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Average ticket: <strong className="text-slate-700">₹{avgOrderValue}</strong> per order
            </p>
          </div>
        </div>

        {/* Live Orders Card */}
        <div
          onClick={() => navigate("/admin/orders")}
          className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-sky-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 border border-sky-100 text-sky-600 group-hover:scale-105 transition-transform">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 text-[10px] font-bold">
              {pendingOrders} Active
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Orders</p>
            <p className="text-3xl font-black tracking-tight text-slate-900 mt-0.5">{orders.length}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>{placedOrders.length} placed • {preparingOrders.length} in kitchen</span>
              <span className="text-sky-600 font-semibold group-hover:underline">Manage →</span>
            </p>
          </div>
        </div>

        {/* Food Dishes Catalog */}
        <div
          onClick={() => navigate("/admin/foods")}
          className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-600 group-hover:scale-105 transition-transform">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
              Catalog
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Food Menu Dishes</p>
            <p className="text-3xl font-black tracking-tight text-slate-900 mt-0.5">{foods.length}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>{vegCount} Veg • {nonVegCount} Non-Veg</span>
              <span className="text-amber-600 font-semibold group-hover:underline">Edit Dishes →</span>
            </p>
          </div>
        </div>

        {/* Categories Card */}
        <div
          onClick={() => navigate("/admin/categories")}
          className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-600 group-hover:scale-105 transition-transform">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[10px] font-bold">
              Collections
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Menu Categories</p>
            <p className="text-3xl font-black tracking-tight text-slate-900 mt-0.5">{categories.length}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>Palettes & showcases</span>
              <span className="text-purple-600 font-semibold group-hover:underline">Customize →</span>
            </p>
          </div>
        </div>

        {/* Customer Messages Card */}
        <div
          onClick={() => navigate("/admin/inquiries")}
          className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-rose-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-600 group-hover:scale-105 transition-transform">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[10px] font-bold">
              Support
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Messages</p>
            <p className="text-3xl font-black tracking-tight text-slate-900 mt-0.5">{inquiries.length}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>Feedback & contact queries</span>
              <span className="text-rose-600 font-semibold group-hover:underline">View All →</span>
            </p>
          </div>
        </div>

        {/* Store Settings & Delivery */}
        <div
          onClick={() => navigate("/admin/settings")}
          className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-teal-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-600 group-hover:scale-105 transition-transform">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 text-[10px] font-bold">
              Config
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery & Charges</p>
            <p className="text-3xl font-black tracking-tight text-slate-900 mt-0.5">
              ₹{settings?.deliveryFee || 30} <span className="text-sm font-semibold text-slate-400">fee</span>
            </p>
            <p className="mt-1 text-xs text-slate-500 font-medium flex items-center justify-between">
              <span>{settings?.taxRate || 5}% Tax • Packaging ₹{settings?.packagingFee || 15}</span>
              <span className="text-teal-600 font-semibold group-hover:underline">Settings →</span>
            </p>
          </div>
        </div>
      </div>

      {/* Live Kitchen & Order Pipeline Progress Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Kitchen & Order Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status distribution of customer orders</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 self-start sm:self-auto">
            {pendingOrders} active processing
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            onClick={() => setFilterTab(filterTab === "active" ? "all" : "active")}
            className="cursor-pointer rounded-xl bg-purple-50/70 border border-purple-100 p-3 hover:border-purple-300 transition text-center"
          >
            <span className="text-[11px] font-bold uppercase text-purple-700 tracking-wider">Placed</span>
            <p className="text-xl font-black text-purple-900 mt-1">{placedOrders.length}</p>
            <span className="text-[10px] text-purple-600 font-medium">New arrival</span>
          </div>

          <div
            onClick={() => setFilterTab(filterTab === "active" ? "all" : "active")}
            className="cursor-pointer rounded-xl bg-amber-50/70 border border-amber-100 p-3 hover:border-amber-300 transition text-center"
          >
            <span className="text-[11px] font-bold uppercase text-amber-700 tracking-wider">Preparing</span>
            <p className="text-xl font-black text-amber-900 mt-1">{preparingOrders.length}</p>
            <span className="text-[10px] text-amber-600 font-medium">In the kitchen</span>
          </div>

          <div
            onClick={() => setFilterTab(filterTab === "active" ? "all" : "active")}
            className="cursor-pointer rounded-xl bg-sky-50/70 border border-sky-100 p-3 hover:border-sky-300 transition text-center"
          >
            <span className="text-[11px] font-bold uppercase text-sky-700 tracking-wider">Out for Delivery</span>
            <p className="text-xl font-black text-sky-900 mt-1">{outForDeliveryOrders.length}</p>
            <span className="text-[10px] text-sky-600 font-medium">With rider</span>
          </div>

          <div
            onClick={() => setFilterTab(filterTab === "delivered" ? "all" : "delivered")}
            className="cursor-pointer rounded-xl bg-emerald-50/70 border border-emerald-100 p-3 hover:border-emerald-300 transition text-center"
          >
            <span className="text-[11px] font-bold uppercase text-emerald-700 tracking-wider">Delivered</span>
            <p className="text-xl font-black text-emerald-900 mt-1">{deliveredOrders.length}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Successfully completed</span>
          </div>

          <div
            onClick={() => setFilterTab(filterTab === "cancelled" ? "all" : "cancelled")}
            className="cursor-pointer rounded-xl bg-rose-50/70 border border-rose-100 p-3 hover:border-rose-300 transition text-center col-span-2 sm:col-span-1"
          >
            <span className="text-[11px] font-bold uppercase text-rose-700 tracking-wider">Cancelled</span>
            <p className="text-xl font-black text-rose-900 mt-1">{cancelledOrders.length}</p>
            <span className="text-[10px] text-rose-600 font-medium">Voided orders</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Quick Management Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Customer Orders */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500 mt-0.5">Live orders placed by store customers</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Tab Pills */}
              <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilterTab("all")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterTab === "all" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("active")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterTab === "active" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Active ({pendingOrders})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("delivered")}
                  className={`px-3 py-1 rounded-lg transition ${
                    filterTab === "delivered" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Delivered ({deliveredOrders.length})
                </button>
              </div>

              <Link
                to="/admin/orders"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline px-2"
              >
                View all →
              </Link>
            </div>
          </div>

          {/* Search bar inside orders table */}
          <div className="mt-4 mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders by customer name, order ID, or food dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-xs font-bold text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <span className="text-3xl block mb-2">🍽️</span>
              No customer orders match the current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items & Portions</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.slice(0, 6).map((o) => {
                    const badgeClass = getStatusBadge(o.status);
                    const isOrderActive = ["Placed", "Preparing", "Out for Delivery"].includes(o.status);
                    const customerInitial = o.customerName ? o.customerName[0].toUpperCase() : "C";

                    return (
                      <tr key={o.id || o._id} className="text-slate-700 hover:bg-slate-50/60 transition">
                        {/* Order ID */}
                        <td className="py-3 font-mono font-bold text-slate-900">
                          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px]">
                            #{o.id}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                              {customerInitial}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">{o.customerName || "Customer"}</p>
                              {o.phone && <p className="text-[10px] text-slate-400 truncate">{o.phone}</p>}
                            </div>
                          </div>
                        </td>

                        {/* Items preview with portions */}
                        <td className="py-3 max-w-[200px]">
                          <div className="truncate text-slate-600 font-medium">
                            {o.items && o.items.length > 0 ? (
                              <span>
                                {o.items[0]?.name}
                                {o.items[0]?.portionSize && (
                                  <span className="text-slate-400 text-[10px]"> ({o.items[0].portionSize})</span>
                                )}
                                {o.items.length > 1 && (
                                  <span className="text-emerald-700 font-bold ml-1 text-[10px]">
                                    +{o.items.length - 1} more
                                  </span>
                                )}
                              </span>
                            ) : (
                              "1 item"
                            )}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-3 font-black text-slate-900">
                          ₹{o.total}
                        </td>

                        {/* Status */}
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-bold text-[10px] ${badgeClass}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              o.status === "Delivered" ? "bg-emerald-600" :
                              o.status === "Out for Delivery" ? "bg-sky-600 animate-pulse" :
                              o.status === "Preparing" ? "bg-amber-600" :
                              o.status === "Placed" ? "bg-purple-600" : "bg-rose-600"
                            }`} />
                            {o.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/orders/${o.id}`)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          >
                            <span>Details</span>
                            <span>→</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Menu Collections & Store Insights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Menu Categories Palette Showcase */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Menu Categories</h3>
              <Link to="/admin/categories" className="text-xs font-semibold text-emerald-600 hover:underline">
                Manage →
              </Link>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {categories.slice(0, 5).map((c) => {
                const count = foods.filter((f) => f.category && f.category.toLowerCase() === c.name.toLowerCase()).length;
                return (
                  <div
                    key={c.id || c._id || c.name}
                    onClick={() => navigate(`/admin/foods?category=${encodeURIComponent(c.name)}`)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="h-8 w-8 rounded-lg object-cover border border-slate-100 shadow-2xs"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{count} dishes in menu</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-slate-800 transition">→</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Store Health & Operational Compliance */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Store Quick Info</h3>
              <Link to="/admin/settings" className="text-xs font-semibold text-emerald-600 hover:underline">
                Edit →
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">Restaurant</span>
                <span className="font-bold text-slate-900">{settings?.restaurantName || "Food Ninja"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">FSSAI License</span>
                <span className="font-mono font-medium text-slate-800">{settings?.fssaiNumber || "10020011000123"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">GSTIN</span>
                <span className="font-mono font-medium text-slate-800">{settings?.gstinNumber || "07AAAAF1234A1Z5"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">Phone Support</span>
                <span className="font-medium text-slate-800">{settings?.storePhone || "+91 98765 43210"}</span>
              </div>
            </div>
          </div>

          {/* Recent Inquiries Preview */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Customer Messages</h3>
              <Link to="/admin/inquiries" className="text-xs font-semibold text-rose-600 hover:underline">
                View all ({inquiries.length}) →
              </Link>
            </div>

            {inquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No customer inquiries yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {inquiries.slice(0, 2).map((inq) => (
                  <div key={inq._id || inq.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{inq.name || "Customer"}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Recent"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-medium">
                      {inq.message || inq.subject || "Customer sent a feedback inquiry."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;