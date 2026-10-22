import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useResipe from "./useRecipes";
import { addCart, removeCart } from "../utils/cartSlice";
import { addWishlist, removeWishlist } from "../utils/wishlistSlice";
import { FALLBACK_RECIPES } from "../utils/fallbackDishes";
import { DISH_BORSCHT } from "../assets/mockupImages";

const ProductView = () => {
  const { id } = useParams();
  const apiData = useResipe();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("description");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const cartItems = useSelector((store) => store.cart.item);
  const wishlistItems = useSelector((store) => store.wishlist.item);

  // Available dishes with reliable instant fallback
  const allDishes = (apiData && Array.isArray(apiData.recipes) && apiData.recipes.length > 0)
    ? apiData.recipes
    : FALLBACK_RECIPES;

  // Find dish by ID or fallback to Russian Borscht / First item
  const product = allDishes.find((item) => String(item.id) === String(id))
    || allDishes.find((item) => item.name && item.name.toLowerCase().includes("borscht"))
    || {
        id: 35,
        name: "Russian Borscht",
        cuisine: "Russian",
        category: "Soups & Salads",
        price: 150,
        caloriesPerServing: 150,
        image: DISH_BORSCHT,
        rating: 4.3,
        reviewCount: 86,
        description: "Delicious Russian style Russian Borscht, prepared fresh with aromatic herbs and premium quality ingredients."
      };

  const isBorscht = product.name && product.name.toLowerCase().includes("borscht");
  const mainDishImg = isBorscht ? DISH_BORSCHT : (product.image || DISH_BORSCHT);

  const inCart = cartItems.find((i) => String(i.id) === String(product.id));
  const cartQty = inCart ? inCart.quantity : 0;
  const isLiked = wishlistItems.some((i) => String(i.id) === String(product.id));

  const price = product.price || 150;
  const rating = product.rating ? Number(product.rating).toFixed(1) : "4.3";
  const reviewCount = product.reviewCount || 86;

  // 4 Gallery thumbnails matching the mockup strip
  const gallery = [
    mainDishImg,
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
  ];

  const handleAddToCart = () => {
    // Add the selected quantity to cart
    for (let k = 0; k < quantity; k++) {
      dispatch(addCart({ ...product, caloriesPerServing: price }));
    }
  };

  const handleLike = () => {
    if (isLiked) {
      dispatch(removeWishlist(product.id));
    } else {
      dispatch(addWishlist({ ...product, caloriesPerServing: price }));
    }
  };

  return (
    <div className="bg-white min-h-screen pt-4 sm:pt-6 pb-16 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Top Product Showcase (Gallery on left, Details on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Left Column (Thumbnails Strip + Large Main Dish Image) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 items-start">
            
            {/* Vertical Thumbnail Column */}
            <div className="flex sm:flex-col gap-2.5 order-2 sm:order-1 overflow-x-auto sm:overflow-visible shrink-0">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                    selectedImageIdx === idx
                      ? "border-emerald-600 ring-1 ring-emerald-500/30"
                      : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}

              {/* Down Arrow Button at Bottom of Thumbnail Strip */}
              <button
                type="button"
                onClick={() => setSelectedImageIdx((prev) => (prev + 1) % gallery.length)}
                className="hidden sm:flex h-9 w-9 mx-auto items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition cursor-pointer"
                title="Next image"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Subtle Scroll Placeholder */}
              <div className="hidden sm:block h-6 w-9 mx-auto rounded-md bg-slate-100/60" />
            </div>

            {/* Large Square Featured Image */}
            <div className="relative flex-1 w-full aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xs order-1 sm:order-2">
              <img
                src={gallery[selectedImageIdx]}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300"
              />

              {/* Floating Wishlist Heart Button (Top Right) */}
              <button
                type="button"
                onClick={handleLike}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 cursor-pointer ${
                  isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
                }`}
                title="Save to favorites"
                aria-label="Wishlist"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Dish Info & Purchasing Actions */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Cuisine Pill Tag */}
            <div>
              <span className="inline-block rounded-full bg-[#eef7ee] border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-800">
                {product.cuisine ? `${product.cuisine} Cuisine` : "Russian Cuisine"}
              </span>
            </div>

            {/* Dish Title */}
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Row */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-amber-500 font-bold text-sm">★</span>
              <span className="font-black text-slate-800">{rating}</span>
              <span>({reviewCount} reviews)</span>
            </div>

            {/* 3 Quick Attributes (Serves, Calories, Eco-sealed) */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 pb-1">
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="font-medium">Serves 1-2</span>
              </div>

              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-medium">300 kcal</span>
              </div>

              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span className="font-medium">Eco-sealed container</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs text-slate-500 leading-relaxed">
              {product.description || "Delicious Russian style Russian Borscht, prepared fresh with aromatic herbs and premium quality ingredients."}
            </p>

            {/* Price */}
            <div className="text-3xl font-black text-slate-900 pt-1">
              ₹{price}
            </div>

            {/* Quantity Stepper + Green Add to Cart Button */}
            <div className="flex items-center gap-3 pt-2">
              {/* Stepper */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 w-28 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-base font-bold text-slate-600 hover:text-slate-900 cursor-pointer disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="text-sm font-extrabold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-base font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#137947] hover:bg-[#0e5c36] text-white px-6 py-3.5 text-sm font-bold shadow-xs transition cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span>{cartQty > 0 ? `Add to Cart (${cartQty} in cart)` : "Add to Cart"}</span>
              </button>
            </div>

            {/* 3 Trust Features Container */}
            <div className="rounded-2xl border border-slate-100 bg-[#fbfdfb] p-3.5 flex items-center justify-between gap-2 text-slate-700 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
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
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
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
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
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

        {/* Tabbed Content Navigation (Description, Ingredients, Reviews) */}
        <div className="pt-4 pb-8 border-b border-slate-100 mb-8">
          <div className="flex items-center gap-8 border-b border-slate-100 pb-3 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`text-sm font-semibold transition pb-3 relative cursor-pointer ${
                activeTab === "description"
                  ? "text-emerald-800 after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-[2.5px] after:bg-emerald-600 after:rounded-full"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ingredients")}
              className={`text-sm font-semibold transition pb-3 relative cursor-pointer ${
                activeTab === "ingredients"
                  ? "text-emerald-800 after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-[2.5px] after:bg-emerald-600 after:rounded-full"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Ingredients
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`text-sm font-semibold transition pb-3 relative cursor-pointer ${
                activeTab === "reviews"
                  ? "text-emerald-800 after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-[2.5px] after:bg-emerald-600 after:rounded-full"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Reviews ({reviewCount})
            </button>
          </div>

          {/* Description Tab Body */}
          {activeTab === "description" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Description + Key Features */}
              <div className="lg:col-span-8 space-y-5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  A traditional Russian soup made with fresh beets, vegetables and aromatic herbs. Our Russian Borscht is cooked to perfection and served with a dollop of sour cream for an authentic taste.
                </p>

                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-2.5">Key Features</h3>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Authentic Russian recipe</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Made with fresh vegetables</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Rich in vitamins and nutrients</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Served with sour cream and herbs</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column Nutrition Information Card */}
              <div className="lg:col-span-4 rounded-2xl border border-slate-100 bg-[#fbfbfb] p-5 shadow-2xs">
                <h3 className="text-sm font-black text-slate-900 mb-4">Nutrition Information</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2c.5 2.5 3 4.5 3 8a6 6 0 1 1-12 0c0-3.5 2.5-5.5 3-8a3 3 0 0 0 6 0z" />
                      </svg>
                      <span>Calories</span>
                    </div>
                    <span className="font-bold text-slate-900">300 kcal</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="18" r="3" />
                        <line x1="9" y1="18" x2="15" y2="18" />
                        <line x1="6" y1="12" x2="18" y2="12" />
                      </svg>
                      <span>Protein</span>
                    </div>
                    <span className="font-bold text-slate-900">8 g</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      <span>Carbs</span>
                    </div>
                    <span className="font-bold text-slate-900">45 g</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
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
              <p className="font-medium text-slate-700">Fresh Ingredients used in this preparation:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Fresh Farm Red Beets",
                  "Cabbage & Carrots",
                  "Potatoes",
                  "Sour Cream",
                  "Aromatic Dill & Parsley",
                  "Garlic & Bay Leaves",
                  "Cold-pressed Olive Oil"
                ].map((ing, i) => (
                  <span key={i} className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 font-medium text-slate-800">
                    • {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab Body */}
          {activeTab === "reviews" && (
            <div className="space-y-3 max-w-2xl text-xs text-slate-600">
              <p>Customer feedback from verified FoodNinja deliveries:</p>
              <p className="italic text-slate-500">&quot;Hot, authentic taste, delivered in 25 mins with tamper-evident seal.&quot;</p>
            </div>
          )}

        </div>

        {/* Customer Reviews Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-slate-900">Customer Reviews</h2>
            <span className="text-xs font-semibold text-slate-500">
              {rating} out of 5 ({reviewCount} reviews)
            </span>
          </div>

          <div className="space-y-3">
            {/* Review 1: Sara Khan */}
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-[#fbfbfb] p-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    S
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-none">Sara Khan</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 days ago</p>
                  </div>
                </div>
                <div className="text-amber-500 text-xs">★★★★★</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Really loved the taste! Fresh ingredients and authentic flavor. Will definitely order again.
                </p>
              </div>
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <img src={mainDishImg} alt="" className="h-full w-full object-cover" />
              </div>
            </div>

            {/* Review 2: Aman Gupta */}
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-[#fbfbfb] p-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    A
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-none">Aman Gupta</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">5 days ago</p>
                  </div>
                </div>
                <div className="text-amber-500 text-xs">★★★★★</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Great quality and portion size. The sour cream added a perfect touch.
                </p>
              </div>
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <img src={mainDishImg} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Healthy Promo Card (Exact Mockup Match) */}
        <div className="rounded-2xl bg-[#ebf7eb] border border-emerald-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d7f1d7] text-emerald-700 shrink-0">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V15a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Craving something healthy?</h4>
              <p className="text-[11px] text-slate-600">Explore our range of fresh and nutritious meals, made with love.</p>
            </div>
          </div>

          <Link
            to="/menu"
            className="rounded-xl border border-emerald-600/80 bg-white px-4 py-2 text-xs font-bold text-emerald-800 shadow-2xs hover:bg-emerald-50 transition shrink-0 self-start sm:self-auto"
          >
            Browse More →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ProductView;
