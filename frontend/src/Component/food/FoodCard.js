import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, removeCart } from "../../utils/cartSlice";
import { addWishlist, removeWishlist } from "../../utils/wishlistSlice";

const FoodCard = ({ data }) => {
  const { id, name, image, price, rating, isVeg, description, inStock } = data;
  const dispatch = useDispatch();
  const isAvailable = inStock !== false;

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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Dish Image */}
      <Link to={`/restaurant/${id}`} className="block relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute left-3 top-3 rounded-md bg-white/95 p-1 shadow-xs backdrop-blur-sm">
          <div className={`flex items-center justify-center h-3.5 w-3.5 rounded-xs border ${isVeg ? 'border-emerald-600' : 'border-rose-600'} p-[2px]`}>
            <div className={`h-1.5 w-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
          </div>
        </div>

        {/* Wishlist Button (White Circle Top-Right) */}
        <button
          type="button"
          onClick={handleLike}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-xs transition hover:scale-110 ${
            isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
          }`}
          title="Save to favorites"
          aria-label="Wishlist"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>

        {/* Rating Pill (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
          <span>{rating ? Number(rating).toFixed(1) : "4.3"}</span>
          <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        {/* Sold Out Overlay Badge */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="rounded-lg bg-slate-900/90 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md border border-white/20">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Dish Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <Link to={`/restaurant/${id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 line-clamp-1 hover:text-emerald-700 transition">
              {name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {description || "Prepared fresh with authentic herbs and premium ingredients."}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 flex items-center justify-between pt-1">
          <div className="text-base font-extrabold text-slate-900">
            ₹{price}
          </div>

          {!isAvailable ? (
            <span className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-400">
              Unavailable
            </span>
          ) : cartQty > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-50/80 px-2.5 py-1">
              <button
                type="button"
                onClick={handleRemoveFromCart}
                className="text-sm font-bold text-emerald-800 hover:text-emerald-950 px-1"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-xs font-bold text-emerald-900 min-w-[14px] text-center">
                {cartQty}
              </span>
              <button
                type="button"
                onClick={handleAddToCart}
                className="text-sm font-bold text-emerald-800 hover:text-emerald-950 px-1"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
