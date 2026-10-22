import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FoodCard from "./food/FoodCard";
import Shimmer from "./Shimmer";
import { API_BASE_URL } from "../utils/Constants";
import { FALLBACK_RECIPES } from "../utils/fallbackDishes";

const PRESET_CATEGORIES = [
  {
    name: "Biryani",
    bg: "bg-[#f4faee]",
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Pizza",
    bg: "bg-[#fff3eb]",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Burgers",
    bg: "bg-[#fff8e7]",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Chinese",
    bg: "bg-[#fef2f2]",
    img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Indian",
    bg: "bg-[#fef9c3]",
    img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Italian",
    bg: "bg-[#fdf2f8]",
    img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Beverages",
    bg: "bg-[#f0f9ff]",
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [popularDishes, setPopularDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only curated 4 popular dishes from the API
  useEffect(() => {
    let isMounted = true;
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/recipes?limit=4`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json && Array.isArray(json.recipes) && json.recipes.length > 0) {
            setPopularDishes(json.recipes);
            setLoading(false);
            return;
          }
        }
        // Fallback to top 4 fallback recipes if server unreachable
        if (isMounted) {
          setPopularDishes(FALLBACK_RECIPES.slice(0, 4));
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setPopularDishes(FALLBACK_RECIPES.slice(0, 4));
          setLoading(false);
        }
      }
    };

    fetchPopular();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="bg-white">
      {/* ========================================================
          1. HERO SECTION (Clean, human-designed, no badges/labels)
      ======================================================== */}
      <section className="relative overflow-hidden bg-white pt-8 pb-14 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-slate-900 tracking-tight leading-[1.08]">
                Good Food <br />
                Brings People <br />
                <span className="text-emerald-600">Together</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
                Discover handcrafted meals, authentic recipes, and chef specialties delivered piping hot to your doorstep in under 30 minutes.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  <span>Explore Menu</span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <a
                  href="#categories"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Browse Categories
                </a>
              </div>

              {/* 3 Trust Highlights */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 max-w-lg text-slate-700 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-slate-900">Fast Delivery</div>
                    <div className="text-[11px] text-slate-400">Within 30 mins</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V15a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                    </svg>
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-slate-900">Fresh Ingredients</div>
                    <div className="text-[11px] text-slate-400">Always</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-bold text-slate-900">Secure Payment</div>
                    <div className="text-[11px] text-slate-400">100% Safe</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Graphic: Round Food Bowl with Healthy Tasty Fresh Doodle */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Healthy Tasty Fresh Doodle */}
              <div className="absolute top-2 left-6 z-10 text-emerald-700 font-doodle rotate-[-12deg] select-none pointer-events-none">
                <span className="text-3xl sm:text-4xl font-bold leading-none block">
                  Healthy <br />
                  &nbsp;&nbsp;Tasty <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;Fresh
                </span>
                <svg className="w-16 h-8 text-emerald-600 ml-6 mt-1" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M10 25 Q 50 5 90 20" />
                  <path d="M75 12 L 90 20 L 80 32" />
                </svg>
              </div>

              {/* Large Circular Food Bowl */}
              <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
                  alt="Delicious Healthy Bowl"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. BROWSE BY CATEGORY SECTION
      ======================================================== */}
      <section id="categories" className="py-12 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
              <p className="text-xs text-slate-400 mt-1">Select a category to view matching dishes</p>
            </div>
            <Link
              to="/menu"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>View All Menu</span>
              <span>→</span>
            </Link>
          </div>

          {/* 7 Pastel Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {PRESET_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex flex-col items-center justify-between p-4 rounded-2xl transition-all duration-200 border border-transparent hover:border-slate-300 hover:shadow-xs text-center cursor-pointer ${cat.bg}`}
              >
                <div className="h-20 w-20 rounded-full overflow-hidden bg-white shadow-xs p-1 mb-3">
                  <img src={cat.img} alt={cat.name} className="h-full w-full object-cover rounded-full" />
                </div>
                <span className="text-xs font-bold text-slate-800 mb-3">{cat.name}</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs text-slate-600 transition">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. CURATED POPULAR DISHES (Only 4 items, not the full menu)
      ======================================================== */}
      <section className="py-12 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular Dishes</h2>
              <p className="text-xs text-slate-400 mt-1">Our customers' top-rated favorites</p>
            </div>
            <Link
              to="/menu"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>Explore Complete Menu</span>
              <span>→</span>
            </Link>
          </div>

          {/* Grid of 4 Dish Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-slate-200/60" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularDishes.map((item) => (
                <FoodCard key={item.id} data={item} />
              ))}
            </div>
          )}

          {/* Bottom Explore Button */}
          <div className="mt-10 text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
            >
              <span>View Full Menu Catalogue ({popularDishes.length > 0 ? "30+ Dishes" : "Explore"})</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. BETTER FOOD BETTER MOOD BANNER
      ======================================================== */}
      <section className="py-12 pb-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-[#eaf6ee] border border-emerald-100/70 p-8 sm:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Text */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Better Food <br />
                  Better Mood
                </h3>
                <p className="text-sm text-slate-600">
                  Freshly prepared restaurant-grade meals, crafted just for you.
                </p>
                <div className="pt-2">
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition"
                  >
                    <span>Order Now</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Right Dish Banner with Doodle */}
              <div className="lg:col-span-5 relative flex items-center justify-end">
                <div className="relative h-44 sm:h-52 w-full max-w-md rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80"
                    alt="Eat Good Feel Good"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3 rounded-xl bg-white/95 backdrop-blur-xs px-3.5 py-1.5 text-center font-doodle rotate-2 shadow-xs">
                    <span className="text-sm font-bold text-emerald-800 block leading-tight">
                      Eat Good <br />
                      Feel Good
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
