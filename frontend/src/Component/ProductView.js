import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useResipe from "./useRecipes";
import Shimmer from "./Shimmer";
import { addCart, removeCart } from "../utils/cartSlice";
import { addWishlist, removeWishlist } from "../utils/wishlistSlice";

const ProductView = () => {
    const { id } = useParams();
    const data = useResipe();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector((store) => store.cart.item);
    const wishlistItems = useSelector((store) => store.wishlist.item);

    if (!data) return <Shimmer />;

    const product = data.recipes.find((item) => String(item.id) === String(id));

    if (!product) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-slate-900">Dish not found</h1>
                <Link
                    to="/"
                    className="mt-4 inline-block rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white"
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
    const calories = product.caloriesPerServing ? `${product.caloriesPerServing * 2} Kcal` : "320 Kcal";

    const isBeverage = (product.category || "").toLowerCase().includes("beverage") || (product.name || "").toLowerCase().includes("caipirinha") || (product.name || "").toLowerCase().includes("shake") || (product.name || "").toLowerCase().includes("drink");

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
        <section className="bg-slate-50 py-6 px-4">
            <div className="mx-auto max-w-5xl">
                {/* Back to Menu Bar */}
                <div className="mb-4 flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg shadow-sm transition hover:bg-slate-50"
                    >
                        ← Back to Food Menu
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                            {product.category || "Specialty"}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                            ⚡ 20-30 Mins Delivery
                        </span>
                    </div>
                </div>

                {/* Premium Balanced Product Card */}
                <div className="grid gap-6 md:grid-cols-[360px_1fr] bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    {/* Left: Dish Image */}
                    <div className="relative h-72 sm:h-80 md:h-[360px] w-full overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />

                        {/* Veg / Non-Veg Badge */}
                        <span className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-white/95 backdrop-blur px-2.5 py-1 text-xs font-bold shadow ${product.isVeg ? 'text-green-700' : 'text-red-700'}`}>
                            <span className={`h-2.5 w-2.5 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                            {product.isVeg ? 'PURE VEG' : 'NON-VEG'}
                        </span>

                        {/* Rating Badge */}
                        <span className="absolute bottom-3 left-3 rounded-md bg-black/85 px-3 py-1 text-xs font-bold text-white shadow">
                            ★ {product.rating || 4.8} ({product.reviewCount || 120}+ reviews)
                        </span>

                        {/* Wishlist Button */}
                        <button
                            onClick={handleLike}
                            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition hover:scale-110 ${
                                isLiked ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"
                            }`}
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                            </svg>
                        </button>
                    </div>

                    {/* Right: Dish Info & Actions */}
                    <div className="flex flex-col justify-between space-y-4">
                        <div>
                            {/* Category & Title */}
                            <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                                <span className="uppercase tracking-wider font-extrabold">{product.cuisine ? `${product.cuisine} Specialty` : product.category}</span>
                                <span className="text-slate-400 font-medium">Freshly Cooked on Order</span>
                            </div>

                            <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                                {product.name}
                            </h1>

                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                {product.description && !product.description.includes("style " + product.name)
                                    ? product.description
                                    : `Authentic ${product.name} prepared fresh with traditional spices, aromatic herbs, and premium ingredients.`}
                            </p>

                            {/* Specification Boxes */}
                            <div className="mt-4 grid grid-cols-3 gap-2.5 text-center text-xs">
                                <div className="p-2 rounded-lg border border-slate-100 bg-slate-50">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Portion</p>
                                    <p className="font-bold text-slate-800 text-xs mt-0.5">{isBeverage ? "1 Glass (350ml)" : "Serves 1-2"}</p>
                                </div>
                                <div className="p-2 rounded-lg border border-slate-100 bg-slate-50">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Calories</p>
                                    <p className="font-bold text-slate-800 text-xs mt-0.5">{calories}</p>
                                </div>
                                <div className="p-2 rounded-lg border border-slate-100 bg-slate-50">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Packaging</p>
                                    <p className="font-bold text-emerald-700 text-xs mt-0.5">100% Sealed</p>
                                </div>
                            </div>

                            {/* Ingredients */}
                            {product.ingredients && product.ingredients.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Key Ingredients</p>
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                        {product.ingredients.map((item, i) => (
                                            <span key={i} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pricing & Actions */}
                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Price</span>
                                    <p className="text-3xl font-black text-slate-900 leading-none">₹{price}</p>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    {cartQty === 0 ? (
                                        <button
                                            onClick={handleAddToCart}
                                            className="rounded-lg bg-emerald-600 py-3 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 text-center"
                                        >
                                            Add to Cart +
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3 rounded-lg border-2 border-emerald-600 bg-emerald-50 px-3.5 py-2">
                                            <button
                                                onClick={handleRemoveFromCart}
                                                className="h-6 w-6 rounded bg-white text-sm font-bold text-emerald-700 hover:bg-emerald-100 shadow-sm"
                                            >
                                                −
                                            </button>
                                            <span className="text-xs font-black text-emerald-900">
                                                {cartQty} in Cart
                                            </span>
                                            <button
                                                onClick={handleAddToCart}
                                                className="h-6 w-6 rounded bg-white text-sm font-bold text-emerald-700 hover:bg-emerald-100 shadow-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleBuyNow}
                                        className="rounded-lg bg-slate-900 py-3 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
                                    >
                                        Instant Order →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductView;
