import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import OrderInvoiceModal from "./OrderInvoiceModal";

const STATUSES = ["All", "Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const AdminOrders = (props) => {
  const context = useOutletContext() || {};
  const orders = props.orders || context.orders || [];
  const inquiries = props.inquiries || context.inquiries || [];
  const onUpdateStatus = props.onUpdateStatus || context.handleUpdateOrderStatus;

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  const filteredOrders = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      String(o.id).includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.phone && o.phone.includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q));

    const matchesStatus = selectedStatus === "All" || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Customer Orders & Live Delivery Updater ({filteredOrders.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Change order status live to update customer delivery progress
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, name, phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          <svg className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {STATUSES.map((st) => {
          const count = st === "All" ? orders.length : orders.filter((o) => o.status === st).length;
          const isActive = selectedStatus === st;
          return (
            <button
              type="button"
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              <span>{st}</span>
              <span className={`ml-1.5 text-[10px] font-bold ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500">
          No orders found matching your search or selected status.
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
              {filteredOrders.map((o) => {
                const unresolvedIssue = (inquiries || []).find(
                  (i) => String(i.orderId) === String(o.id) && !i.isResolved
                );

                return (
                  <tr key={o.id} className="text-slate-700 hover:bg-slate-50/50 transition">
                    <td className="py-3.5 align-top">
                      <a
                        href={`/orders/${o.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono font-bold text-emerald-700 hover:underline"
                        title="View live order details"
                      >
                        #{o.id} ↗
                      </a>
                      <p className="text-[11px] text-slate-400 mt-0.5">{o.date}</p>
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
                    <ul className="space-y-0.5 text-[11px]">
                      {o.items?.map((it, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800">{it.name || it.title}</span>
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
                    <select
                      value={o.status}
                      onChange={(e) => onUpdateStatus(o.id, e.target.value)}
                      className={`rounded-lg border px-2.5 py-1.5 font-bold text-xs outline-none shadow-2xs transition ${
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
                    >
                      <option value="Placed">● Placed</option>
                      <option value="Preparing">● Preparing</option>
                      <option value="Out for Delivery">● Out for Delivery</option>
                      <option value="Delivered">● Delivered</option>
                      <option value="Cancelled">● Cancelled</option>
                    </select>

                    <div>
                      <button
                        type="button"
                        onClick={() => setActiveInvoiceOrder(o)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
                        title="Print Kitchen Order Ticket / Invoice"
                      >
                        <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Print KOT</span>
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

      {/* Printable Invoice / Kitchen Order Ticket Modal */}
      {activeInvoiceOrder && (
        <OrderInvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

export default AdminOrders;
