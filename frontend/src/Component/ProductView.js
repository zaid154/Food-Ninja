import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useResipe from "./useRecipes";
import { addCart, removeCart } from "../utils/cartSlice";
import { addWishlist, removeWishlist } from "../utils/wishlistSlice";
import { FALLBACK_RECIPES } from "../utils/fallbackDishes";
import { DISH_BORSCHT } from "../assets/mockupImages";
import { API_BASE_URL } from "../utils/Constants";

const ProductView = () => {
  const { id } = useParams();
  const apiData = useResipe();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);

  // Real Database Reviews State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState(() => {
    try {
      const logged = JSON.parse(localStorage.getItem("loggedUser") || "{}");
      return logged.name || "";
    } catch {
      return "";
    }
  });
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

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

  // Fetch real reviews from MongoDB
  const fetchReviews = async () => {
    if (!product?.id) return;
    try {
      setLoadingReviews(true);
      const res = await fetch(`${API_BASE_URL}/recipes/${product.id}/reviews`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.reviews)) {
          setReviews(json.reviews);
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product?.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!reviewName.trim()) {
      setReviewError("Please enter your name.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Please enter your review comment.");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await fetch(`${API_BASE_URL}/recipes/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewSuccess("Thank you! Your review has been submitted.");
        setReviewComment("");
        if (data.review) {
          setReviews((prev) => [data.review, ...prev]);
        } else {
          fetchReviews();
        }
        setTimeout(() => {
          setShowReviewForm(false);
          setReviewSuccess("");
        }, 2000);
      } else {
        setReviewError(data.message || "Failed to submit review.");
      }
    } catch (err) {
      setReviewError("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const displayRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (product.rating ? Number(product.rating).toFixed(1) : "4.3");

  const displayReviewCount = reviews.length > 0
    ? reviews.length
    : (product.reviewCount || 0);

  const ingredientsList = product.ingredients
    ? (Array.isArray(product.ingredients)
        ? product.ingredients
        : product.ingredients.split(/(?=[A-Z])|,\s*|\s{2,}/).map((s) => s.trim()).filter(Boolean))
    : [
        "Fresh Farm Red Beets",
        "Cabbage & Carrots",
        "Potatoes",
        "Sour Cream",
        "Aromatic Dill & Parsley",
        "Garlic & Bay Leaves",
        "Cold-pressed Olive Oil"
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

        {/* Top Product Showcase (Single Hero Dish Image on left, Details on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-10">
          
          {/* Left Column: Prominent Single Authentic Dish Image */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
              <img
                src={mainDishImg}
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
          <div className="lg:col-span-6 space-y-4">
            
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
              <span className="font-black text-slate-800">{displayRating}</span>
              <span>({displayReviewCount} reviews)</span>
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
              Reviews ({displayReviewCount})
            </button>
          </div>

          {/* Description Tab Body */}
          {activeTab === "description" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Description + Key Features */}
              <div className="lg:col-span-8 space-y-5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isBorscht
                    ? "A traditional Russian soup made with fresh beets, vegetables and aromatic herbs. Our Russian Borscht is cooked to perfection and served with a dollop of sour cream for an authentic taste."
                    : (product.description || `A traditional ${product.cuisine || ""} specialty, prepared fresh to order with aromatic herbs and premium quality ingredients.`)}
                </p>

                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-2.5">Key Features</h3>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{isBorscht ? "Authentic Russian recipe" : `Authentic ${product.cuisine || "chef"} recipe`}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Made with fresh ingredients</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Rich in authentic taste & nutrients</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{isBorscht ? "Served with sour cream and herbs" : "Prepared fresh to order"}</span>
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
                {ingredientsList.map((ing, i) => (
                  <span key={i} className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 font-medium text-slate-800">
                    • {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab Body */}
          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-2xl text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">
                  Customer Feedback ({displayReviewCount} {displayReviewCount === 1 ? "review" : "reviews"}):
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("customer-reviews");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    setShowReviewForm(true);
                  }}
                  className="text-emerald-700 hover:underline font-bold text-xs cursor-pointer"
                >
                  + Add Review
                </button>
              </div>

              {reviews.length > 0 ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{reviews[0].userName}:</span>
                    <span className="text-amber-500">{"★".repeat(reviews[0].rating)}</span>
                    <span className="text-[10px] text-slate-400">({formatTimeAgo(reviews[0].createdAt)})</span>
                  </div>
                  <p className="italic text-slate-600">&quot;{reviews[0].comment}&quot;</p>
                </div>
              ) : (
                <p className="italic text-slate-400">
                  No customer reviews yet. Be the first to share your experience below!
                </p>
              )}
            </div>
          )}

        </div>

        {/* Customer Reviews Section */}
        <div id="customer-reviews" className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-amber-500 text-sm">{"★".repeat(Math.round(Number(displayRating) || 5))}</span>
                <span className="text-xs font-bold text-slate-800">{displayRating} out of 5</span>
                <span className="text-xs text-slate-400">({displayReviewCount} {displayReviewCount === 1 ? "review" : "reviews"})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowReviewForm(!showReviewForm);
                setReviewError("");
                setReviewSuccess("");
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>{showReviewForm ? "Close Form" : "Write a Review"}</span>
            </button>
          </div>

          {/* Inline Write a Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Write your review for {product.name}</h3>

              {reviewSuccess && (
                <div className="rounded-xl bg-emerald-100 border border-emerald-300 px-3.5 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <span>✓</span>
                  <span>{reviewSuccess}</span>
                </div>
              )}

              {reviewError && (
                <div className="rounded-xl bg-rose-100 border border-rose-300 px-3.5 py-2 text-xs font-semibold text-rose-800 flex items-center gap-2">
                  <span>⚠</span>
                  <span>{reviewError}</span>
                </div>
              )}

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl transition cursor-pointer ${
                        star <= reviewRating ? "text-amber-400 hover:text-amber-500 scale-105" : "text-slate-300 hover:text-amber-300"
                      }`}
                      title={`${star} star${star > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-medium text-slate-600 ml-2">
                    {reviewRating === 5 && "5 - Excellent"}
                    {reviewRating === 4 && "4 - Very Good"}
                    {reviewRating === 3 && "3 - Average"}
                    {reviewRating === 2 && "2 - Fair"}
                    {reviewRating === 1 && "1 - Poor"}
                  </span>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Mohd Zaid"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Review</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us what you loved about the flavor, portion size, and presentation..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Real Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((rev, idx) => (
                <div key={rev._id || idx} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-[#fbfbfb] p-4 shadow-2xs">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase">
                        {(rev.userName || "U").charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 leading-none">{rev.userName}</h4>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 border border-emerald-100">
                            Verified Customer
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatTimeAgo(rev.createdAt)}</p>
                      </div>
                    </div>

                    <div className="text-amber-500 text-xs tracking-wider">
                      {"★".repeat(rev.rating || 5)}{"☆".repeat(5 - (rev.rating || 5))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>

                  <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <img src={mainDishImg} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-slate-800">No reviews yet for {product.name}</h4>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1 mb-3">
                Have you tasted this delicious dish? Be the first to share your experience with other foodies!
              </p>
              {!showReviewForm && (
                <button
                  type="button"
                  onClick={() => setShowReviewForm(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Write the First Review
                </button>
              )}
            </div>
          )}
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
