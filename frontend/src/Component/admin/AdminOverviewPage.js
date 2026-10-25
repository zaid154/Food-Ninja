import { useNavigate, useOutletContext } from "react-router-dom";

const getStatusBadge = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "Out for Delivery":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "Preparing":
      return "bg-amber-50 text-amber-800 border-amber-200";
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
  const navigate = useNavigate();

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status !== "Cancelled" ? o.total || 0 : 0),
    0
  );

  const pendingOrders = orders.filter(
    (o) => o.status === "Placed" || o.status === "Preparing" || o.status === "Out for Delivery"
  ).length;

  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="space-y-6">
      {/* 6 Professional Metric & Module Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">{deliveredCount} delivered orders</p>
          </div>
        </div>

        {/* Live Orders Card */}
        <div
          onClick={() => navigate("/admin/orders")}
          className="cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between transition hover:border-slate-300 hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Orders</span>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition">
              Manage →
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900">{orders.length}</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">{pendingOrders} active in progress</p>
          </div>
        </div>

        {/* Food Dishes Card */}
        <div
          onClick={() => navigate("/admin/foods")}
          className="cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between transition hover:border-slate-300 hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Food Dishes</span>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition">
              Edit Menu →
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900">{foods.length}</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">Active in online catalog</p>
          </div>
        </div>

        {/* Categories Card */}
        <div
          onClick={() => navigate("/admin/categories")}
          className="cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between transition hover:border-slate-300 hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</span>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition">
              Create & Style →
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900">{categories.length}</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">Menu sections & palettes</p>
          </div>
        </div>

        {/* Store Settings & Charges Card */}
        <div
          onClick={() => navigate("/admin/settings")}
          className="cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between transition hover:border-slate-300 hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Store Charges</span>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition">
              Configure →
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900">Delivery & Fees</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">Free delivery thresholds</p>
          </div>
        </div>

        {/* Customer Messages Card */}
        <div
          onClick={() => navigate("/admin/inquiries")}
          className="cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between transition hover:border-slate-300 hover:shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inquiries</span>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition">
              View →
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900">{inquiries.length}</p>
            <p className="mt-1 text-xs text-slate-400 font-medium">From contact form</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview Card */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live orders placed by store customers</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
          >
            View all orders →
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No customer orders placed yet.
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((o) => {
                  const badgeClass = getStatusBadge(o.status);
                  return (
                    <tr key={o.id} className="text-slate-700 hover:bg-slate-50/50 transition">
                      <td className="py-3 font-mono font-semibold text-slate-800">#{o.id}</td>
                      <td className="py-3 font-medium text-slate-900">{o.customerName}</td>
                      <td className="py-3 text-slate-500">{o.items?.length || 1} items</td>
                      <td className="py-3 font-bold text-slate-900">₹{o.total}</td>
                      <td className="py-3">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 font-semibold text-[10px] ${badgeClass}`}>
                          ● {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/orders/${o.id}`)}
                          className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                        >
                          View Details →
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
    </div>
  );
};

export default AdminOverviewPage;
