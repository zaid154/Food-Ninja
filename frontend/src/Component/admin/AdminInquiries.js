import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const AdminInquiries = (props) => {
  const context = useOutletContext() || {};
  const inquiries = props.inquiries || context.inquiries || [];
  const onDeleteInquiry = props.onDeleteInquiry || context.handleDeleteInquiry;
  const onReplyInquiry = props.onReplyInquiry || context.handleReplyInquiry;

  const [activeInquiry, setActiveInquiry] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpenReplyModal = (inq) => {
    setActiveInquiry(inq);
    setReplyText(
      inq.replyMessage ||
        `Hi ${inq.name},\n\nThank you for contacting Food Ninja regarding "${inq.subject || "your inquiry"}".\n\n`
    );
  };

  const handleCloseModal = () => {
    setActiveInquiry(null);
    setReplyText("");
    setSubmitting(false);
  };

  const handleSendInAppReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      alert("Please enter a reply message.");
      return;
    }
    if (!onReplyInquiry) {
      alert("Reply handler not found.");
      return;
    }

    try {
      setSubmitting(true);
      const success = await onReplyInquiry(activeInquiry._id || activeInquiry.id, replyText.trim());
      if (success) {
        handleCloseModal();
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getGmailUrl = (inq, text) => {
    const to = encodeURIComponent(inq.email);
    const su = encodeURIComponent(`Re: ${inq.subject || "Your Food Ninja Inquiry"}`);
    const body = encodeURIComponent(text || `Hi ${inq.name},\n\n`);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`;
  };

  const getMailtoUrl = (inq, text) => {
    const to = encodeURIComponent(inq.email);
    const su = encodeURIComponent(`Re: ${inq.subject || "Your Food Ninja Inquiry"}`);
    const body = encodeURIComponent(text || `Hi ${inq.name},\n\n`);
    return `mailto:${to}?subject=${su}&body=${body}`;
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Customer Inquiries & Messages ({inquiries.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Customer feedback & support requests submitted via the Contact page
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No customer inquiries yet. Messages sent via /contact will appear here.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3 min-w-[150px]">Customer</th>
                <th className="pb-3 min-w-[120px]">Subject</th>
                <th className="pb-3 min-w-[240px]">Customer Message</th>
                <th className="pb-3 min-w-[100px]">Status</th>
                <th className="pb-3 min-w-[90px]">Date</th>
                <th className="pb-3 text-right min-w-[120px] pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((inq) => {
                const isReplied = inq.status === "Replied" || Boolean(inq.replyMessage);
                return (
                  <tr key={inq._id || inq.id} className="text-slate-700 hover:bg-slate-50/50 transition">
                    {/* Customer */}
                    <td className="py-3.5 align-top">
                      <p className="font-semibold text-slate-900">{inq.name}</p>
                      <a
                        href={`mailto:${inq.email}`}
                        className="text-[11px] text-slate-500 hover:text-emerald-700 font-mono transition"
                      >
                        {inq.email}
                      </a>
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 align-top">
                      <span className="inline-block rounded-md bg-slate-100 border border-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {inq.subject || "General Inquiry"}
                      </span>
                    </td>

                    {/* Message + Recorded Reply */}
                    <td className="py-3.5 align-top max-w-sm">
                      <p className="text-slate-800 text-xs leading-relaxed break-words font-medium">
                        {inq.message}
                      </p>
                      {inq.replyMessage && (
                        <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200/80 p-2.5 text-[11px] text-emerald-900">
                          <p className="font-semibold text-emerald-800 flex items-center gap-1">
                            <span>✓ Admin Reply:</span>
                            {inq.repliedAt && (
                              <span className="text-[10px] text-emerald-600 font-normal">
                                ({new Date(inq.repliedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })})
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 whitespace-pre-wrap">{inq.replyMessage}</p>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 align-top">
                      {isReplied ? (
                        <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                          ● Replied
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                          ● New
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 align-top text-[11px] text-slate-400 whitespace-nowrap">
                      {inq.createdAt
                        ? new Date(inq.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "Recent"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenReplyModal(inq)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition"
                          title="Compose reply to customer"
                        >
                          {isReplied ? "Edit Reply" : "Reply"}
                        </button>

                        {onDeleteInquiry && (
                          <button
                            type="button"
                            onClick={() => onDeleteInquiry(inq._id || inq.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                            title="Delete message"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Interactive Reply Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reply to Customer</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  To: <span className="font-semibold text-slate-800">{activeInquiry.name}</span> ({activeInquiry.email})
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            {/* Customer Inquiry Summary Box */}
            <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-xs space-y-1">
              <p className="font-semibold text-slate-800">
                Subject: <span className="font-normal text-slate-600">{activeInquiry.subject || "General Inquiry"}</span>
              </p>
              <p className="text-slate-600 leading-relaxed italic">
                "{activeInquiry.message}"
              </p>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendInAppReply} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Response Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-xs outline-none focus:border-emerald-500 transition leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                {/* External Mail Links */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={getGmailUrl(activeInquiry, replyText)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                    title="Open compose window directly in Gmail Web"
                  >
                    <span>Send via Gmail Web</span>
                    <span className="text-slate-400">↗</span>
                  </a>

                  <a
                    href={getMailtoUrl(activeInquiry, replyText)}
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline"
                    title="Open default system mail client"
                  >
                    Mail App
                  </a>
                </div>

                {/* Primary In-App Record Button & Cancel */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    {submitting ? "Saving Reply..." : "Save & Mark Replied"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
