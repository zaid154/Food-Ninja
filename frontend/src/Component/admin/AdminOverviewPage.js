import { useState, useMemo } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

const STATUS_BADGES = {
  Delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Out for Delivery": "bg-sky-50 text-sky-800 border-sky-200",
  Preparing: "bg-amber-50 text-amber-800 border-amber-200",
  Cancelled: "bg-rose-50 text-rose-800 border-rose-200",
  Placed: "bg-purple-50 text-purple-800 border-purple-200",
};

const RupeeIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const DishesIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CategoriesIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const InquiriesIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const AdminOverviewPage = (props) => {
  const context = useOutletContext() || {};
  const orders = props.orders || context.orders || [];
  const foods = props.foods || context.foods || [];
  const categories = props.categories || context.categories || [];
  const inquiries = props.inquiries || context.inquiries || [];
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const totalRevenue = useMemo(
    () => orders.reduce((s, o) => s + (o.status !== "Cancelled" ? o.total || 0 : 0), 0),
    [orders]
  );
  const pendingCount = orders.filter((o) => ["Placed", "Preparing", "Out for Delivery"].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const unresolvedInquiries = inquiries.filter((i) => !i.isResolved).length;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filter === "Active" && !["Placed", "Preparing", "Out for Delivery"].includes(o.status)) return false;
      if (filter === "Delivered" && o.status !== "Delivered") return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return String(o.id).includes(q) || (o.customerName || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [orders, filter, search]);

  const cards = [
    { label: "Total Revenue", val: `₹${totalRevenue.toLocaleString("en-IN")}`, sub: `${deliveredCount} delivered orders`, to: "/admin/orders", icon: <RupeeIcon />, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { label: "Live Orders", val: orders.length, sub: `${pendingCount} active in progress`, to: "/admin/orders", icon: <OrdersIcon />, color: "text-sky-700 bg-sky-50 border-sky-200" },
    { label: "Food Dishes", val: foods.length, sub: "Active catalog dishes", to: "/admin/foods", icon: <DishesIcon />, color: "text-amber-700 bg-amber-50 border-amber-200" },
    { label: "Categories", val: categories.length, sub: "Menu themes & presets", to: "/admin/categories", icon: <CategoriesIcon />, color: "text-purple-700 bg-purple-50 border-purple-200" },
    { label: "Customer Inquiries", val: inquiries.length, sub: unresolvedInquiries > 0 ? `${unresolvedInquiries} pending attention` : "All issues resolved", to: "/admin/inquiries", icon: <InquiriesIcon />, color: "text-rose-700 bg-rose-50 border-rose-200" },
    { label: "Store Settings", val: "Charges & Hours", sub: "Delivery fee & timings", to: "/admin/settings", icon: <SettingsIcon />, color: "text-slate-700 bg-slate-50 border-slate-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Store <span className="text-emerald-600">Overview</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time status of orders, catalog, and operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/foods/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 transition shadow-xs"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Dish</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3 py-2 transition"
          >
            <span>Storefront</span>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards with Clean SVG Icons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            onClick={() => navigate(c.to)}
            className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{c.label}</span>
              <span className={`h-8 w-8 rounded-lg border flex items-center justify-center ${c.color}`}>
                {c.icon}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{c.val}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>{c.sub}</span>
              <span className="text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-0.5">
                <span>Manage</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-400 mt-0.5">Orders received across the store</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
              {["All", "Active", "Delivered"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-2.5 py-1 rounded-md transition ${filter === tab ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-600 hover:underline ml-1 inline-flex items-center gap-0.5">
              <span>View all</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="my-3">
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">No matching orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2.5">Order</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Items</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.slice(0, 5).map((o) => (
                  <tr key={o.id || o._id} className="text-slate-700 hover:bg-slate-50/60 transition">
                    <td className="py-2.5 font-mono font-bold text-slate-900">#{o.id}</td>
                    <td className="py-2.5 font-medium text-slate-900">{o.customerName || "Customer"}</td>
                    <td className="py-2.5 text-slate-500">
                      {o.items?.[0]?.name ? (
                        <span>
                          {o.items[0].name}
                          {o.items[0].portionSize && ` (${o.items[0].portionSize})`}
                          {o.items.length > 1 && ` +${o.items.length - 1} more`}
                        </span>
                      ) : (
                        `${o.items?.length || 1} items`
                      )}
                    </td>
                    <td className="py-2.5 font-bold text-slate-900">₹{o.total}</td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_BADGES[o.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                        <span>{o.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/orders/${o.id}`)}
                        className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                      >
                        <span>Details</span>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverviewPage;