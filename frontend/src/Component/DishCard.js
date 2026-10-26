import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, removeCart } from "../utils/cartSlice";
import { addWishlist, removeWishlist } from "../utils/wishlistSlice";

const DishCard = ({ data }) => {
  const { id, name, image, price, rating, isVeg, description, inStock } = data;
  const dispatch = useDispatch();
  const isAvailable = inStock !== false;

  const portionPrices = [price, data.halfPrice, data.quarterPrice]
    .map(Number)
    .filter((amount) => amount > 0);
  const cardPrice = data.hasPortions && portionPrices.length
    ? Math.min(...portionPrices)
    : price;

  const portionOptions = useMemo(() => {
    if (!data.hasPortions) return [];
    const list = [];
    if (Number(data.quarterPrice) > 0) {
      list.push({ value: "Quarter", label: "Quarter Plate", price: Number(data.quarterPrice) });
    }
    if (Number(data.halfPrice) > 0) {
      list.push({ value: "Half", label: "Half Plate", price: Number(data.halfPrice) });
    }
    list.push({ value: "Full", label: "Full Plate", price: Number(price) });
    return list;
  }, [data, price]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const wishlistItems = useSelector((store) => store.wishlist.item);
  const isLiked = wishlistItems.some((i) => i.id === id);

  const cartItems = useSelector((store) => store.cart.item);
  const inCart = cartItems.find((i) =>
    String(i.id) === String(id) &&
    (i.portionSize || (i.hasPortions ? "Full" : "")) === (data.hasPortions ? "Full" : "")
  );
  const cartQty = inCart ? inCart.quantity : 0;

  const totalDishQty = cartItems
    .filter((i) => String(i.id) === String(id))
    .reduce((sum, i) => sum + (i.quantity || 1), 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addCart({ ...data, price, portionSize: data.hasPortions ? "Full" : "", caloriesPerServing: data.caloriesPerServing }));
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeCart({ id, portionSize: data.hasPortions ? "Full" : "", hasPortions: Boolean(data.hasPortions) }));
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
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Dish Image */}
      <Link to={`/restaurant/${id}`} state={{ product: data }} className="block relative h-44 w-full overflow-hidden rounded-t-2xl bg-slate-100 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className={`h-full w-full ${data.imageFit === "contain" ? "object-contain p-2" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80";
          }}
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute left-3 top-3 rounded-md bg-white/95 p-1 shadow-xs backdrop-blur-sm">
          <div className={`flex items-center justify-center h-3.5 w-3.5 rounded-xs border ${isVeg ? 'border-emerald-600' : 'border-rose-600'} p-[2px]`}>
            <div className={`h-1.5 w-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
          </div>
        </div>

        {/* Wishlist Button */}
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

        {/* Rating Pill */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
          <span>{rating ? Number(rating).toFixed(1) : "4.3"}</span>
          <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        {/* Sold Out Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center rounded-t-2xl">
            <span className="rounded-lg bg-slate-900/90 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md border border-white/20">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Dish Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <Link to={`/restaurant/${id}`} state={{ product: data }} className="block">
            <h3 className="text-base font-bold text-slate-900 line-clamp-1 hover:text-emerald-700 transition">
              {name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {description || "Prepared fresh with authentic herbs and premium ingredients."}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 flex items-center justify-between pt-1 relative">
          <div className="text-base font-extrabold text-slate-900">
            {data.hasPortions ? `From ₹${cardPrice}` : `₹${price}`}
          </div>

          {!isAvailable ? (
            <span className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-400">
              Unavailable
            </span>
          ) : data.hasPortions ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDropdownOpen((v) => !v);
                }}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer ${
                  dropdownOpen || totalDishQty > 0
                    ? "bg-emerald-800 text-white ring-2 ring-emerald-500/20"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
                aria-expanded={dropdownOpen}
                aria-label="Choose portion size"
              >
                <span>{totalDishQty > 0 ? `Customized` : `Choose Size`}</span>
                {totalDishQty > 0 && (
                  <span className="rounded-full bg-white text-emerald-800 px-1.5 py-0.2 text-[10px] font-black">
                    {totalDishQty}
                  </span>
                )}
                <svg
                  className={`h-3 w-3 text-emerald-200 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Compact Portion Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-64 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl shadow-slate-900/15 z-40 space-y-2 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Select Portions</span>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs p-0.5 rounded cursor-pointer leading-none"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {portionOptions.map((opt) => {
                      const itemInCart = cartItems.find(
                        (i) => String(i.id) === String(id) && (i.portionSize || "Full") === opt.value
                      );
                      const optQty = itemInCart ? itemInCart.quantity : 0;

                      return (
                        <div
                          key={opt.value}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs transition ${
                            optQty > 0 ? "border-emerald-200 bg-emerald-50/60" : "border-slate-100 bg-slate-50/60"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-slate-800 text-[11px] leading-tight">{opt.label}</p>
                            <p className="text-[11px] font-black text-emerald-700">₹{opt.price}</p>
                          </div>

                          {optQty > 0 ? (
                            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-2 py-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => dispatch(removeCart({ id, portionSize: opt.value, hasPortions: true }))}
                                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-1 cursor-pointer"
                                title="Remove one"
                              >
                                −
                              </button>
                              <span className="text-xs font-bold text-emerald-900 min-w-[14px] text-center">
                                {optQty}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(addCart({ ...data, price: opt.price, portionSize: opt.value, caloriesPerServing: data.caloriesPerServing }))
                                }
                                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-1 cursor-pointer"
                                title="Add one more"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(addCart({ ...data, price: opt.price, portionSize: opt.value, caloriesPerServing: data.caloriesPerServing }))
                              }
                              className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-2 py-1 text-[11px] font-bold shadow-2xs transition cursor-pointer"
                            >
                              <span>+</span>
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {totalDishQty > 0 && (
                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">In your cart:</span>
                      <span className="font-black text-emerald-800">{totalDishQty} item{totalDishQty > 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
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

export default DishCard;
