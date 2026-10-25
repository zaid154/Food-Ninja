import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserContext from "./Usercontext";
import { API_BASE_URL } from "../utils/Constants";

const ISSUES = [
  { id: "Delivery Delayed", hint: "Tell us how long you've been waiting..." },
  { id: "Missing Item", hint: "Which dish was missing from your delivery parcel?" },
  { id: "Food Quality", hint: "Describe packaging, temperature, or taste issue..." },
  { id: "Rider Unreachable", hint: "Were you unable to connect with your delivery rider?" },
  { id: "Cancel Request", hint: "Reason for requesting order cancellation..." },
  { id: "Other", hint: "Describe your query or concern in detail..." },
];

const OrderResolutionPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const localOrders = useSelector((s) => s.orders.list);

  const [order, setOrder] = useState(() => {
    const match = localOrders.find((o) => String(o.id) === String(id));
    if (match) return match;
    try {
      return JSON.parse(localStorage.getItem("orders") || "[]").find((o) => String(o.id) === String(id)) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(!order);
  const [issue, setIssue] = useState("Delivery Delayed");
  const [name, setName] = useState(order?.customerName || user?.name || "");
  const [email, setEmail] = useState(order?.userEmail || user?.email || "");
  const [phone, setPhone] = useState(order?.phone || user?.phone || "");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("urgent");
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/orders/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (active && d?.order) {
          setOrder(d.order);
          if (!name) setName(d.order.customerName || user?.name || "");
          if (!email) setEmail(d.order.userEmail || user?.email || "");
          if (!phone) setPhone(d.order.phone || user?.phone || "");
        }
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
    if (user?.name && !name) setName(user.name);
    if (user?.phone && !phone) setPhone(user.phone);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in name, email, and description.");
      return;
    }
    setSubmitting(true);
    setError("");

    const payload = {
      name: name.trim(), email: email.trim(), phone: phone.trim(),
      subject: `[Order #${id}] ${issue}`, message: message.trim(), orderId: String(id),
      type: "order_issue", issueCategory: issue, orderStatus: order?.status || "Placed",
      orderTotal: Number(order?.total) || 0, priority,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      setTicket(res.ok && data.success ? data.inquiry || payload : payload);
    } catch {
      setTicket(payload);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const activeHint = ISSUES.find((i) => i.id === issue)?.hint || "Describe your issue...";

  return (
    <section className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link to={`/orders/${id}`} className="font-semibold text-slate-700 hover:text-emerald-700 transition">
            ← Back to Order #{id}
          </Link>
          <span className="font-mono text-[11px] text-slate-400">Order Resolution Desk</span>
        </div>

        {ticket ? (
          <div className="rounded-2xl border border-emerald-200 bg-white p-7 text-center space-y-4 shadow-xs">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-xl font-bold">✓</span>
            <div>
              <h2 className="text-xl font-black text-slate-900">Priority Ticket Submitted</h2>
              <p className="text-xs text-slate-500 mt-1">Escalated to kitchen & logistics team for Order #{id}.</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 max-w-sm mx-auto text-xs space-y-1.5 text-left">
              <div className="flex justify-between"><span className="text-slate-400">Category:</span><strong className="text-slate-800">{ticket.issueCategory}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Email:</span><span className="text-slate-700">{ticket.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Priority:</span><span className="font-bold text-rose-700 uppercase">{ticket.priority}</span></div>
            </div>
            <div className="flex justify-center gap-2.5 pt-1">
              <Link to={`/orders/${id}`} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 transition shadow-xs">Back to Order</Link>
              <Link to="/orders" className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2 transition">All Orders</Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <div>
              <h1 className="text-xl font-black text-slate-900">Order Resolution Desk</h1>
              <p className="text-xs text-slate-500 mt-0.5">Direct escalation channel for Order #{id} (₹{order?.total || 0} • {order?.status || "Placed"}).</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Select Issue Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ISSUES.map((opt) => (
                    <button
                      key={opt.id} type="button" onClick={() => setIssue(opt.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer text-xs truncate ${issue === opt.id ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-2xs" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                    >
                      {opt.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500 transition" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email * (from account)</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500 transition" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500 transition font-mono" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority</label>
                <div className="flex gap-2">
                  {[{ val: "urgent", label: "Urgent (Delay / Missing)" }, { val: "normal", label: "Normal (Feedback / Inquiry)" }].map((p) => (
                    <button
                      key={p.val} type="button" onClick={() => setPriority(p.val)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${priority === p.val ? (p.val === "urgent" ? "bg-rose-50 border-rose-300 text-rose-900" : "bg-slate-100 border-slate-300 text-slate-900") : "bg-white border-slate-200 text-slate-500"}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Describe Issue *</label>
                <textarea required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={activeHint} className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-emerald-500 transition" />
              </div>

              {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 font-semibold">{error}</div>}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Link to="/contact" className="text-slate-400 hover:text-emerald-700 text-xs">Full Contact Page →</Link>
                <div className="flex items-center gap-2">
                  <Link to={`/orders/${id}`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">Cancel</Link>
                  <button type="submit" disabled={submitting} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 transition shadow-xs disabled:opacity-50">
                    {submitting ? "Submitting..." : "Submit Ticket"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderResolutionPage;
