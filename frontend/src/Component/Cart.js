import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, clearCart, removeCart } from "../utils/cartSlice";
import { API_BASE_URL } from "../utils/Constants";

const Cart = () => {
  const cartItems = useSelector((store) => store.cart.item);
  const dispatch = useDispatch();

  const [settings, setSettings] = useState({
    deliveryFee: 30,
    freeDeliveryThreshold: 499,
    packagingFee: 15,
    taxRate: 5,
  });

  useEffect(() => {
    if (typeof fetch !== "undefined") {
      fetch(`${API_BASE_URL}/settings`)
        .then((r) => r.json())
        .then((d) => {
          if (d && d.settings) setSettings(d.settings);
        })
        .catch(() => {});
    }
  }, []);

  const totalItems = cartItems.reduce((n, i) => n + (i.quantity || 1), 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.caloriesPerServing || 0) * (item.quantity || 1),
    0
  );

  const isFreeDelivery = totalAmount >= (settings.freeDeliveryThreshold || 499);
  const deliveryFee = totalItems > 0 ? (isFreeDelivery ? 0 : (settings.deliveryFee ?? 30)) : 0;
  const packagingFee = totalItems > 0 ? (settings.packagingFee ?? 15) : 0;
  const taxes = totalItems > 0 ? Math.round(totalAmount * ((settings.taxRate ?? 5) / 100)) : 0;
  const grandTotal = totalAmount + deliveryFee + packagingFee + taxes;

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
    <section className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Shopping Cart</h1>
            <p className="text-xs text-slate-500 mt-0.5">{totalItems} items in your order</p>
          </div>

          <button
            onClick={() => dispatch(clearCart())}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          {/* Cart Items List */}
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <article
                key={`${item.id}-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    to={`/restaurant/${item.id}`}
                    className="group/img block h-28 w-full sm:w-36 shrink-0 overflow-hidden rounded-xl bg-slate-100 cursor-pointer"
                    title={`View ${item.name} details`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          to={`/restaurant/${item.id}`}
                          className="block group/title"
                          title={`View ${item.name} details`}
                        >
                          <h2 className="text-base font-bold text-slate-900 group-hover/title:text-emerald-700 transition cursor-pointer">
                            {item.name}
                          </h2>
                        </Link>
                        <span className="text-xs font-semibold text-emerald-600">{item.cuisine || item.category}</span>
                      </div>
                      <p className="text-base font-black text-slate-900">
                        ₹{(item.caloriesPerServing || 0) * (item.quantity || 1)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <span className="text-slate-400">₹{item.caloriesPerServing} per unit</span>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-lg border-2 border-emerald-600 bg-emerald-50 px-2 py-0.5">
                          <button
                            onClick={() => dispatch(removeCart(item.id))}
                            className="h-6 w-6 text-sm font-bold text-emerald-700 hover:bg-emerald-100 rounded"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-emerald-800 min-w-[14px] text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => dispatch(addCart(item))}
                            disabled={(item.quantity || 1) >= 10}
                            className={`h-6 w-6 text-sm font-bold rounded ${
                              (item.quantity || 1) >= 10
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-emerald-700 hover:bg-emerald-100"
                            }`}
                            title={(item.quantity || 1) >= 10 ? "Maximum 10 per dish" : "Add one more"}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Order Summary & Bill */}
          <aside className="sticky top-24 h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-xs">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">Bill Details</h2>

            {/* Free Delivery Promo Bar */}
            <div className="mt-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3 text-xs">
              {isFreeDelivery ? (
                <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>You've unlocked <strong>FREE Delivery!</strong></span>
                </p>
              ) : (
                <p className="text-slate-700">
                  Add <strong className="text-emerald-700 font-bold">₹{settings.freeDeliveryThreshold - totalAmount}</strong> more for <strong>FREE Delivery</strong>
                </p>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Total ({totalItems})</span>
                <span className="font-bold text-slate-900">₹{totalAmount}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery Fee</span>
                {isFreeDelivery ? (
                  <span className="font-bold text-emerald-700">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                )}
              </div>

              {packagingFee > 0 && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Restaurant Packaging Fee</span>
                  <span className="font-bold text-slate-900">₹{packagingFee}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>Govt Taxes ({settings.taxRate || 5}%)</span>
                <span className="font-bold text-slate-900">₹{taxes}</span>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3">
                <div className="flex items-center justify-between text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-lg text-emerald-600">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-xl bg-emerald-600 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
              Proceed to Checkout →
            </Link>

            <Link
              to="/"
              className="mt-3 block text-center font-bold text-emerald-600 hover:underline"
            >
              ← Add More Dishes
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;
