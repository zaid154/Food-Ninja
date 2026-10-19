import React from "react";
import { useOutletContext } from "react-router-dom";

const AdminInquiries = (props) => {
  const context = useOutletContext() || {};
  const inquiries = props.inquiries || context.inquiries || [];
  const onDeleteInquiry = props.onDeleteInquiry || context.handleDeleteInquiry;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Customer Inquiries & Feedback ({inquiries.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Messages submitted via the Contact page.
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-xs font-semibold text-slate-500">
            No customer inquiries yet. Messages sent via /contact will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Message</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((inq) => (
                <tr key={inq._id || inq.id} className="text-slate-700 hover:bg-slate-50/50 transition">
                  <td className="py-3.5 align-top">
                    <p className="font-bold text-slate-900">{inq.name}</p>
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || "Your Inquiry")}`}
                      className="text-[11px] text-emerald-600 hover:underline"
                    >
                      {inq.email}
                    </a>
                  </td>
                  <td className="py-3.5 align-top">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                      {inq.subject || "General"}
                    </span>
                  </td>
                  <td className="py-3.5 align-top max-w-xs">
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {inq.message}
                    </p>
                  </td>
                  <td className="py-3.5 align-top text-[11px] text-slate-400 whitespace-nowrap">
                    {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                  </td>
                  <td className="py-3.5 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || "Your Inquiry")}`}
                        className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        Reply
                      </a>
                      {onDeleteInquiry && (
                        <button
                          type="button"
                          onClick={() => onDeleteInquiry(inq._id || inq.id)}
                          className="rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
