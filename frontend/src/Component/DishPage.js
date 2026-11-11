import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, removeCart } from "../utils/cartSlice";
import { addWishlist, removeWishlist } from "../utils/wishlistSlice";
import { API_BASE_URL } from "../utils/Constants";
import UserContext from "./Usercontext";

const getLoggedUser = () => {
  try { return JSON.parse(localStorage.getItem("loggedUser") || "{}"); } catch { return {}; }
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

const RATING_LABELS = { 5: "5 - Excellent", 4: "4 - Very Good", 3: "3 - Average", 2: "2 - Fair", 1: "1 - Poor" };

const DishPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState("description");
  const [selectedPortion, setSelectedPortion] = useState("Full");
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [dishRequest, setDishRequest] = useState({ id: null, product: null, loading: true });
  const [eligibility, setEligibility] = useState({ checking: true, eligible: false, reason: "not_logged_in", message: "", orderId: null });

  const rawName = user?.name || getLoggedUser().name || "Customer";
  const displayName = rawName.includes(" ") ? rawName.trim() : rawName.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  const userEmail = (getLoggedUser().email || user?.email || "").trim().toLowerCase();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loggedUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name && !parsed.name.includes(" ") && /([a-z])([A-Z])/.test(parsed.name)) {
          parsed.name = parsed.name.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
          localStorage.setItem("loggedUser", JSON.stringify(parsed));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const requestId = String(id ?? "");
    setSelectedPortion("Full");
    const controller = new AbortController();
    setDishRequest({ id: requestId, product: null, loading: true });

    (async () => {
      try {
        if (!id) return setDishRequest({ id: requestId, product: null, loading: false });
        const res = await fetch(`${API_BASE_URL}/recipes/${encodeURIComponent(id)}`, { signal: controller.signal });
        if (res.ok) {
          const json = await res.json();
          if (String(json?.id ?? json?._id ?? "") === requestId) {
            return setDishRequest({ id: requestId, product: json, loading: false });
          }
        }
        setDishRequest({ id: requestId, product: null, loading: false });
      } catch (err) {
        if (err.name !== "AbortError") setDishRequest({ id: requestId, product: null, loading: false });
      }
    })();
    return () => controller.abort();
  }, [id]);

  const cartItems = useSelector((store) => store.cart.item);
  const wishlistItems = useSelector((store) => store.wishlist.item);

  const navProduct = location.state?.product;
  const navMatches = navProduct && [navProduct.id, navProduct._id].some((pid) => String(pid) === String(id));
  const reqMatches = dishRequest.id === String(id ?? "");
  const directProduct = reqMatches ? dishRequest.product : null;
  const product = navMatches ? { ...navProduct, ...(directProduct || {}) } : directProduct;
  const loadingDish = !navMatches && (!reqMatches || dishRequest.loading);

  const fetchReviews = async () => {
    if (!product?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/recipes/${product.id}/reviews`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.reviews)) setReviews(json.reviews);
      }
    } catch {}
  };

  const checkEligibility = async () => {
    if (!product?.id) return;
    try {
      try {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const delivered = savedOrders.find((o) => o.status === "Delivered" && Array.isArray(o.items) && o.items.some((it) => String(it.id) === String(product.id)));
        if (delivered) return setEligibility({ checking: false, eligible: true, orderId: delivered.id, message: "Verified Buyer: Order delivered! You can write a review." });
      } catch {}

      if (userEmail) {
        const res = await fetch(`${API_BASE_URL}/recipes/${product.id}/review-eligibility?email=${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) return setEligibility({ checking: false, eligible: json.eligible, reason: json.reason || (json.eligible ? "" : "not_ordered"), message: json.message, orderId: json.orderId || null });
        }
      }

      setEligibility({
        checking: false, eligible: false, reason: userEmail ? "not_ordered" : "not_logged_in",
        message: userEmail ? "Only verified customers who have ordered and received this dish can write a review." : "Log in with your registered email to check review eligibility.",
        orderId: null,
      });
    } catch {
      setEligibility({ checking: false, eligible: false, reason: "error", message: "Only verified buyers with a delivered order can write a review.", orderId: null });
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
          <Link to="/" className="mt-5 inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">Back to Food Menu</Link>
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
  const selectedPortionOption = portionOptions.find((o) => o.value === selectedPortion) || portionOptions[0];
  const portionKey = product.hasPortions ? selectedPortionOption?.value || "Full" : "";
  const inCart = cartItems.find((i) => String(i.id) === String(product.id) && (i.portionSize || (i.hasPortions ? "Full" : "")) === portionKey);
  const cartQty = inCart ? inCart.quantity : 0;
  const isLiked = wishlistItems.some((i) => String(i.id) === String(product.id));
  const price = selectedPortionOption?.price || product.price || 150;
  const isVegDish = product.dietary !== "Non-Veg" && product.isVeg !== false;

  const displayRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : (product.rating ? Number(product.rating).toFixed(1) : "4.3");
  const displayReviewCount = reviews.length > 0 ? reviews.length : (product.reviewCount || 0);

  const ingredientsList = product.ingredients
    ? (Array.isArray(product.ingredients) ? product.ingredients : product.ingredients.split(/(?=[A-Z])|,\s*|\s{2,}/).map((s) => s.trim()).filter(Boolean))
    : ["Fresh Farm Ingredients", "Spices", "Cold-pressed Oil", "Chef Special Blend"];
  const keyFeatures = Array.isArray(product.keyFeatures) ? product.keyFeatures.filter(Boolean) : String(product.keyFeatures || "").split(/[\n,]/).map((f) => f.trim()).filter(Boolean);

  const nutritionRows = [
    { label: "Energy", value: product.caloriesPerServing, unit: "kcal" },
    { label: "Protein", value: product.proteinGrams, unit: "g" },
    { label: "Carbs", value: product.carbsGrams, unit: "g" },
    { label: "Fat", value: product.fatGrams, unit: "g" },
  ].filter(({ value }) => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value)));

  const handleAddToCart = () => {
    dispatch(addCart({ ...product, price, portionSize: product.hasPortions ? portionKey : "", caloriesPerServing: product.caloriesPerServing }));
  };
  const handleRemoveFromCart = () => {
    dispatch(removeCart({ id: product.id, portionSize: portionKey, hasPortions: Boolean(product.hasPortions) }));
  };
  const handleLike = () => {
    if (isLiked) dispatch(removeWishlist(product.id));
    else dispatch(addWishlist(product));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    if (!reviewComment.trim()) return setReviewError("Please enter your review comment.");
    try {
      setSubmittingReview(true);
      const res = await fetch(`${API_BASE_URL}/recipes/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: displayName, userEmail: userEmail || user?.email || "", orderId: eligibility.orderId || null, rating: reviewRating, comment: reviewComment.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewSuccess("Thank you! Your verified review has been submitted.");
        setReviewComment("");
        if (data.review) setReviews((prev) => [data.review, ...prev]);
        else fetchReviews();
        setTimeout(() => { setShowReviewForm(false); setReviewSuccess(""); }, 2000);
      } else {
        setReviewError(data.message || "Failed to submit review.");
      }
    } catch {
      setReviewError("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const eligibilityCards = {
    not_logged_in: {
      title: "Have you received this dish?",
      desc: "Log in with your registered email to write a verified review.",
      action: <Link to="/login" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs shrink-0 self-start sm:self-auto">Log In to Review →</Link>
    },
    order_pending: {
      title: "Your order is on the way!",
      desc: eligibility.message,
      action: eligibility.orderId && <Link to={`/order/${eligibility.orderId}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-xs shrink-0 self-start sm:self-auto">Track Order →</Link>
    },
    not_ordered: {
      title: "Taste it before reviewing!",
      desc: "To keep reviews 100% authentic, reviews unlock once your order for this dish is Delivered.",
      action: <button type="button" onClick={handleAddToCart} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs shrink-0 self-start sm:self-auto cursor-pointer">Order Now (₹{price})</button>
    }
  };

  return (
    <div className="bg-white min-h-screen pt-3 sm:pt-4 pb-12 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-7">
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full h-[340px] sm:h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs group">
              <img src={mainDishImg} alt={product.name} className={`h-full w-full ${product.imageFit === "contain" ? "object-contain p-4 bg-slate-50" : "object-cover"} transition-transform duration-500 group-hover:scale-105`} />
              <button type="button" onClick={handleLike} className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-xs shadow-md transition-transform hover:scale-110 cursor-pointer ${isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"}`} title="Save to favorites" aria-label="Wishlist">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" /></svg>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border shadow-2xs ${
                isVegDish
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}>
                <span className={`flex items-center justify-center h-3.5 w-3.5 rounded-xs border-2 bg-white ${isVegDish ? "border-emerald-600" : "border-rose-600"} p-[1.5px]`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isVegDish ? "bg-emerald-600" : "bg-rose-600"}`} />
                </span>
                <span>{isVegDish ? "Veg" : "Non-Veg"}</span>
              </span>
              {product.category && <span className="text-xs font-semibold text-slate-500">{product.cuisine ? `${product.cuisine} · ` : ""}{product.category}</span>}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                <div className="inline-flex items-center gap-1 font-bold text-white bg-emerald-700 px-2 py-0.5 rounded-md text-[11px] shadow-2xs">
                  <span>{displayRating}</span>
                  <svg className="h-2.5 w-2.5 fill-current text-white" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-slate-500 font-medium">({displayReviewCount} customer {displayReviewCount === 1 ? "review" : "reviews"})</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium">25-35 mins prep & delivery</span>
                {product.caloriesPerServing && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 text-slate-600 font-medium bg-slate-100/80 px-2 py-0.5 rounded-md">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-amber-500" fill="currentColor"><path d="M12 2c.5 2.5 3 4.5 3 8a6 6 0 1 1-12 0c0-3.5 2.5-5.5 3-8a3 3 0 0 0 6 0z" /></svg>
                      <span>{product.caloriesPerServing} kcal</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{product.description || "Prepared fresh to order using aromatic herbs and quality ingredients."}</p>

            {portionOptions.length > 0 && (
              <fieldset className="rounded-lg border border-slate-200 bg-white p-2">
                <legend className="px-1 text-[11px] font-bold text-slate-800">Choose portion</legend>
                <div className="grid grid-cols-3 gap-1.5">
                  {portionOptions.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setSelectedPortion(opt.value)} aria-pressed={portionKey === opt.value} className={`rounded-md border px-1.5 py-1.5 text-center transition cursor-pointer ${portionKey === opt.value ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"}`}>
                      <span className="block text-[10px] font-bold">{opt.label}</span>
                      <span className="mt-0.5 block text-[11px] font-black">₹{opt.price}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/70 space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">₹{price}</span>
                  {product.hasPortions && selectedPortionOption && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">{selectedPortionOption.label}</span>}
                  {(!product.hasPortions || portionKey === "Full") && Number(product.originalPrice) > price && (
                    <>
                      <span className="text-sm font-semibold text-slate-400 line-through">₹{product.originalPrice}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">{Math.round(((product.originalPrice - price) / product.originalPrice) * 100)}% OFF</span>
                    </>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-400">GST & packaging shown at checkout</span>
              </div>

              {product.inStock === false ? (
                <div className="flex items-center justify-center rounded-lg bg-slate-200 text-slate-500 px-4 py-2.5 text-xs font-bold shadow-xs">Currently Sold Out</div>
              ) : cartQty > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-2 w-24 shrink-0 shadow-2xs">
                    <button type="button" onClick={handleRemoveFromCart} className="text-base font-bold text-slate-500 hover:text-slate-900 cursor-pointer leading-none" title="Remove one">−</button>
                    <span className="text-sm font-black text-slate-900 select-none">{cartQty}</span>
                    <button type="button" onClick={handleAddToCart} className="text-base font-bold text-slate-500 hover:text-slate-900 cursor-pointer leading-none" title="Add one more">+</button>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {cartQty} {selectedPortionOption ? `${selectedPortionOption.label.replace(" Plate", "")} ${cartQty === 1 ? "Plate" : "Plates"}` : "in cart"}
                  </span>
                </div>
              ) : (
                <button type="button" onClick={handleAddToCart} className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#137947] hover:bg-[#0e5c36] text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                  <span>{selectedPortionOption ? `Add ${selectedPortionOption.label} to Cart` : "Add to Cart"}</span>
                </button>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#fbfdfb] p-2 flex items-center justify-between gap-1.5 text-slate-700">
              {[
                { title: "Fresh Ingredients", sub: "100% natural" },
                { title: "Fast Delivery", sub: "Within 30 mins" },
                { title: "Hygienic & Safe", sub: "Well packed" },
              ].map((b, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0 text-xs font-bold">✓</div>
                  <div className="leading-tight"><div className="text-[10px] font-bold text-slate-900">{b.title}</div><div className="text-[9px] text-slate-400">{b.sub}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-8 border-b border-slate-100 pb-3 mb-6">
            {[
              { id: "description", label: "Description" },
              { id: "ingredients", label: "Ingredients" },
              { id: "reviews", label: `Reviews (${displayReviewCount})` },
            ].map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-sm text-sm font-semibold transition pb-3 relative cursor-pointer ${activeTab === tab.id ? "text-emerald-800 after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-[2.5px] after:bg-emerald-600 after:rounded-full" : "text-slate-400 hover:text-slate-700"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">{product.description || `A ${product.cuisine || "restaurant"} specialty, prepared fresh to order with quality ingredients.`}</p>
              {(keyFeatures.length > 0 || nutritionRows.length > 0) && (
                <div className={`grid grid-cols-1 gap-3 items-start ${keyFeatures.length && nutritionRows.length ? "md:grid-cols-2" : "md:max-w-2xl"}`}>
                  {keyFeatures.length > 0 && (
                    <div className="rounded-xl border border-slate-100 bg-[#fbfbfb] p-3">
                      <h3 className="text-sm font-black text-slate-900 mb-2">Key Features</h3>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {keyFeatures.map((f, i) => (<li key={i} className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✓</span><span>{f}</span></li>))}
                      </ul>
                    </div>
                  )}
                  {nutritionRows.length > 0 && (
                    <div className="rounded-xl border border-slate-100 bg-[#fbfbfb] p-3">
                      <h3 className="text-sm font-black text-slate-900 mb-1.5">Nutrition Information</h3>
                      <div className="text-xs">
                        {nutritionRows.map(({ label, value, unit }, i) => (
                          <div key={label} className={`flex items-center justify-between py-1.5 ${i < nutritionRows.length - 1 ? "border-b border-slate-100" : ""}`}>
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
                <div><h3 className="text-sm font-bold text-slate-900">Fresh Ingredients</h3><p className="mt-0.5 text-[11px] text-slate-500">Used in this preparation</p></div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">{ingredientsList.length} items</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ingredientsList.map((ing, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-2.5 py-1 font-medium text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-2xl text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">Customer Feedback ({displayReviewCount} {displayReviewCount === 1 ? "review" : "reviews"}):</p>
                {eligibility.eligible ? (
                  <button type="button" onClick={() => { document.getElementById("customer-reviews")?.scrollIntoView({ behavior: "smooth" }); setShowReviewForm(true); }} className="text-emerald-700 hover:underline font-bold text-xs cursor-pointer">+ Write Verified Review</button>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">(Reviews unlocked after delivery)</span>
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
                <p className="italic text-slate-400">No customer reviews yet. Customers who receive this dish can share their review!</p>
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
              <button type="button" onClick={() => { setShowReviewForm(!showReviewForm); setReviewError(""); setReviewSuccess(""); }} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto">
                <span>{showReviewForm ? "Close Form" : "Rate & Review (Verified Buyer)"}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold">Review unlocked on Delivery</span>
              </div>
            )}
          </div>

          {!eligibility.eligible && !eligibility.checking && eligibilityCards[eligibility.reason] && (
            <div className="mb-6 rounded-2xl border border-slate-200/80 bg-linear-to-r from-slate-50 to-emerald-50/20 p-4 sm:p-5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">{eligibilityCards[eligibility.reason].title}</p>
                <p className="text-slate-500 text-[11px]">{eligibilityCards[eligibility.reason].desc}</p>
              </div>
              {eligibilityCards[eligibility.reason].action}
            </div>
          )}

          {showReviewForm && eligibility.eligible && (
            <form onSubmit={handleSubmitReview} className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Write your review for {product.name}</h3>
              {reviewSuccess && <div className="rounded-xl bg-emerald-100 border border-emerald-300 px-3.5 py-2 text-xs font-semibold text-emerald-800">{reviewSuccess}</div>}
              {reviewError && <div className="rounded-xl bg-rose-100 border border-rose-300 px-3.5 py-2 text-xs font-semibold text-rose-800">{reviewError}</div>}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setReviewRating(star)} className={`text-2xl transition cursor-pointer ${star <= reviewRating ? "text-amber-400 hover:text-amber-500 scale-105" : "text-slate-300 hover:text-amber-300"}`} title={`${star} stars`}>★</button>
                  ))}
                  <span className="text-xs font-medium text-slate-600 ml-2">{RATING_LABELS[reviewRating]}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reviewing as</label>
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-3.5 py-2.5 shadow-2xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase shrink-0">{(displayName || "U").charAt(0)}</div>
                  <div className="leading-tight">
                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-900">{displayName}</span><span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-semibold text-emerald-800">Verified Buyer</span></div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Posting review with verified purchase badge</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Review</label>
                <textarea rows={3} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Tell us what you loved about the flavor, portion size, and presentation..." className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none" required />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button type="submit" disabled={submittingReview} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer">{submittingReview ? "Submitting..." : "Submit Review"}</button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer">Cancel</button>
              </div>
            </form>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((rev, idx) => (
                <div key={rev._id || idx} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-[#fbfbfb] p-4 shadow-2xs">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase">{(rev.userName || "U").charAt(0)}</div>
                      <div>
                        <div className="flex items-center gap-2"><h4 className="text-xs font-bold text-slate-900 leading-none">{rev.userName}</h4><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 border border-emerald-100">Verified Customer</span></div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatTimeAgo(rev.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-amber-500 text-xs tracking-wider">{"★".repeat(rev.rating || 5)}{"☆".repeat(5 - (rev.rating || 5))}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                  <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-slate-200"><img src={mainDishImg} alt="" className="h-full w-full object-cover" /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <h4 className="text-xs font-bold text-slate-800">No reviews yet for {product.name}</h4>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1 mb-3">Have you tasted this delicious dish? Be the first to share your experience with other foodies!</p>
              {!showReviewForm && (
                <button type="button" onClick={() => setShowReviewForm(true)} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer">Write the First Review</button>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-[#ebf7eb] border border-emerald-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Craving something healthy?</h4>
            <p className="text-[11px] text-slate-600">Explore our range of fresh and nutritious meals, made with love.</p>
          </div>
          <Link to="/menu" className="rounded-xl border border-emerald-600/80 bg-white px-4 py-2 text-xs font-bold text-emerald-800 shadow-2xs hover:bg-emerald-50 transition shrink-0 self-start sm:self-auto">Browse More →</Link>
        </div>
      </div>
    </div>
  );
};

export default DishPage;
