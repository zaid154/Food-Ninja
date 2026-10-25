import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";
import { useAppDialog } from "../AppDialog";

const InquiryActions = ({ email, phone, subject, id, onDelete }) => (
  <div className="flex items-center justify-end gap-1.5">
    <a
      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
      title="Reply via Gmail"
    >
      <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span>Mail</span>
    </a>

    {phone && (
      <a href={`tel:${phone}`} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100" title={`Call ${phone}`}>
        <svg className="h-3 w-3 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span>Call</span>
      </a>
    )}

    {onDelete && (
      <button type="button" onClick={() => onDelete(id)} className="inline-flex items-center justify-center h-6 w-6 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer" title="Delete inquiry">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    )}
  </div>
);

const AdminInquiriesPage = (props) => {
  const context = useOutletContext() || {};
  const { alert: showDialog } = useAppDialog();
  const inquiries = props.inquiries || context.inquiries || [];
  const onRefresh = props.onRefresh || context.fetchData;
  const onDeleteInquiry = props.onDeleteInquiry || context.handleDeleteInquiry;
  const showToast = props.showToast || context.showToast || showDialog;

  const [activeTab, setActiveTab] = useState("order_issues");
  const [filterState, setFilterState] = useState("all");

  const orderIssues = inquiries.filter((inq) => inq.type === "order_issue" || (inq.orderId && String(inq.orderId).trim() !== ""));
  const generalInquiries = inquiries.filter((inq) => inq.type !== "order_issue" && (!inq.orderId || String(inq.orderId).trim() === ""));
  const unresolvedOrderIssuesCount = orderIssues.filter((i) => !i.isResolved).length;

  const handleToggleResolve = async (inquiryId, currentResolved) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact/${inquiryId}/resolve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isResolved: !currentResolved }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Ticket marked as ${!currentResolved ? "Resolved" : "Open"}`);
        if (onRefresh) onRefresh();
      } else {
        showDialog(data.message || "Failed to update ticket status.", { title: "Update failed", variant: "error" });
      }
    } catch {
      showDialog("Could not connect to the server. Please try again.", { title: "Connection error", variant: "error" });
    }
  };

  const currentList = activeTab === "order_issues" ? orderIssues : generalInquiries;
  const filteredList = currentList.filter((inq) => {
    if (filterState === "open") return !inq.isResolved;
    if (filterState === "resolved") return inq.isResolved;
    return true;
  });

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Customer Inquiries & Order Resolution Desk</h2>
          <p className="text-xs text-slate-400 mt-0.5">Resolve live order issues directly or reply to general customer messages</p>
        </div>
        {unresolvedOrderIssuesCount > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-800">
            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
            <span>{unresolvedOrderIssuesCount} Urgent Order Issue{unresolvedOrderIssuesCount > 1 ? "s" : ""} Pending</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: "order_issues", label: "Live Order Issues", count: orderIssues.length, badgeBg: "bg-rose-500" },
            { id: "general", label: "General Inquiries", count: generalInquiries.length, badgeBg: "bg-emerald-600" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  isActive ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? `${tab.badgeBg} text-white` : "bg-slate-200 text-slate-700"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 text-[11px]">Filter:</span>
          {["all", "open", "resolved"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterState(st)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition cursor-pointer ${
                filterState === st ? "bg-slate-200 text-slate-900 font-bold" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 space-y-2">
          <p>{activeTab === "order_issues" ? "No order issues reported. When customers request help on /orders/:id, tickets appear here." : "No general customer inquiries found."}</p>
        </div>
      ) : activeTab === "order_issues" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3 min-w-[150px]">Order & Customer</th>
                <th className="pb-3 min-w-[130px]">Issue & Priority</th>
                <th className="pb-3 min-w-[260px]">Customer Message</th>
                <th className="pb-3 min-w-[110px]">Resolution</th>
                <th className="pb-3 text-right pr-2 min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((inq) => {
                const phone = inq.phone?.trim() || "";
                const isUrgent = inq.priority === "urgent" || inq.priority === "high";

                return (
                  <tr key={inq._id || inq.id} className={`transition ${inq.isResolved ? "bg-slate-50/40 text-slate-500" : "hover:bg-slate-50/70 text-slate-800"}`}>
                    <td className="py-3.5 align-top">
                      {inq.orderId ? (
                        <Link to={`/orders/${inq.orderId}`} target="_blank" className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1">
                          <span>Order #{inq.orderId}</span>
                          <span className="text-[10px]">↗</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Unlinked Order</span>
                      )}
                      <p className="font-bold text-slate-900 mt-1">{inq.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{inq.email}</p>
                      {phone && <p className="text-[11px] text-emerald-700 font-mono mt-0.5">{phone}</p>}
                    </td>

                    <td className="py-3.5 align-top space-y-1.5">
                      <span className="inline-block rounded-md bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-800">
                        {inq.issueCategory || inq.subject || "Order Issue"}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isUrgent ? "bg-rose-100 text-rose-800 border border-rose-200" : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {isUrgent && <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />}
                          <span>{inq.priority || "NORMAL"}</span>
                        </span>
                      </div>
                      {inq.orderStatus && (
                        <p className="text-[10px] text-slate-400">At stage: <span className="font-semibold text-slate-600">{inq.orderStatus}</span></p>
                      )}
                    </td>

                    <td className="py-3.5 align-top max-w-sm">
                      <p className="text-slate-800 text-xs leading-relaxed break-words font-medium">{inq.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Received: {inq.createdAt ? new Date(inq.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Recent"}
                      </p>
                    </td>

                    <td className="py-3.5 align-top whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleResolve(inq._id || inq.id, inq.isResolved)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer border ${
                          inq.isResolved ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                        }`}
                        title="Click to toggle resolution state"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${inq.isResolved ? "bg-emerald-600" : "bg-amber-600"}`} />
                        <span>{inq.isResolved ? "Resolved" : "Open / Active"}</span>
                      </button>
                    </td>

                    <td className="py-3.5 align-top text-right whitespace-nowrap">
                      <InquiryActions
                        email={inq.email}
                        phone={phone}
                        subject={`[Food Ninja] Regarding Order #${inq.orderId || ""} Issue: ${inq.issueCategory || inq.subject || ""}`}
                        id={inq._id || inq.id}
                        onDelete={onDeleteInquiry}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3 min-w-[150px]">Customer</th>
                <th className="pb-3 min-w-[110px]">Subject</th>
                <th className="pb-3 min-w-[260px]">Customer Message</th>
                <th className="pb-3 min-w-[90px]">Date</th>
                <th className="pb-3 text-right pr-2 min-w-[140px]">Contact Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((inq) => {
                const phone = inq.phone?.trim() || "";
                return (
                  <tr key={inq._id || inq.id} className="text-slate-700 hover:bg-slate-50/50 transition">
                    <td className="py-3.5 align-top">
                      <p className="font-semibold text-slate-900">{inq.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{inq.email}</p>
                      {phone && <p className="text-[11px] text-emerald-700 font-mono mt-0.5">{phone}</p>}
                    </td>
                    <td className="py-3.5 align-top">
                      <span className="inline-block rounded bg-slate-100 border border-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {inq.subject || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 align-top max-w-sm">
                      <p className="text-slate-800 text-xs leading-relaxed break-words font-medium">{inq.message}</p>
                    </td>
                    <td className="py-3.5 align-top text-[11px] text-slate-400 whitespace-nowrap">
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Recent"}
                    </td>
                    <td className="py-3.5 align-top text-right whitespace-nowrap">
                      <InquiryActions
                        email={inq.email}
                        phone={phone}
                        subject={`Re: ${inq.subject || "Your Food Ninja Inquiry"}`}
                        id={inq._id || inq.id}
                        onDelete={onDeleteInquiry}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInquiriesPage;
