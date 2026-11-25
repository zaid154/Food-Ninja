import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import OrderInvoiceModal from "./OrderInvoiceModal";
import AdminDropdown from "./AdminDropdown";

const STATUSES = ["All", "Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
const ORDER_STATUS_OPTIONS = STATUSES.filter((status) => status !== "All").map((status) => ({ value: status, label: status }));
const DATE_FILTERS = ["Today", "Yesterday", "Older", "All Dates"];

const getOrderDate = (order) => {
  const createdAt = order.createdAt ? new Date(order.createdAt) : null;
  if (createdAt && !Number.isNaN(createdAt.getTime())) return createdAt;
  const orderDate = order.date ? new Date(order.date) : null;
  return orderDate && !Number.isNaN(orderDate.getTime()) ? orderDate : null;
};

const getDateKey = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateBucket = (order, todayKey, yesterdayKey) => {
  const key = getDateKey(getOrderDate(order));
  if (key === todayKey) return "Today";
  if (key === yesterdayKey) return "Yesterday";
  return "Older";
};

const formatOrderDate = (order) => {
  const date = getOrderDate(order);
  return date
    ? date.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })
    : order.date || "Date unavailable";
};

const AdminOrdersPage = (props) => {
  const context = useOutletContext() || {};
  const orders = props.orders || context.orders || [];
  const inquiries = props.inquiries || context.inquiries || [];
  const onUpdateStatus = props.onUpdateStatus || context.handleUpdateOrderStatus;

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [activeInvoiceMode, setActiveInvoiceMode] = useState("kot");

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const todayKey = getDateKey(today);
  const yesterdayKey = getDateKey(yesterday);

  const matchesDateFilter = (order, filter = selectedDate) =>
    filter === "All Dates" || getDateBucket(order, todayKey, yesterdayKey) === filter;

  const filteredOrders = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      String(o.id).includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.phone && o.phone.includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q));

    const matchesStatus = selectedStatus === "All" || o.status === selectedStatus;
    return matchesSearch && matchesStatus && matchesDateFilter(o);
  }).sort((a, b) => (getOrderDate(b)?.getTime() || Number(b.id) || 0) - (getOrderDate(a)?.getTime() || Number(a.id) || 0));

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisibleOrder = filteredOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleOrder = Math.min(currentPage * pageSize, filteredOrders.length);
  const dateOptions = DATE_FILTERS.map((filter) => ({
    value: filter,
    label: filter === "All Dates" ? "All dates" : filter === "Older" ? "Older orders" : filter,
    count: filter === "All Dates"
      ? orders.length
      : orders.filter((order) => getDateBucket(order, todayKey, yesterdayKey) === filter).length,
  }));
  const statusOptions = STATUSES.map((status) => ({
    value: status,
    label: status === "All" ? "All statuses" : status,
    count: orders.filter((order) => matchesDateFilter(order) && (status === "All" || order.status === status)).length,
  }));

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Orders</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
              {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Recent orders first · Use the date filter to find a previous day</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 xl:w-[700px]">
          <AdminDropdown
            label="DATE"
            value={selectedDate}
            options={dateOptions}
            onChange={(value) => { setSelectedDate(value); setPage(1); }}
          />

          <AdminDropdown
            label="STATUS"
            value={selectedStatus}
            options={statusOptions}
            onChange={(value) => { setSelectedStatus(value); setPage(1); }}
          />

          <label className="block text-[10px] font-bold text-slate-500">
            SEARCH
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="ID, customer, phone..."
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
            />
          </label>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-xs text-slate-500">
            {selectedDate === "Today" && orders.length > 0 && !search && selectedStatus === "All"
              ? "No orders have been placed today yet."
              : "No orders found for these filters."}
          </p>
          {selectedDate !== "All Dates" && orders.some((order) => getDateBucket(order, todayKey, yesterdayKey) !== selectedDate) && (
            <button
              type="button"
              onClick={() => { setSelectedDate("All Dates"); setPage(1); }}
              className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
            >
              Show all dates
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3 min-w-[130px]">Order & Date</th>
                <th className="pb-3 min-w-[240px]">Customer & Delivery Address</th>
                <th className="pb-3 min-w-[180px]">Ordered Items</th>
                <th className="pb-3 min-w-[110px]">Total & Payment</th>
                <th className="pb-3 text-right min-w-[150px] pr-2">Update Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleOrders.map((o) => {
                const unresolvedIssue = (inquiries || []).find(
                  (i) => String(i.orderId) === String(o.id) && !i.isResolved
                );
                const dateBucket = getDateBucket(o, todayKey, yesterdayKey);

                return (
                  <tr key={o.id} className="text-slate-700 hover:bg-slate-50/50 transition">
                    <td className="py-3.5 align-top">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <a
                          href={`/orders/${o.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 font-mono text-[10px] font-bold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
                          title="View live order details"
                        >
                          <span>#{o.id}</span>
                          <svg className="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <path d="M6 3h7v7M13 3 6.5 9.5M11 9v4H3V5h4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          dateBucket === "Today"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : dateBucket === "Yesterday"
                              ? "border-violet-200 bg-violet-50 text-violet-800"
                              : "border-slate-200 bg-slate-100 text-slate-600"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            dateBucket === "Today" ? "bg-emerald-600" : dateBucket === "Yesterday" ? "bg-violet-600" : "bg-slate-500"
                          }`} />
                          {dateBucket === "Older" && getOrderDate(o)
                            ? getOrderDate(o).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : dateBucket}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{formatOrderDate(o)}</p>
                      {unresolvedIssue && (
                        <div className="mt-1.5">
                          <a
                            href="/admin/inquiries"
                            className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-300 px-2 py-0.5 text-[10px] font-bold text-rose-800 hover:bg-rose-100 transition shadow-2xs"
                            title={`Customer help requested: ${unresolvedIssue.message}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                            <span>Help Requested</span>
                          </a>
                        </div>
                      )}
                    </td>
                  <td className="py-3.5 align-top max-w-[280px]">
                    <p className="font-bold text-slate-900">{o.customerName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">+91 {o.phone}</p>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed break-words font-medium">
                      {o.address}
                    </p>
                  </td>
                  <td className="py-3.5 align-top">
                    <ul className="space-y-1 text-[11px]">
                      {o.items?.map((it, idx) => (
                        <li key={idx} className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-slate-800">{it.name || it.title}</span>
                          {it.portionSize && (
                            <span className="inline-flex items-center rounded border border-amber-200 bg-amber-50 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                              {it.portionSize.includes("Plate") ? it.portionSize : `${it.portionSize} Plate`}
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1 rounded">
                            x{it.quantity || 1}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3.5 align-top">
                    <p className="font-black text-slate-900 text-sm">₹{o.total}</p>
                    <p className="text-[10px] text-slate-400">{o.payment}</p>
                  </td>
                  <td className="py-3.5 align-top text-right space-y-1.5">
                    <AdminDropdown
                      label={null}
                      value={o.status}
                      options={ORDER_STATUS_OPTIONS}
                      onChange={(status) => onUpdateStatus(o.id, status)}
                      compact
                      portal
                      triggerClassName={`ml-auto w-full max-w-[140px] shadow-2xs ${
                        o.status === "Delivered"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : o.status === "Cancelled"
                            ? "border-red-300 bg-red-50 text-red-800"
                            : o.status === "Out for Delivery"
                              ? "border-blue-300 bg-blue-50 text-blue-800"
                              : o.status === "Preparing"
                                ? "border-amber-300 bg-amber-50 text-amber-800"
                                : "border-slate-300 bg-white text-slate-800"
                      }`}
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => { setActiveInvoiceMode("bill"); setActiveInvoiceOrder(o); }}
                        className="w-full max-w-[140px] inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/80 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-800 shadow-2xs transition cursor-pointer group"
                        title="View and print customer bill or kitchen order ticket (KOT)"
                      >
                        <svg
                          className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 transition"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Bill / KOT</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )}

      {filteredOrders.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-medium text-slate-500">
            Showing <span className="font-bold text-slate-700">{firstVisibleOrder}–{lastVisibleOrder}</span> of {filteredOrders.length} orders
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="min-w-[76px] rounded-lg bg-slate-50 px-2.5 py-1.5 text-center text-[11px] font-bold text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {activeInvoiceOrder && (
        <OrderInvoiceModal
          order={activeInvoiceOrder}
          initialMode={activeInvoiceMode}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
