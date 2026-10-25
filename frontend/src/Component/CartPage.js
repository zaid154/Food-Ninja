import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, clearCart, removeCart } from "../utils/cartSlice";
import { API_BASE_URL } from "../utils/Constants";
import { getClosedStoreNotice } from "../utils/storeNotices";
import { calculateOrderPricing } from "../utils/orderPricing";

const CartPage = () => {
  const cartItems = useSelector((store) => store.cart.item);
  const dispatch = useDispatch();

  const [settings, setSettings] = useState({
    deliveryFee: 30,
    freeDeliveryThreshold: 499,
    packagingFee: 15,
    taxRate: 5,
    restaurantOpen: true,
    minOrderValue: 99,
    operatingHoursText: "6:00 AM – 8:00 PM",
  });

  useEffect(() => {
    const refreshSettings = () => {
      if (typeof fetch === "undefined") return;
      fetch(`${API_BASE_URL}/settings`)
        .then((r) => r.json())
        .then((d) => {
          if (d && d.settings) setSettings(d.settings);
        })
        .catch(() => {});
    };
    refreshSettings();
    const interval = setInterval(refreshSettings, 60_000);
    return () => clearInterval(interval);
  }, []);

  const pricing = calculateOrderPricing({ items: cartItems, settings });
  const {
    itemCount: totalItems,
    subtotal: totalAmount,
    isFreeDelivery,
    deliveryFee,
    packagingFee,
    taxRate,
    taxes,
    discountAmount,
    grandTotal,
  } = pricing;

  const isStoreClosed = settings.isEffectiveOpen === false || settings.restaurantOpen === false;
  const isBelowMinOrder = totalAmount < (settings.minOrderValue || 0);
  const canCheckout = !isStoreClosed && !isBelowMinOrder;

  if (totalItems === 0) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="mt-2 text-xl font-black text-slate-900">Your Cart is Empty</h1>
          <p className="mt-1 text-xs text-slate-500">
            Looks like you haven't added any delicious food dishes yet.
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-emerald-700 shadow-sm"
            >
              Explore Food Menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50/70 px-4 py-5 sm:py-7 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold border border-emerald-200">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>+ Add More Dishes</span>
            </Link>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition flex items-center gap-1 cursor-pointer"
              title="Remove all items from cart"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
            <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/70 px-4 py-2 text-xs flex items-center justify-between gap-2 shadow-2xs">
              {isFreeDelivery ? (
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>You've unlocked <strong>FREE Delivery!</strong></span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </span>
                  <span>
                    Add <strong className="text-emerald-800">₹{settings.freeDeliveryThreshold - totalAmount}</strong> more for <strong>FREE Delivery</strong>
                  </span>
                </div>
              )}
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">FoodNinja Express</span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden divide-y divide-slate-100">
              {cartItems.map((item, index) => {
                const itemPrice = item.price ?? item.caloriesPerServing ?? 0;
                const itemTotal = itemPrice * (item.quantity || 1);
                const isVeg = item.dietary === "Non-Veg" || item.isVeg === false ? false : true;

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="p-3 sm:p-3.5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Link
                        to={`/restaurant/${item.id}`}
                        className="h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/70 group"
                        title={`View ${item.name}`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80";
                          }}
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center justify-center h-3 w-3 rounded-xs border p-[1px] shrink-0 ${isVeg ? "border-green-600" : "border-red-600"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
                          </span>

                          <Link
                            to={`/restaurant/${item.id}`}
                            className="font-bold text-slate-900 text-xs sm:text-sm truncate hover:text-emerald-700 transition"
                          >
                            {item.name}
                          </Link>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span>₹{itemPrice} per unit</span>
                          {(item.cuisine || item.category) && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="truncate">{item.cuisine || item.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                      <div className="flex items-center justify-between rounded-lg border border-emerald-600 bg-emerald-50/70 px-2 py-1 w-20 text-xs font-bold text-emerald-900 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => dispatch(removeCart(item.id))}
                          className="h-5 w-5 flex items-center justify-center text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100 rounded transition cursor-pointer text-sm"
                          title="Decrease"
                        >
                          −
                        </button>
                        <span className="select-none font-black text-xs text-emerald-950">
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => dispatch(addCart(item))}
                          disabled={(item.quantity || 1) >= 10}
                          className={`h-5 w-5 flex items-center justify-center rounded transition text-sm cursor-pointer ${
                            (item.quantity || 1) >= 10
                              ? "text-slate-300 cursor-not-allowed"
                              : "text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100"
                          }`}
                          title={(item.quantity || 1) >= 10 ? "Maximum 10 per dish" : "Add more"}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[55px] sm:min-w-[65px]">
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          ₹{itemTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-xs flex items-center gap-2.5 text-slate-600 shadow-2xs">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span className="flex-1 text-[11px] text-slate-500">
                Prepared fresh to order with authentic spices & hygienic spill-proof packaging.
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
            <aside className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs text-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Bill Details</h2>
                <span className="text-[10px] font-bold text-slate-400">{totalItems} {totalItems === 1 ? "item" : "items"}</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Items Total ({totalItems})</span>
                  <span className="font-bold text-slate-900">₹{totalAmount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>Delivery Fee</span>
                    {isFreeDelivery && (
                      <span className="rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-800">
                        FREE
                      </span>
                    )}
                  </span>
                  {isFreeDelivery ? (
                    <span className="font-bold text-emerald-700">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span>Packaging / Handling</span>
                  <span className="font-bold text-slate-900">₹{packagingFee}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>GST ({taxRate}%)</span>
                  <span className="font-bold text-slate-900">₹{taxes}</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-bold">−₹{discountAmount}</span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">Grand Total</span>
                      <span className="block text-[10px] text-slate-400 font-normal">GST and fees shown above</span>
                    </div>
                    <span className="text-xl font-black text-emerald-700">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {isStoreClosed ? (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <span className="font-bold block text-rose-800">Restaurant Currently Closed</span>
                    <span className="text-[11px] text-rose-700">{getClosedStoreNotice(settings)}</span>
                  </div>
                </div>
              ) : isBelowMinOrder ? (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span>Minimum order value is <strong>₹{settings.minOrderValue}</strong></span>
                  <span className="font-bold text-amber-800">Add ₹{settings.minOrderValue - totalAmount} more</span>
                </div>
              ) : null}

              {canCheckout ? (
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-between rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] px-4 py-3 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <span className="flex items-center gap-1 font-black">
                    <span>₹{grandTotal}</span>
                    <span>→</span>
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-200 text-slate-500 px-4 py-3 text-xs font-bold cursor-not-allowed select-none"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>{isStoreClosed ? "STORE CLOSED — ORDERS PAUSED" : `MINIMUM ORDER ₹${settings.minOrderValue || 99}`}</span>
                </button>
              )}

              <div className="pt-1 flex items-center justify-center gap-3 text-[10px] text-slate-400 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>100% Safe & Secure</span>
                </span>
                <span>•</span>
                <span>Fresh & Hot Guarantee</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
