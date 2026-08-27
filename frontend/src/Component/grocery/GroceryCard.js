import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCart, removeCart } from "../../utils/cartSlice";
import { addWishlist, removeWishlist } from "../../utils/wishlistSlice";

const toCommonItem = (p) => ({
  id: "g" + p.id,
  name: p.title,
  image: p.thumbnail,
  caloriesPerServing: p.price,
  cuisine: p.category,
  ingredients: p.description ? [p.description] : [],
  rating: p.rating || 4.7
});

const GroceryCard = ({ p }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const item = toCommonItem(p);
  const cartItems = useSelector((store) => store.cart.item);
  const wishlistItems = useSelector((store) => store.wishlist.item);

  const inCart = cartItems.find((c) => String(c.id) === String(item.id));
  const cartQty = inCart ? inCart.quantity : 0;
  const isLiked = wishlistItems.some((w) => String(w.id) === String(item.id));

  const addHandler = () => dispatch(addCart(item));
  const minusHandler = () => dispatch(removeCart(item.id));

  const likeHandler = () => {
    if (isLiked) {
      dispatch(removeWishlist(item.id));
    } else {
      dispatch(addWishlist(item));
    }
  };

  const buyNowHandler = () => {
    navigate("/checkout", { state: { buyNowItem: item } });
  };

  return (
    <div className="group flex h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative bg-slate-50 p-4 flex items-center justify-center h-48">
        <img
          src={p.thumbnail}
          alt={p.title}
          loading="lazy"
          className="max-h-40 max-w-full object-contain transition duration-300 group-hover:scale-105"
        />

        <button
          onClick={likeHandler}
          aria-label="Like product"
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-110 ${
            isLiked ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>

        {p.unit && (
          <span className="absolute bottom-2 left-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white">
            {p.unit}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <span className="text-[11px] font-semibold text-emerald-700">{p.category}</span>
          <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
            {p.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {p.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-black text-slate-900">₹{p.price}</span>
            <span className="inline-flex items-center gap-1 rounded bg-green-50 border border-green-200 px-1.5 py-0.5 text-[11px] font-bold text-green-700">
              ★ {p.rating || 4.7}
            </span>
          </div>

          <div className="flex gap-2">
            {cartQty === 0 ? (
              <button
                onClick={addHandler}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
              >
                ADD +
              </button>
            ) : (
              <div className="flex flex-1 items-center justify-between rounded-lg border-2 border-emerald-600 bg-emerald-50 px-2 py-1">
                <button
                  onClick={minusHandler}
                  className="h-6 w-6 text-sm font-bold text-emerald-700 hover:bg-emerald-100 rounded"
                >
                  −
                </button>
                <span className="text-xs font-bold text-emerald-800">
                  {cartQty}
                </span>
                <button
                  onClick={addHandler}
                  className="h-6 w-6 text-sm font-bold text-emerald-700 hover:bg-emerald-100 rounded"
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={buyNowHandler}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryCard;
