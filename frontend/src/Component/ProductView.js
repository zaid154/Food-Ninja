import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useResipe from "./useRecipes";
import { addCart, removeCart } from "../utils/cartSlice";
import { addWishlist, removeWishlist } from "../utils/wishlistSlice";

const ProductView = () => {
  const { id } = useParams();
  const data = useResipe();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("description");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const cartItems = useSelector((store) => store.cart.item);
  const wishlistItems = useSelector((store) => store.wishlist.item);

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 w-full rounded-2xl bg-slate-100" />
          <div className="space-y-4 py-4">
            <div className="h-8 w-3/4 bg-slate-100 rounded-lg" />
            <div className="h-4 w-1/4 bg-slate-100 rounded" />
            <div className="h-24 w-full bg-slate-50 rounded-lg" />
            <div className="h-12 w-1/2 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const product = (data.recipes || []).find((item) => String(item.id) === String(id));

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-900">Dish not found</h1>
        <p className="mt-2 text-xs text-slate-500">The dish you are looking for is no longer available on our menu.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition"
        >
          Back to Food Menu
        </Link>
      </div>
    );
  }

  const inCart = cartItems.find((i) => String(i.id) === String(product.id));
  const cartQty = inCart ? inCart.quantity : 0;
  const isLiked = wishlistItems.some((i) => String(i.id) === String(product.id));

  const price = product.price || product.caloriesPerServing || 150;
  const calories = product.caloriesPerServing ? `${product.caloriesPerServing} kcal` : "300 kcal";
  const rating = product.rating ? Number(product.rating).toFixed(1) : "4.3";
  const reviewCount = product.reviewCount || 86;

  // 4 Gallery images for thumbnail strip
  const gallery = [
    product.image,
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
  ];

  const handleAddToCart = () => {
    dispatch(addCart({ ...product, caloriesPerServing: price }));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeCart(product.id));
  };

  const handleLike = () => {
    if (isLiked) {
      dispatch(removeWishlist(product.id));
    } else {
      dispatch(addWishlist({ ...product, caloriesPerServing: price }));
    }
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8">
          <Link to="/" className="hover:text-slate-700 transition flex items-center gap-1">
            <span>←</span>
            <span>Home</span>
          </Link>
          <span>›</span>
          <Link to="/" className="hover:text-slate-700 transition">
            Menu
          </Link>
          <span>›</span>
          <span className="text-slate-800 font-semibold">{product.name}</span>
        </nav>

        {/* Top Product Section (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-12 border-b border-slate-100">
          {/* Left Column: Image Showcase (Thumbnails + Hero Image) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            {/* Vertical Thumbnail Strip */}
            <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-visible">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImageIdx === idx ? "border-emerald-700 ring-2 ring-emerald-500/20" : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              <div className="hidden sm:flex h-8 items-center justify-center text-slate-400">
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Main Featured Dish Photo */}
            <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm order-1 sm:order-2">
              <img
                src={gallery[selectedImageIdx]}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300"
              />

              {/* Top-Right Heart Wishlist Button */}
              <button
                type="button"
                onClick={handleLike}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition hover:scale-110 ${
                  isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
                }`}
                title="Save to favorites"
                aria-label="Wishlist"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Dish Info & Purchasing Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Cuisine Pill Tag */}
            <div className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100">
              {product.cuisine ? `${product.cuisine} Cuisine` : `${product.category} Cuisine`}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-amber-500 text-sm">★</span>
              <span className="font-bold text-slate-900">{rating}</span>
              <span>({reviewCount} reviews)</span>
            </div>

            {/* Quick Specs Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 pb-1 border-y border-slate-100">
              <div className="flex items-center gap-1.5">
                <span>👥</span>
                <span>Serves 1-2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>⏱️</span>
                <span>{calories}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🍃</span>
                <span>Eco-sealed container</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed">
              {product.description || `Delicious ${product.cuisine || product.category} style ${product.name}, prepared fresh with aromatic herbs and premium quality ingredients.`}
            </p>

            {/* Large Price */}
            <div className="text-3xl font-black text-slate-900">
              ₹{price}
            </div>

            {/* Quantity Selector + Add to Cart Row */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 w-32 shadow-2xs">
                <button
                  type="button"
                  onClick={handleRemoveFromCart}
                  disabled={cartQty === 0}
                  className="text-base font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30"
                >
                  −
                </button>
                <span className="text-sm font-extrabold text-slate-900">
                  {cartQty > 0 ? cartQty : 1}
                </span>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="text-base font-bold text-slate-600 hover:text-slate-900"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-emerald-800 transition"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span>{cartQty > 0 ? `Added (${cartQty}) • Add More` : "Add to Cart"}</span>
              </button>
            </div>

            {/* 3 Trust Features Under Button */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V15a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] font-bold text-slate-900">Fresh Ingredients</div>
                  <div className="text-[10px] text-slate-400">100% natural</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] font-bold text-slate-900">Fast Delivery</div>
                  <div className="text-[10px] text-slate-400">Within 30 mins</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[11px] font-bold text-slate-900">Hygienic & Safe</div>
                  <div className="text-[10px] text-slate-400">Well packed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="py-10 border-b border-slate-100">
          <div className="flex items-center gap-8 border-b border-slate-100 pb-3 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`text-sm font-semibold transition pb-3 relative ${
                activeTab === "description"
                  ? "text-slate-900 after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-[2px] after:bg-emerald-700"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ingredients")}
              className={`text-sm font-semibold transition pb-3 relative ${
                activeTab === "ingredients"
                  ? "text-slate-900 after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-[2px] after:bg-emerald-700"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Ingredients
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`text-sm font-semibold transition pb-3 relative ${
                activeTab === "reviews"
                  ? "text-slate-900 after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-[2px] after:bg-emerald-700"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          {/* Description Tab Body */}
          {activeTab === "description" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column Description + Key Features */}
              <div className="lg:col-span-8 space-y-6">
                <p className="text-xs text-slate-600 leading-relaxed">
                  A traditional {product.cuisine || product.category} preparation made with freshly sourced ingredients, garden herbs, and authentic spices. Our {product.name} is cooked to perfection and served fresh for a truly authentic taste.
                </p>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Key Features</h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Authentic {product.cuisine || "chef"} recipe crafted by master culinary artists</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Made with 100% farm-fresh vegetables and premium spices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Rich in essential vitamins, proteins, and daily nutrients</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Prepared fresh on order and delivered in spill-proof packaging</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column Nutrition Box */}
              <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Nutrition Information</h4>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>💧</span>
                      <span>Calories</span>
                    </div>
                    <span className="font-bold text-slate-900">{calories}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>🍗</span>
                      <span>Protein</span>
                    </div>
                    <span className="font-bold text-slate-900">8 g</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>🍞</span>
                      <span>Carbs</span>
                    </div>
                    <span className="font-bold text-slate-900">45 g</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>🥑</span>
                      <span>Fat</span>
                    </div>
                    <span className="font-bold text-slate-900">8 g</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients Tab Body */}
          {activeTab === "ingredients" && (
            <div className="space-y-4 max-w-2xl text-xs text-slate-600">
              <p>Fresh Ingredients used in this preparation:</p>
              <div className="flex flex-wrap gap-2">
                {(product.ingredients && product.ingredients.length > 0
                  ? product.ingredients
                  : ["Fresh Farm Vegetables", "Authentic Spices", "Olive Oil", "Himalayan Rock Salt", "Garden Fresh Herbs"]
                ).map((ing, i) => (
                  <span key={i} className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 font-medium text-slate-800">
                    • {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab Body */}
          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-2xl">
              <p className="text-xs text-slate-500">Showing top verified reviews from customer orders.</p>
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <div className="py-10 border-b border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Customer Reviews</h3>
            <span className="text-xs font-semibold text-slate-500">
              {rating} out of 5 ({reviewCount} reviews)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Review 1: Sara Khan */}
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    S
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Sara Khan</h5>
                    <p className="text-[10px] text-slate-400">2 days ago</p>
                  </div>
                </div>
                <div className="text-amber-500 text-xs">★★★★★</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Really loved the taste! Fresh ingredients and authentic flavor. Will definitely order again.
                </p>
              </div>
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <img src={product.image} alt="" className="h-full w-full object-cover" />
              </div>
            </div>

            {/* Review 2: Aman Gupta */}
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    A
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Aman Gupta</h5>
                    <p className="text-[10px] text-slate-400">5 days ago</p>
                  </div>
                </div>
                <div className="text-amber-500 text-xs">★★★★★</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Great quality and portion size. The sour cream added a perfect touch.
                </p>
              </div>
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <img src={product.image} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Healthy CTA Banner (From Mockup) */}
        <div className="my-10 rounded-2xl bg-[#eaf6ee] border border-emerald-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-700 shadow-xs shrink-0">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V15a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Craving something healthy?</h4>
              <p className="text-xs text-slate-600">Explore our range of fresh and nutritious meals, made with love.</p>
            </div>
          </div>

          <Link
            to="/"
            className="rounded-xl border border-emerald-700 bg-white px-5 py-2.5 text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-50 transition shrink-0"
          >
            Browse More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
