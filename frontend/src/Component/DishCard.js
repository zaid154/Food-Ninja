import { useState, useMemo, useEffect } from "react";
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

  const [portionModalOpen, setPortionModalOpen] = useState(false);
  const [selectedPortion, setSelectedPortion] = useState(() => portionOptions[0]?.value || "Full");
  const [modalQty, setModalQty] = useState(1);

  useEffect(() => {
    if (portionOptions.length && !portionOptions.some((p) => p.value === selectedPortion)) {
      setSelectedPortion(portionOptions[0]?.value || "Full");
    }
  }, [portionOptions]);

  const currentPortionObj = portionOptions.find((p) => p.value === selectedPortion) || portionOptions[0];

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

  const handleModalAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const itemPrice = currentPortionObj?.price || cardPrice;
    for (let i = 0; i < modalQty; i++) {
      dispatch(addCart({
        ...data,
        price: itemPrice,
        portionSize: selectedPortion,
        caloriesPerServing: data.caloriesPerServing,
      }));
    }
    setPortionModalOpen(false);
    setModalQty(1);
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
        {/* Dish Image */}
        <Link to={`/restaurant/${id}`} state={{ product: data }} className="block relative h-44 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
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
          <div className="mt-4 flex items-center justify-between pt-1">
            <div className="text-base font-extrabold text-slate-900">
              {data.hasPortions ? `From ₹${cardPrice}` : `₹${price}`}
            </div>

            {!isAvailable ? (
              <span className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-400">
                Unavailable
              </span>
            ) : data.hasPortions ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPortionModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition cursor-pointer"
              >
                <span>Choose Size</span>
                {totalDishQty > 0 && (
                  <span className="rounded-full bg-white text-emerald-800 px-1.5 py-0.2 text-[10px] font-bold">
                    {totalDishQty}
                  </span>
                )}
              </button>
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

      {/* Quick Customization / Portion Modal (Zomato/Swiggy Style) */}
      {portionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPortionModalOpen(false);
          }}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-left animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Dish Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className={`flex items-center justify-center h-3.5 w-3.5 rounded-xs border ${isVeg ? 'border-emerald-600' : 'border-rose-600'} p-[2px]`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">{name}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{description || "Freshly prepared recipe"}</p>
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 mt-1">
                    <span>★ {rating ? Number(rating).toFixed(1) : "4.3"}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-semibold">Customizable</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPortionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition shrink-0"
                aria-label="Close"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Portion Options */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[11px]">Choose Portion Size</p>
              <div className="space-y-1.5">
                {portionOptions.map((opt) => {
                  const isOptSelected = selectedPortion === opt.value;
                  return (
                    <label
                      key={opt.value}
                      onClick={() => setSelectedPortion(opt.value)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                        isOptSelected
                          ? "bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isOptSelected ? "border-emerald-600 bg-emerald-600" : "border-slate-300 bg-white"
                        }`}>
                          {isOptSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{opt.label}</span>
                      </div>
                      <span className="font-extrabold text-slate-900">₹{opt.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Footer Bar: Quantity & Add Button */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                <button
                  type="button"
                  onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                  className="text-slate-600 hover:text-slate-900 font-bold px-1 text-sm disabled:opacity-40"
                  disabled={modalQty <= 1}
                >
                  −
                </button>
                <span className="text-xs font-bold text-slate-900 min-w-[16px] text-center">{modalQty}</span>
                <button
                  type="button"
                  onClick={() => setModalQty((q) => Math.min(10, q + 1))}
                  className="text-slate-600 hover:text-slate-900 font-bold px-1 text-sm"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleModalAdd}
                className="flex-1 inline-flex items-center justify-between rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <span>Add to Cart</span>
                <span>₹{(currentPortionObj?.price || cardPrice) * modalQty}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DishCard;
