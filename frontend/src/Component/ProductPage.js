import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, removeCart } from "../utils/cartSlice";
import { addWishlist, removeWishlist } from "../utils/wishlistSlice";
import { API_BASE_URL } from "../utils/Constants";
import UserContext from "./Usercontext";

const ProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState("description");
  const [selectedPortion, setSelectedPortion] = useState("Full");


  // Automatically pick and format name from logged-in user account
  const rawName = user?.name || (() => {
    try {
      const logged = JSON.parse(localStorage.getItem("loggedUser") || "{}");
      return logged.name || "";
    } catch {
      return "";
    }
  })() || "Mohd Zaid";

  // Fix unspaced PascalCase names like "MohdZaid" -> "Mohd Zaid"
  const displayName = rawName.includes(" ")
    ? rawName.trim()
    : rawName.replace(/([a-z])([A-Z])/g, "$1 $2").trim();

  // Sanitize localStorage if it held "MohdZaid"
  useEffect(() => {
    try {
      const stored = localStorage.getItem("loggedUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name && !parsed.name.includes(" ") && /([a-z])([A-Z])/.test(parsed.name)) {
          parsed.name = parsed.name.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
          localStorage.setItem("loggedUser", JSON.stringify(parsed));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Real Database Reviews State
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [userEmail] = useState(() => {
    try {
      const logged = JSON.parse(localStorage.getItem("loggedUser") || "{}");
      return (logged.email || "").trim().toLowerCase();
    } catch {
      return "";
    }
  });

  // Delivered Order Eligibility State
  const [eligibility, setEligibility] = useState({
    checking: true,
    eligible: false,
    reason: "not_logged_in",
    message: "",
    orderId: null,
  });

  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [dishRequest, setDishRequest] = useState({ id: null, product: null, loading: true });

  // Fetch the canonical dish in the background; card navigation state renders instantly.
  useEffect(() => {
    const requestId = String(id ?? "");
    setSelectedPortion("Full");
    const controller = new AbortController();
    setDishRequest({ id: requestId, product: null, loading: true });

    const fetchDish = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/recipes/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const json = await res.json();
          const responseId = String(json?.id ?? json?._id ?? "");
          if (responseId === requestId) {
            setDishRequest({ id: requestId, product: json, loading: false });
            return;
          }
        }
        setDishRequest({ id: requestId, product: null, loading: false });
      } catch (err) {
        if (err.name !== "AbortError") {
          setDishRequest({ id: requestId, product: null, loading: false });
        }
      }
    };

    if (id) {
      fetchDish();
    } else {
      setDishRequest({ id: requestId, product: null, loading: false });
    }

    return () => controller.abort();
  }, [id]);

  const cartItems = useSelector((store) => store.cart.item);
  const wishlistItems = useSelector((store) => store.wishlist.item);

  const navigationProduct = location.state?.product;
  const navigationProductMatchesId = navigationProduct &&
    [navigationProduct.id, navigationProduct._id].some((productId) => String(productId) === String(id));
  const requestMatchesId = dishRequest.id === String(id ?? "");
  const directProduct = requestMatchesId ? dishRequest.product : null;
  const product = navigationProductMatchesId
    ? { ...navigationProduct, ...(directProduct || {}) }
    : directProduct;
  const loadingDish = !navigationProductMatchesId && (!requestMatchesId || dishRequest.loading);

  // Fetch real reviews from MongoDB
  const fetchReviews = async () => {
    if (!product?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/recipes/${product.id}/reviews`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.reviews)) {
          setReviews(json.reviews);
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  // Check Delivered Order eligibility
  const checkEligibility = async () => {
    if (!product?.id) return;
    try {
      // 1. Check local storage orders first
      try {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const localDelivered = savedOrders.find(
          (o) =>
            o.status === "Delivered" &&
            Array.isArray(o.items) &&
            o.items.some((it) => String(it.id) === String(product.id))
        );
        if (localDelivered) {
          setEligibility({
            checking: false,
            eligible: true,
            orderId: localDelivered.id,
            message: "Verified Buyer: Order delivered! You can write a review.",
          });
          return;
        }
      } catch {
        // ignore localStorage parsing errors
      }

      // 2. Check backend MongoDB delivered orders
      if (userEmail) {
        const res = await fetch(
          `${API_BASE_URL}/recipes/${product.id}/review-eligibility?email=${encodeURIComponent(userEmail)}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setEligibility({
              checking: false,
              eligible: json.eligible,
              reason: json.reason || (json.eligible ? "" : "not_ordered"),
              message: json.message,
              orderId: json.orderId || null,
            });
            return;
          }
        }
      }

      setEligibility({
        checking: false,
        eligible: false,
        reason: userEmail ? "not_ordered" : "not_logged_in",
        message: userEmail
          ? "Only verified customers who have ordered and received this dish can write a review."
          : "Log in with your registered email to check review eligibility.",
        orderId: null,
      });
    } catch {
      setEligibility({
        checking: false,
        eligible: false,
        reason: "error",
        message: "Only verified buyers with a delivered order can write a review.",
        orderId: null,
      });
    }
  };

  useEffect(() => {
    fetchReviews();
    checkEligibility();
  }, [product?.id, userEmail]);

  if (!product) {
    if (loadingDish) {
      return (
        <div aria-busy="true" aria-label="Loading dish" className="min-h-screen bg-white px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-6xl animate-pulse grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="h-[380px] rounded-3xl bg-slate-100 sm:h-[420px]" />
            <div className="space-y-5 py-2">
              <div className="h-5 w-40 rounded bg-slate-100" />
              <div className="h-10 w-3/4 rounded bg-slate-100" />
              <div className="h-5 w-1/2 rounded bg-slate-100" />
              <div className="h-28 rounded-2xl bg-slate-100" />
              <div className="h-16 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <section className="flex min-h-[75vh] items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dish unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">This dish could not be found. Please choose another item from the menu.</p>
          <Link to="/" className="mt-5 inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
            Back to Food Menu
          </Link>
        </div>
      </section>
    );
  }

  const mainDishImg = product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80";

  const portionOptions = product.hasPortions
    ? [
        { value: "Full", label: "Full Plate", price: Number(product.price) },
        ...(Number(product.halfPrice) > 0 ? [{ value: "Half", label: "Half Plate", price: Number(product.halfPrice) }] : []),
        ...(Number(product.quarterPrice) > 0 ? [{ value: "Quarter", label: "Quarter Plate", price: Number(product.quarterPrice) }] : []),
      ]
    : [];
  const selectedPortionOption = portionOptions.find((option) => option.value === selectedPortion) || portionOptions[0];
  const portionKey = product.hasPortions ? selectedPortionOption?.value || "Full" : "";
  const inCart = cartItems.find((i) =>
    String(i.id) === String(product.id) &&
    (i.portionSize || (i.hasPortions ? "Full" : "")) === portionKey
  );
  const cartQty = inCart ? inCart.quantity : 0;
  const isLiked = wishlistItems.some((i) => String(i.id) === String(product.id));

  const price = selectedPortionOption?.price || product.price || 150;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

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
          userName: displayName,
          userEmail: userEmail || user?.email || "",
          orderId: eligibility.orderId || null,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewSuccess("Thank you! Your verified review has been submitted.");
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
    } catch {
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
  const keyFeatures = Array.isArray(product.keyFeatures)
    ? product.keyFeatures.filter(Boolean)
    : String(product.keyFeatures || "").split(/[\n,]/).map((feature) => feature.trim()).filter(Boolean);
  const nutritionRows = [
    { label: "Energy", value: product.caloriesPerServing, unit: "kcal" },
    { label: "Protein", value: product.proteinGrams, unit: "g" },
    { label: "Carbs", value: product.carbsGrams, unit: "g" },
    { label: "Fat", value: product.fatGrams, unit: "g" },
  ].filter(({ value }) => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value)));

  const handleAddToCart = () => {
    dispatch(addCart({
      ...product,
      price,
      portionSize: product.hasPortions ? portionKey : "",
      caloriesPerServing: product.caloriesPerServing,
    }));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeCart({
      id: product.id,
      portionSize: portionKey,
      hasPortions: Boolean(product.hasPortions),
    }));
  };

  const handleLike = () => {
    if (isLiked) {
      dispatch(removeWishlist(product.id));
    } else {
      dispatch(addWishlist(product));
    }
  };

  const isVegDish = product.dietary === "Non-Veg" || product.isVeg === false ? false : true;

  return (
    <div className="bg-white min-h-screen pt-3 sm:pt-4 pb-12 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-7">
          
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full h-[340px] sm:h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs group">
              <img
                src={mainDishImg}
                alt={product.name}
                className={`h-full w-full ${product.imageFit === "contain" ? "object-contain p-4 bg-slate-50" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
              />

              <button
                type="button"
                onClick={handleLike}
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-xs shadow-md transition-transform hover:scale-110 cursor-pointer ${
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

          <div className="lg:col-span-6 flex flex-col space-y-2.5">
            
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${isVegDish ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-red-50 text-red-800 border-red-300"}`}>
                <span className={`h-2.5 w-2.5 rounded-sm border-2 flex items-center justify-center ${isVegDish ? "border-emerald-600" : "border-red-600"}`}>
                  <span className={`h-1 w-1 rounded-full ${isVegDish ? "bg-emerald-600" : "bg-red-600"}`} />
                </span>
                {isVegDish ? "Veg" : "Non-Veg"}
              </span>
              {product.category && (
                <span className="text-xs font-medium text-slate-500">{product.cuisine ? `${product.cuisine}` : ""}{product.cuisine && product.category ? " · " : ""}{product.category}</span>
              )}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                <div className="flex items-center gap-1 font-bold text-slate-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                  <span className="text-amber-500 text-sm leading-none">★</span>
                  <span>{displayRating}</span>
                </div>
                <span className="text-slate-500 font-medium">
                  ({displayReviewCount} customer {displayReviewCount === 1 ? "review" : "reviews"})
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  25-35 mins prep & delivery
                </span>
              </div>
            </div>

            {nutritionRows.some(({ label }) => label === "Energy") && (
              <div className="flex w-fit items-center gap-1.5 rounded-lg border-y border-slate-100 py-2 pr-3 text-xs">
                <div className="h-6 w-6 rounded-md bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2c.5 2.5 3 4.5 3 8a6 6 0 1 1-12 0c0-3.5 2.5-5.5 3-8a3 3 0 0 0 6 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium leading-none">Energy</div>
                  <div className="text-[11px] font-bold text-slate-800 mt-0.5">{product.caloriesPerServing} kcal</div>
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
              {product.description || "Prepared fresh to order using aromatic herbs and quality ingredients."}
            </p>

            {portionOptions.length > 0 && (
              <fieldset className="rounded-lg border border-slate-200 bg-white p-2">
                <legend className="px-1 text-[11px] font-bold text-slate-800">Choose portion</legend>
                <div className="grid grid-cols-3 gap-1.5">
                  {portionOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedPortion(option.value)}
                      aria-pressed={portionKey === option.value}
                      className={`rounded-md border px-1.5 py-1.5 text-center transition ${
                        portionKey === option.value
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20"
                          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                      }`}
                    >
                      <span className="block text-[10px] font-bold">{option.label}</span>
                      <span className="mt-0.5 block text-[11px] font-black">₹{option.price}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/70 space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{price}
                  </span>
                  {product.hasPortions && selectedPortionOption && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {selectedPortionOption.label}
                    </span>
                  )}
                  {(!product.hasPortions || portionKey === "Full") && Number(product.originalPrice) > price && (
                    <>
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        {Math.round(((product.originalPrice - price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  GST & packaging shown at checkout
                </span>
              </div>

              {product.inStock === false ? (
                <div className="flex items-center justify-center rounded-lg bg-slate-200 text-slate-500 px-4 py-2.5 text-xs font-bold shadow-xs">
                  Currently Sold Out
                </div>
              ) : cartQty > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-2 w-24 shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={handleRemoveFromCart}
                      className="text-base font-bold text-slate-500 hover:text-slate-900 cursor-pointer leading-none"
                      title="Remove one"
                    >
                      −
                    </button>
                    <span className="text-sm font-black text-slate-900 select-none">
                      {cartQty}
                    </span>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="text-base font-bold text-slate-500 hover:text-slate-900 cursor-pointer leading-none"
                      title="Add one more"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {cartQty} {selectedPortionOption ? `${selectedPortionOption.label.replace(" Plate", "")} ${cartQty === 1 ? "Plate" : "Plates"}` : "in cart"}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#137947] hover:bg-[#0e5c36] text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>{selectedPortionOption ? `Add ${selectedPortionOption.label} to Cart` : "Add to Cart"}</span>
                </button>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#fbfdfb] p-2 flex items-center justify-between gap-1.5 text-slate-700">
              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V15a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-bold text-slate-900">Fresh Ingredients</div>
                  <div className="text-[9px] text-slate-400">100% natural</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-bold text-slate-900">Fast Delivery</div>
                  <div className="text-[9px] text-slate-400">Within 30 mins</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-bold text-slate-900">Hygienic & Safe</div>
                  <div className="text-[9px] text-slate-400">Well packed</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        <div className="pt-3 pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-8 border-b border-slate-100 pb-3 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`rounded-sm text-sm font-semibold transition pb-3 relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
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
              className={`rounded-sm text-sm font-semibold transition pb-3 relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
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
              className={`rounded-sm text-sm font-semibold transition pb-3 relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                activeTab === "reviews"
                  ? "text-emerald-800 after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-[2.5px] after:bg-emerald-600 after:rounded-full"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Reviews ({displayReviewCount})
            </button>
          </div>

          {activeTab === "description" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description || `A ${product.cuisine || "restaurant"} specialty, prepared fresh to order with quality ingredients.`}
              </p>
              {(keyFeatures.length > 0 || nutritionRows.length > 0) && (
                <div className={`grid grid-cols-1 gap-3 items-start ${keyFeatures.length && nutritionRows.length ? "md:grid-cols-2" : "md:max-w-2xl"}`}>
                  {keyFeatures.length > 0 && (
                    <div className="rounded-xl border border-slate-100 bg-[#fbfbfb] p-3">
                      <h3 className="text-sm font-black text-slate-900 mb-2">Key Features</h3>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {keyFeatures.map((feature, index) => (
                          <li key={`${feature}-${index}`} className="flex items-center gap-2">
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {nutritionRows.length > 0 && (
                    <div className="rounded-xl border border-slate-100 bg-[#fbfbfb] p-3">
                      <h3 className="text-sm font-black text-slate-900 mb-1.5">Nutrition Information</h3>
                      <div className="text-xs">
                        {nutritionRows.map(({ label, value, unit }, index) => (
                          <div key={label} className={`flex items-center justify-between py-1.5 ${index < nutritionRows.length - 1 ? "border-b border-slate-100" : ""}`}>
                            <span className="text-slate-600">{label}</span>
                            <span className="font-bold text-slate-900">{value} {unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="max-w-3xl rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs text-slate-600">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Fresh Ingredients</h3>
                  <p className="mt-0.5 text-[11px] text-slate-500">Used in this preparation</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                  {ingredientsList.length} {ingredientsList.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ingredientsList.map((ing, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-2.5 py-1 font-medium text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-2xl text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">
                  Customer Feedback ({displayReviewCount} {displayReviewCount === 1 ? "review" : "reviews"}):
                </p>
                {eligibility.eligible ? (
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("customer-reviews");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                      setShowReviewForm(true);
                    }}
                    className="text-emerald-700 hover:underline font-bold text-xs cursor-pointer"
                  >
                    + Write Verified Review
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    (Reviews unlocked after delivery)
                  </span>
                )}
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
                  No customer reviews yet. Customers who receive this dish can share their review!
                </p>
              )}
            </div>
          )}

        </div>

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

            {eligibility.eligible ? (
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
                <span>{showReviewForm ? "Close Form" : "Rate & Review (Verified Buyer)"}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Review unlocked on Delivery</span>
                </span>
              </div>
            )}
          </div>

          {!eligibility.eligible && !eligibility.checking && (
            <div className="mb-6 rounded-2xl border border-slate-200/80 bg-linear-to-r from-slate-50 to-emerald-50/20 p-4 sm:p-5 text-xs">
              {eligibility.reason === "not_logged_in" && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Have you received this dish?</p>
                      <p className="text-slate-500 text-[11px]">Log in with your registered email to write a verified review.</p>
                    </div>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    Log In to Review →
                  </Link>
                </div>
              )}

              {eligibility.reason === "order_pending" && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-amber-900">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Your order is on the way!</p>
                      <p className="text-slate-500 text-[11px]">{eligibility.message}</p>
                    </div>
                  </div>
                  {eligibility.orderId && (
                    <Link
                      to={`/order/${eligibility.orderId}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-xs shrink-0 self-start sm:self-auto"
                    >
                      Track Order →
                    </Link>
                  )}
                </div>
              )}

              {eligibility.reason === "not_ordered" && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="6" x2="6" y2="4" />
                        <line x1="10" y1="6" x2="10" y2="4" />
                        <line x1="14" y1="6" x2="14" y2="4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Taste it before reviewing!</p>
                      <p className="text-slate-500 text-[11px]">
                        To keep reviews 100% authentic, reviews unlock once your order for this dish is <strong>Delivered</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    Order Now (₹{price})
                  </button>
                </div>
              )}
            </div>
          )}

          {showReviewForm && eligibility.eligible && (
            <form onSubmit={handleSubmitReview} className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Write your review for {product.name}</h3>

              {reviewSuccess && (
                <div className="rounded-xl bg-emerald-100 border border-emerald-300 px-3.5 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{reviewSuccess}</span>
                </div>
              )}

              {reviewError && (
                <div className="rounded-xl bg-rose-100 border border-rose-300 px-3.5 py-2 text-xs font-semibold text-rose-800 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-rose-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{reviewError}</span>
                </div>
              )}

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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reviewing as</label>
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-3.5 py-2.5 shadow-2xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase shrink-0">
                    {(displayName || "U").charAt(0)}
                  </div>
                  <div className="leading-tight">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{displayName}</span>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-semibold text-emerald-800">
                        Verified Buyer
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Posting review with verified purchase badge
                    </p>
                  </div>
                </div>
              </div>

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

export default ProductPage;
