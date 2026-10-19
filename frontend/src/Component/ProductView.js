import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useResipe from "./useRecipes";
import { addCart, removeCart } from "../utils/cartSlice";
import { addWishlist, removeWishlist } from "../utils/wishlistSlice";

const ProductView = () => {
    const { id } = useParams();
    const data = useResipe();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector((store) => store.cart.item);
    const wishlistItems = useSelector((store) => store.wishlist.item);

    if (!data) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border border-slate-200">
                    <div className="h-80 md:h-96 w-full rounded-xl bg-slate-200" />
                    <div className="space-y-4 py-4">
                        <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
                        <div className="h-4 w-1/4 bg-slate-200 rounded" />
                        <div className="h-24 w-full bg-slate-100 rounded-lg" />
                        <div className="h-10 w-1/2 bg-slate-200 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    const product = (data.recipes || []).find((item) => String(item.id) === String(id));

    if (!product) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <h1 className="text-xl font-semibold text-slate-900">Dish not found</h1>
                <p className="mt-2 text-sm text-slate-500">The dish you are looking for is no longer available on our menu.</p>
                <Link
                    to="/"
                    className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                    Back to Food Menu
                </Link>
            </div>
        );
    }

    const inCart = cartItems.find((i) => String(i.id) === String(product.id));
    const cartQty = inCart ? inCart.quantity : 0;
    const isLiked = wishlistItems.some((i) => String(i.id) === String(product.id));
    const price = product.price || product.caloriesPerServing || 199;
    const calories = product.caloriesPerServing ? `${product.caloriesPerServing * 2} kcal` : "320 kcal";
    const isBeverage = (product.category || "").toLowerCase().includes("beverage") || 
                       (product.name || "").toLowerCase().includes("shake") || 
                       (product.name || "").toLowerCase().includes("drink");

    const handleAddToCart = () => {
        dispatch(addCart({ ...product, caloriesPerServing: price }));
    };

    const handleRemoveFromCart = () => {
        dispatch(removeCart(product.id));
    };

    const handleBuyNow = () => {
        navigate("/checkout", { state: { buyNowItem: { ...product, caloriesPerServing: price } } });
    };

    const handleLike = () => {
        if (isLiked) {
            dispatch(removeWishlist(product.id));
        } else {
            dispatch(addWishlist({ ...product, caloriesPerServing: price }));
        }
    };

    return (
        <main className="bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8 min-h-[85vh]">
            <div className="mx-auto max-w-5xl">
                {/* Back to Food Menu Navigation */}
                <div className="mb-5">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Food Menu</span>
                    </Link>
                </div>

                {/* Product Detail Container */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
                    <div className="grid gap-8 md:grid-cols-[380px_1fr] lg:gap-10 items-start">
                        {/* Product Image Column */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                loading="eager"
                            />

                            {/* Small Vegetarian / Non-Vegetarian Indicator */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded bg-white/95 px-2 py-1 shadow-sm border border-slate-200/60 backdrop-blur-sm">
                                <div className={`flex items-center justify-center h-3.5 w-3.5 rounded-[2px] border ${product.isVeg ? 'border-emerald-600' : 'border-rose-600'} p-[2px]`}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${product.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                                </div>
                                <span className="text-[11px] font-medium text-slate-700">
                                    {product.isVeg ? "Veg" : "Non-Veg"}
                                </span>
                            </div>

                            {/* Subtle Wishlist Button */}
                            <button
                                type="button"
                                onClick={handleLike}
                                aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                                className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm border border-slate-200/60 transition hover:scale-105 ${
                                    isLiked ? "text-rose-600" : "text-slate-400 hover:text-rose-600"
                                }`}
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                                </svg>
                            </button>

                            {/* Subtle Rating Badge */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-slate-900/85 px-2 py-0.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                                <span className="text-amber-400 text-xs">★</span>
                                <span>{product.rating || 4.5}</span>
                            </div>
                        </div>

                        {/* Product Information Column */}
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                {/* Category & Delivery Meta */}
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                        {product.cuisine ? `${product.cuisine} • ${product.category}` : product.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-500">
                                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span>{product.deliveryTime || "25–30 mins"}</span>
                                    </span>
                                </div>

                                {/* Product Name */}
                                <h1 className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                                    {product.name}
                                </h1>

                                {/* Description */}
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    {product.description || "Authentic and freshly prepared dish made with traditional spices and premium ingredients."}
                                </p>

                                {/* Compact Portion, Calories & Packaging Row */}
                                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
                                    <div>
                                        <span className="text-slate-400">Portion: </span>
                                        <span className="font-medium text-slate-700">{isBeverage ? "1 Glass (350ml)" : "Serves 1–2"}</span>
                                    </div>
                                    <span className="hidden sm:inline text-slate-300">•</span>
                                    <div>
                                        <span className="text-slate-400">Calories: </span>
                                        <span className="font-medium text-slate-700">{calories}</span>
                                    </div>
                                    <span className="hidden sm:inline text-slate-300">•</span>
                                    <div>
                                        <span className="text-slate-400">Packaging: </span>
                                        <span className="font-medium text-slate-700">Eco-sealed container</span>
                                    </div>
                                </div>

                                {/* Ingredients in a simple, compact layout */}
                                {product.ingredients && product.ingredients.length > 0 && (
                                    <div className="mt-3 text-xs text-slate-500 leading-relaxed">
                                        <span className="font-medium text-slate-700">Ingredients: </span>
                                        <span>{product.ingredients.join(", ")}</span>
                                    </div>
                                )}
                            </div>

                            {/* Price & Purchase Actions */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                            Total Price
                                        </span>
                                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                            ₹{price}
                                        </p>
                                    </div>

                                    {/* Actions: Add to Cart (primary) + Instant Order (secondary) */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {cartQty === 0 ? (
                                            <button
                                                type="button"
                                                onClick={handleAddToCart}
                                                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition active:scale-[0.98] whitespace-nowrap"
                                            >
                                                Add to Cart
                                            </button>
                                        ) : (
                                            <div className="inline-flex items-center rounded-lg border border-emerald-600 bg-emerald-50/60 px-2 py-1">
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFromCart}
                                                    aria-label="Decrease quantity"
                                                    className="flex h-7 w-7 items-center justify-center rounded text-emerald-700 hover:bg-emerald-100 transition font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="px-3 text-sm font-semibold text-emerald-950 min-w-[28px] text-center">
                                                    {cartQty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleAddToCart}
                                                    aria-label="Increase quantity"
                                                    className="flex h-7 w-7 items-center justify-center rounded text-emerald-700 hover:bg-emerald-100 transition font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleBuyNow}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition active:scale-[0.98] whitespace-nowrap"
                                        >
                                            Instant Order
                                        </button>
                                    </div>
                                </div>

                                {cartQty > 0 && (
                                    <div className="mt-3 flex justify-end">
                                        <Link
                                            to="/cart"
                                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                                        >
                                            Proceed to Cart & Checkout →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductView;
