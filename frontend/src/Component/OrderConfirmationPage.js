import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/Constants";
import { getSavedOrderPricing } from "../utils/orderPricing";

const OrderConfirmationView = ({ order, supportPhone }) => {
  const pricing = getSavedOrderPricing(order);
  const isOnlinePayment = String(order.payment || "").toLowerCase().includes("online");
  const isDemoPayment = String(order.paymentMethod || "").toLowerCase().includes("demo")
    || String(order.razorpayPaymentId || "").startsWith("pay_demo_");
  const paymentStatus = order.paymentStatus || (isOnlinePayment ? "Paid" : "Pending");
  const orderDate = order.date ? new Date(order.date) : new Date();
  const orderTime = Number.isNaN(orderDate.getTime())
    ? "Just now"
    : orderDate.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  const progressSteps = [
    { label: "Placed", key: "placed" },
    { label: "Preparing", key: "preparing" },
    { label: "Out for delivery", key: "out for delivery" },
    { label: "Delivered", key: "delivered" },
  ];
  const status = order.status || "Placed";
  const statusKey = String(status).toLowerCase();
  const isCancelled = statusKey === "cancelled";
  const statusIndex = Math.max(0, progressSteps.findIndex((step) => step.key === statusKey));
  const progressWidth = isCancelled ? 0 : (statusIndex / (progressSteps.length - 1)) * 76;
  const displayMethod = isDemoPayment
    ? "Demo / Test payment"
    : (order.paymentMethod || "Not provided by gateway").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <section className="bg-[#f8fafc] px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-slate-100 px-3 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">Order Confirmation</span>
              <h1 className="mt-1 truncate text-lg font-black text-slate-900 sm:text-xl">Order Confirmed</h1>
              <p className="text-[11px] text-slate-500">Thanks, {order.customerName}. Your order has been placed.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 px-2.5 py-2 sm:gap-2.5">
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-400">Order ID</p>
              <p className="truncate font-mono text-xs font-bold text-slate-900">#{order.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400">Estimated Delivery</p>
              <p className="text-xs font-bold text-slate-900">{order.estDelivery || "25–30 mins"}</p>
            </div>
          </div>
        </header>

        <div className="space-y-2 p-2 sm:space-y-2.5 sm:p-2.5">
            <section className="rounded-xl border border-slate-200 p-2.5">
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Order Status</h2>
                  <p className="text-[10px] text-slate-400">Current kitchen status</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${isCancelled ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {status}
                </span>
              </div>
              <div className="relative flex items-start justify-between px-1">
                <div className="absolute left-[12%] right-[12%] top-3.5 h-0.5 bg-slate-200" />
                <div className="absolute left-[12%] top-3.5 h-0.5 bg-emerald-500" style={{ width: `${progressWidth}%` }} />
                {progressSteps.map((step, index) => {
                  const active = !isCancelled && index <= statusIndex;
                  return (
                  <div key={step.label} className="relative z-10 flex flex-1 flex-col items-center text-center">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${active ? "bg-emerald-500 text-white" : "border border-slate-200 bg-white text-slate-400"}`}>
                      {active ? "✓" : index + 1}
                    </span>
                    <span className={`mt-1 text-[9px] font-semibold sm:text-[10px] ${active ? "text-emerald-700" : "text-slate-400"}`}>{step.label}</span>
                    {index === 0 && <span className="text-[9px] text-slate-400">{orderTime}</span>}
                  </div>
                  );
                })}
              </div>
              {isCancelled && <p className="mt-2 text-[10px] font-semibold text-rose-700">This order has been cancelled.</p>}
            </section>

          <div className="grid items-start gap-2 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-200 p-2">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="18" rx="2" />
                    <path d="M8 7h8M8 11h4M8 15h6" />
                  </svg>
                </span>
                <h2 className="text-sm font-bold text-slate-900">Payment Summary</h2>
              </div>
              <div className="space-y-1 text-[11px] leading-4">
                <div className="flex justify-between text-slate-600"><span>Item Subtotal</span><span className="font-semibold text-slate-800">₹{pricing.subtotal}</span></div>
                <div className="flex justify-between text-slate-600"><span>Delivery Fee</span><span className="font-semibold text-slate-800">{pricing.deliveryFee === 0 ? "FREE" : `₹${pricing.deliveryFee}`}</span></div>
                {pricing.hasCompleteBreakdown ? (
                  <>
                    <div className="flex justify-between text-slate-600"><span>Packaging / Handling</span><span className="font-semibold text-slate-800">₹{pricing.packagingFee}</span></div>
                    <div className="flex justify-between text-slate-600"><span>GST</span><span className="font-semibold text-slate-800">₹{pricing.taxes}</span></div>
                    <div className="flex justify-between text-slate-600"><span>Discount</span><span className="font-semibold text-emerald-700">−₹{pricing.discountAmount}</span></div>
                  </>
                ) : (
                  <p className="rounded-lg bg-amber-50 px-2.5 py-2 text-[10px] leading-relaxed text-amber-800">This older order does not have a complete saved fee breakdown. The recorded total is shown below.</p>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-1.5 text-xs font-black text-slate-900"><span>Grand Total</span><span>₹{pricing.grandTotal}</span></div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 p-2">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-slate-900">Payment Details</h2>
                {isDemoPayment && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-800">Demo / Test</span>}
              </div>
              <dl className="space-y-1 text-[11px] leading-4">
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Mode</dt><dd className="text-right font-semibold text-slate-800">{order.payment || "Cash on Delivery"}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500">Status</dt><dd className={`text-right font-bold ${String(paymentStatus).toLowerCase() === "paid" ? "text-emerald-700" : "text-amber-700"}`}>{isDemoPayment ? "Paid (Demo/Test)" : paymentStatus}</dd></div>
                {isOnlinePayment ? (
                  <>
                    <div className="flex justify-between gap-3"><dt className="shrink-0 text-slate-500">Method</dt><dd className="break-all text-right font-semibold text-slate-800">{displayMethod}</dd></div>
                    <div className="border-t border-slate-100 pt-2"><dt className="text-[10px] text-slate-500">Payment ID</dt><dd className="mt-0.5 break-all font-mono text-[10px] font-semibold text-slate-800">{order.razorpayPaymentId || "Not available"}</dd></div>
                    <div><dt className="text-[10px] text-slate-500">Gateway Order ID</dt><dd className="mt-0.5 break-all font-mono text-[10px] font-semibold text-slate-800">{order.razorpayOrderId || "Not available"}</dd></div>
                  </>
                ) : (
                  <div className="rounded-lg bg-amber-50 px-2.5 py-1.5 font-semibold text-amber-900">Collect ₹{pricing.grandTotal} on delivery</div>
                )}
              </dl>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 border-t border-slate-100 px-2.5 py-2.5 sm:grid-cols-2 sm:px-3">
          <Link
            to={`/orders/${order.id}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0c5936] py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#084227] active:scale-[0.98]"
          >
            <span>Track Order</span><span aria-hidden="true">→</span>
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-slate-100 bg-slate-50/50 px-2.5 py-1.5 text-[10px] text-slate-500">
          <span className="font-medium">Need help? Contact support</span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-700">+91 {supportPhone || "9876543210"}</span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-700">support@foodninja.in</span>
        </footer>
      </div>
    </section>
  );
};

const findLocalOrder = (id, orders) => {
  const reduxOrder = orders.find((item) => String(item.id) === String(id));
  if (reduxOrder) return reduxOrder;

  try {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    return savedOrders.find((item) => String(item.id) === String(id)) || null;
  } catch {
    return null;
  }
};

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const localOrders = useSelector((store) => store.orders.list);
  const routeOrder = location.state?.order;
  const initialOrder = routeOrder && String(routeOrder.id) === String(id)
    ? routeOrder
    : findLocalOrder(id, localOrders);
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const supportPhone = location.state?.supportPhone || "";

  useEffect(() => {
    let isMounted = true;

    const loadConfirmation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`);
        const result = response.ok ? await response.json().catch(() => ({})) : {};
        if (isMounted && result.order) setOrder(result.order);
      } catch {
        // Use the order passed through navigation or stored locally when offline.
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadConfirmation();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-[50vh] bg-slate-50 px-3 py-6 sm:px-4">
        <div className="mx-auto max-w-4xl animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="mt-4 h-24 rounded-xl bg-slate-100" />
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-4 py-8">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">Order confirmation not found</h1>
          <p className="mt-2 text-sm text-slate-500">This order may not be available on this device.</p>
          <Link to="/orders" className="mt-4 inline-flex rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white">
            View My Orders
          </Link>
        </div>
      </section>
    );
  }

  return <OrderConfirmationView order={order} supportPhone={supportPhone} />;
};

export default OrderConfirmationPage;
