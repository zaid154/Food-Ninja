import { useState, useMemo } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

const STATUS_BADGES = {
  Delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Out for Delivery": "bg-sky-50 text-sky-800 border-sky-200",
  Preparing: "bg-amber-50 text-amber-800 border-amber-200",
  Cancelled: "bg-rose-50 text-rose-800 border-rose-200",
  Placed: "bg-purple-50 text-purple-800 border-purple-200",
};

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
    { label: "Total Revenue", val: `₹${totalRevenue.toLocaleString("en-IN")}`, sub: `${deliveredCount} delivered orders`, to: "/admin/orders", icon: "₹", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { label: "Live Orders", val: orders.length, sub: `${pendingCount} active in progress`, to: "/admin/orders", icon: "📦", color: "text-sky-700 bg-sky-50 border-sky-200" },
    { label: "Food Dishes", val: foods.length, sub: "Active catalog dishes", to: "/admin/foods", icon: "🍲", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { label: "Categories", val: categories.length, sub: "Menu themes & presets", to: "/admin/categories", icon: "📂", color: "text-purple-700 bg-purple-50 border-purple-200" },
    { label: "Customer Inquiries", val: inquiries.length, sub: "Feedback & support", to: "/admin/inquiries", icon: "💬", color: "text-rose-700 bg-rose-50 border-rose-200" },
    { label: "Store Settings", val: "Charges & Hours", sub: "Delivery fee & timings", to: "/admin/settings", icon: "⚙️", color: "text-slate-700 bg-slate-50 border-slate-200" },
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
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 transition shadow-xs"
          >
            + Add Dish
          </Link>
          <Link
            to="/"
            target="_blank"
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3 py-2 transition"
          >
            Storefront ↗
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            onClick={() => navigate(c.to)}
            className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-sm transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{c.label}</span>
              <span className={`h-8 w-8 rounded-lg border flex items-center justify-center text-xs font-bold ${c.color}`}>
                {c.icon}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{c.val}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>{c.sub}</span>
              <span className="text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition">Manage →</span>
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
            <Link to="/admin/orders" className="text-xs font-bold text-emerald-600 hover:underline ml-1">
              View all →
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
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGES[o.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        ● {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/orders/${o.id}`)}
                        className="text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        Details →
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