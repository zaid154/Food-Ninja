import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, clearCart, removeCart } from "../utils/cartSlice";

const Cart = () => {
  const cartItems = useSelector((store) => store.cart.item);
  const dispatch = useDispatch();

  const totalItems = cartItems.reduce((n, i) => n + (i.quantity || 1), 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.caloriesPerServing || 0) * (item.quantity || 1),
    0
  );
  const deliveryFee = totalItems > 0 ? 49 : 0;
  const taxes = totalItems > 0 ? Math.round(totalAmount * 0.05) : 0;
  const grandTotal = totalAmount + deliveryFee + taxes;

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
            Looks like you haven't added any delicious food or groceries yet.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-emerald-700 shadow-sm"
            >
              Explore Food Menu
            </Link>
            <Link
              to="/grocery"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Grocery Store
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
                  <div className="h-28 w-full sm:w-36 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">{item.name}</h2>
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
                            className="h-6 w-6 text-sm font-bold text-emerald-700 hover:bg-emerald-100 rounded"
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

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Total ({totalItems})</span>
                <span className="font-bold text-slate-900">₹{totalAmount}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Standard Delivery Fee</span>
                <span className="font-bold text-slate-900">₹{deliveryFee}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Govt Taxes (5%)</span>
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
