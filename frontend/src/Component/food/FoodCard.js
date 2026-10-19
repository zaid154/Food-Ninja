import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, removeCart } from "../../utils/cartSlice";
import { addWishlist, removeWishlist } from "../../utils/wishlistSlice";

const FoodCard = ({ data }) => {
  const { id, name, image, price, category, rating, deliveryTime, isVeg, dietary, description } = data;
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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Dish Image */}
      <Link to={`/restaurant/${id}`} className="block relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Authentic Veg / Non-Veg / Vegan Indicator */}
        <div className="absolute left-3 top-3 rounded-md bg-white/90 p-1 shadow-sm backdrop-blur-sm">
          {dietary === "Vegan" ? (
            <div className="flex items-center gap-1 px-0.5">
              <svg className="h-2.5 w-2.5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
              </svg>
              <span className="text-[9px] font-bold text-emerald-800">Vegan</span>
            </div>
          ) : (
            <div className={`flex items-center justify-center h-3.5 w-3.5 rounded-sm border ${isVeg ? 'border-green-600' : 'border-red-600'} p-[2px]`}>
              <div className={`h-1.5 w-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
            </div>
          )}
        </div>

        {/* Rating Pill */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-green-700 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
          <span>{rating || 4.2}</span>
          <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleLike}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition ${
            isLiked ? "text-emerald-600" : "text-gray-400 hover:text-emerald-600"
          }`}
          title="Save to favorites"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
      </Link>

      {/* Dish Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
          <span>{category}</span>
          <span>{deliveryTime || "25-30 mins"}</span>
        </div>

        <Link to={`/restaurant/${id}`} className="mt-1 block">
          <h2 className="text-base font-bold text-gray-900 line-clamp-1 hover:text-emerald-600 transition">
            {name}
          </h2>
        </Link>

        <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed h-9">
          {description || "Freshly cooked authentic preparation."}
        </p>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-lg font-black text-gray-900">₹{price || 199}</p>
          </div>

          {cartQty === 0 ? (
            <button
              onClick={handleAddToCart}
              className="rounded-lg border-2 border-emerald-600 bg-white px-5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm transition hover:bg-emerald-600 hover:text-white active:scale-95"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border-2 border-emerald-600 bg-emerald-50 px-2 py-0.5">
              <button
                onClick={handleRemoveFromCart}
                className="h-6 w-6 text-sm font-bold text-emerald-700 hover:bg-emerald-100 rounded"
              >
                −
              </button>
              <span className="text-xs font-black text-emerald-800 min-w-[14px] text-center">
                {cartQty}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={cartQty >= 10}
                className={`h-6 w-6 text-sm font-bold rounded ${
                  cartQty >= 10
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-emerald-700 hover:bg-emerald-100"
                }`}
                title={cartQty >= 10 ? "Maximum 10 per dish" : "Add one more"}
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
