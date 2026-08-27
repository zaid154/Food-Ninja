import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, removeCart } from "../../utils/cartSlice";
import { addWishlist, removeWishlist } from "../../utils/wishlistSlice";

const FoodCard = ({ data }) => {
  const { id, name, image, price, category, rating, deliveryTime, isVeg, description } = data;
  const dispatch = useDispatch();

  const wishlistItems = useSelector((store) => store.wishlist.item);
  const isLiked = wishlistItems.some((i) => i.id === id);

  const cartItems = useSelector((store) => store.cart.item);
  const inCart = cartItems.find((i) => i.id === id);
  const cartQty = inCart ? inCart.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addCart({ ...data, caloriesPerServing: price }));
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeCart(id));
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      dispatch(removeWishlist(id));
    } else {
      dispatch(addWishlist({ ...data, caloriesPerServing: price }));
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Image & Badges */}
      <Link to={`/restaurant/${id}`} className="block relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <span className={`absolute left-3 top-3 flex items-center gap-1 rounded bg-white/95 px-2 py-0.5 text-[11px] font-bold shadow-sm ${isVeg ? 'text-green-700' : 'text-red-700'}`}>
          <span className={`h-2 w-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
          {isVeg ? 'VEG' : 'NON-VEG'}
        </span>

        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-black/75 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
          ★ {rating || 4.5}
        </span>

        <button
          type="button"
          onClick={handleLike}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110 ${
            isLiked ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"
          }`}
          title="Save to Wishlist"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{category}</span>
          <span>{deliveryTime || "25-30 mins"}</span>
        </div>

        <Link to={`/restaurant/${id}`} className="mt-1 block">
          <h2 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition">
            {name}
          </h2>
        </Link>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {description || "Freshly cooked delicious preparation."}
        </p>

        {/* Price & Add to Cart Controls */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Price</span>
            <p className="text-lg font-black text-slate-900">₹{price || 199}</p>
          </div>

          {cartQty === 0 ? (
            <button
              onClick={handleAddToCart}
              className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
              ADD +
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border-2 border-emerald-600 bg-emerald-50 px-2 py-0.5">
              <button
                onClick={handleRemoveFromCart}
                className="h-6 w-6 text-sm font-bold text-emerald-700 hover:bg-emerald-100 rounded"
              >
                −
              </button>
              <span className="text-xs font-bold text-emerald-800 min-w-[12px] text-center">
                {cartQty}
              </span>
              <button
                onClick={handleAddToCart}
                className="h-6 w-6 text-sm font-bold text-emerald-700 hover:bg-emerald-100 rounded"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
