import React, { useMemo, useState, useRef, useEffect } from "react";
import Shimmer from "./Shimmer";
import useResipe from "./useRecipes";
import FoodCard from "./food/FoodCard";

// Mockup Curated Categories with custom pastel colors and images
const PRESET_CATEGORIES = [
  {
    name: "Biryani",
    bg: "bg-[#f4faee]",
    border: "hover:border-emerald-300",
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Pizza",
    bg: "bg-[#fff3eb]",
    border: "hover:border-orange-300",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Burgers",
    bg: "bg-[#fff8e7]",
    border: "hover:border-amber-300",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Chinese",
    bg: "bg-[#fef2f2]",
    border: "hover:border-rose-300",
    img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Indian",
    bg: "bg-[#fef9c3]",
    border: "hover:border-yellow-300",
    img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Italian",
    bg: "bg-[#fdf2f8]",
    border: "hover:border-pink-300",
    img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Beverages",
    bg: "bg-[#f0f9ff]",
    border: "hover:border-sky-300",
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80",
  },
];

const ITEMS_PER_PAGE = 8;

const FoodMenu = () => {
  const data = useResipe();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [under200Only, setUnder200Only] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const sortRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, vegOnly, topRatedOnly, under200Only, sortBy]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & sort dishes
  const filteredFoods = useMemo(() => {
    if (!data || !data.recipes) return [];
    const q = search.trim().toLowerCase();
    const targetCat = selectedCategory.toLowerCase();

    let result = data.recipes.filter((item) => {
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.cuisine && item.cuisine.toLowerCase().includes(q));

      const matchCategory =
        selectedCategory === "All" ||
        (item.category && item.category.toLowerCase().includes(targetCat)) ||
        (item.cuisine && item.cuisine.toLowerCase().includes(targetCat));

      const matchVeg = !vegOnly || item.isVeg;
      const matchRating = !topRatedOnly || (item.rating && item.rating >= 4.5);
      const matchBudget = !under200Only || (item.price && item.price <= 200);

      return matchSearch && matchCategory && matchVeg && matchRating && matchBudget;
    });

    if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [data, search, selectedCategory, vegOnly, topRatedOnly, under200Only, sortBy]);

  // Paginated items
  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);
  const paginatedFoods = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFoods.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFoods, currentPage]);

  if (!data) return <Shimmer />;

  return (
    <div className="bg-white">
      {/* =========================================
          HERO SECTION (Left Screen from Mockup)
      ========================================== */}
      <section className="relative overflow-hidden bg-white pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Fresh Food • Fast Delivery</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Good Food <br />
                Brings People <br />
                <span className="text-emerald-700">Together</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base text-slate-500 max-w-lg leading-relaxed">
                Explore a wide variety of delicious dishes, prepared with fresh ingredients and delivered to your door.
              </p>

              {/* Delivery Address / Search Input Pill */}
              <div className="relative flex items-center rounded-full bg-white border border-slate-200 shadow-md p-1.5 max-w-lg">
                <div className="pl-3 text-emerald-700 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <input
                  id="hero-search-input"
                  type="text"
                  placeholder="Enter your delivery address or dish name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("menu");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full bg-emerald-700 px-7 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition shadow-xs shrink-0"
                >
                  Search
                </button>
              </div>

              {/* 3 Trust Features Under Search */}
              <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg text-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
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

            {/* Right Graphic: Round Food Bowl with Doodle */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Healthy Tasty Fresh Doodle Badge */}
              <div className="absolute top-2 left-4 z-10 text-emerald-800 font-serif rotate-[-12deg] select-none pointer-events-none">
                <span className="text-xl sm:text-2xl font-bold italic tracking-wide">
                  Healthy <br />
                  &nbsp;&nbsp;Tasty <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;Fresh
                </span>
                <svg className="w-16 h-8 text-emerald-600 ml-4 -mt-2" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 30 Q 50 5 90 20" strokeLinecap="round" />
                </svg>
              </div>

              {/* Main Circular Bowl Image with Outer Glow */}
              <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-full overflow-hidden shadow-2xl border-4 border-white/80">
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

      {/* =========================================
          BROWSE BY CATEGORY (From Mockup)
      ========================================== */}
      <section className="py-12 border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
              <p className="text-xs text-slate-500 mt-0.5">Find your favorite cuisine</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          {/* 7 Pastel Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {PRESET_CATEGORIES.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(isActive ? "All" : cat.name)}
                  className={`flex flex-col items-center justify-between p-4 rounded-2xl transition-all duration-200 border text-center ${cat.bg} ${
                    isActive ? "border-emerald-600 shadow-sm ring-2 ring-emerald-500/20" : `border-transparent ${cat.border}`
                  }`}
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-white shadow-xs p-1 mb-3">
                    <img src={cat.img} alt={cat.name} className="h-full w-full object-cover rounded-full" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 mb-2">{cat.name}</span>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs text-slate-700 transition ${
                    isActive ? "bg-emerald-700 text-white" : ""
                  }`}>
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          POPULAR DISHES & MENU (From Mockup)
      ========================================== */}
      <section id="menu" className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular Dishes</h2>
              <p className="text-xs text-slate-500 mt-0.5">Our customers' favorites</p>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  vegOnly
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${vegOnly ? "bg-white" : "bg-emerald-600"}`} />
                Pure Veg
              </button>

              <button
                type="button"
                onClick={() => setTopRatedOnly(!topRatedOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  topRatedOnly
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span>★ Ratings 4.5+</span>
              </button>

              <button
                type="button"
                onClick={() => setUnder200Only(!under200Only)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  under200Only
                    ? "bg-emerald-700 text-white border-emerald-700"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                Under ₹200
              </button>

              {/* Sort dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition"
                >
                  <span>Sort by: {sortBy === "priceAsc" ? "Price Low-High" : sortBy === "priceDesc" ? "Price High-Low" : sortBy === "rating" ? "Rating" : "Relevance"}</span>
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-slate-400" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {sortOpen && (
                  <div className="absolute right-0 mt-1 w-40 rounded-xl border border-slate-100 bg-white py-1 shadow-lg z-20">
                    <button
                      type="button"
                      onClick={() => { setSortBy("default"); setSortOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Relevance
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortBy("rating"); setSortOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Highest Rated
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortBy("priceAsc"); setSortOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Price: Low to High
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortBy("priceDesc"); setSortOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Price: High to Low
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(selectedCategory !== "All" || search || vegOnly || topRatedOnly || under200Only) && (
            <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
              <span>Filtering by:</span>
              {selectedCategory !== "All" && (
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-medium">
                  {selectedCategory}
                </span>
              )}
              {search && (
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-medium">
                  "{search}"
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearch("");
                  setVegOnly(false);
                  setTopRatedOnly(false);
                  setUnder200Only(false);
                  setSortBy("default");
                }}
                className="text-emerald-700 font-semibold hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Food Cards Grid */}
          {paginatedFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedFoods.map((item) => (
                <FoodCard key={item.id} data={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <h3 className="text-base font-bold text-slate-800">No dishes match your filters</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the search or category filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearch("");
                  setVegOnly(false);
                  setTopRatedOnly(false);
                  setUnder200Only(false);
                }}
                className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition ${
                    currentPage === num
                      ? "bg-emerald-700 text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          BETTER FOOD BETTER MOOD PROMO BANNER (From Mockup)
      ========================================== */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#eaf6ee] border border-emerald-100 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Text */}
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Better Food <br />
                  Better Mood
                </h3>
                <p className="text-sm text-slate-600">
                  Freshly prepared meals, just for you.
                </p>
                <div className="pt-3">
                  <a
                    href="#menu"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition"
                  >
                    <span>Explore Menu</span>
                    <span>→</span>
                  </a>
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
                  {/* Eat Good Feel Good Doodle overlay */}
                  <div className="absolute top-3 right-3 rounded-lg bg-white/90 backdrop-blur-xs px-3 py-1 text-center font-serif rotate-3 shadow-xs">
                    <span className="text-xs font-bold italic text-emerald-800">
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

export default FoodMenu;
