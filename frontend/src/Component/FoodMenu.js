import React, { useMemo, useState, useRef, useEffect } from "react";
import Shimmer from "./Shimmer";
import useResipe from "./useRecipes";
import FoodCard from "./food/FoodCard";

const CORE_CATEGORIES = [
  "All",
  "Biryani",
  "North Indian",
  "Pizza",
  "Burgers",
  "Chinese",
  "Rolls",
  "Momos",
  "Beverages",
  "Desserts",
  "Italian",
];

const FoodMenu = () => {
  const data = useResipe();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [under200Only, setUnder200Only] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef(null);

  // Close custom sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prioritize core Indian/Global food categories first, then extra cuisines
  const categories = useMemo(() => {
    if (!data || !data.recipes) return CORE_CATEGORIES;
    const catSet = new Set();
    data.recipes.forEach((item) => {
      if (item.category) catSet.add(item.category);
    });

    const existingCategories = Array.from(catSet);
    const ordered = ["All"];

    CORE_CATEGORIES.forEach((c) => {
      if (c !== "All" && existingCategories.includes(c)) {
        ordered.push(c);
      }
    });

    existingCategories.forEach((c) => {
      if (!ordered.includes(c)) {
        ordered.push(c);
      }
    });

    return ordered;
  }, [data]);

  // Clean, interview-friendly filter & sorting logic
  const filteredFoods = useMemo(() => {
    if (!data || !data.recipes) return [];
    const q = search.trim().toLowerCase();
    const targetCat = selectedCategory.toLowerCase();

    // 1. Filter dishes
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

    // 2. Sort dishes
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [data, search, selectedCategory, vegOnly, topRatedOnly, under200Only, sortBy]);

  const hasActiveFilters =
    search ||
    selectedCategory !== "All" ||
    vegOnly ||
    topRatedOnly ||
    under200Only ||
    sortBy !== "default";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setVegOnly(false);
    setTopRatedOnly(false);
    setUnder200Only(false);
    setSortBy("default");
    setSortOpen(false);
  };

  const sortOptions = [
    { id: "default", label: "Sort by: Relevance" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "rating", label: "Customer Rating" },
  ];

  const currentSortLabel = sortOptions.find((o) => o.id === sortBy)?.label || "Sort";
  const isLoading = !data;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Search & Filter Header (Swiggy / Zomato Inspired) */}
      <section className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Search Input with Instant Clear */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, cuisines, or restaurants..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100 shadow-sm"
            />
            <svg viewBox="0 0 24 24" className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 text-xs font-bold"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Chips & Sleek Custom Sort */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              {/* Pure Veg */}
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  vegOnly
                    ? "border-green-600 bg-green-50 text-green-700 font-bold shadow-xs"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className={`flex items-center justify-center h-3 w-3 rounded-sm border ${vegOnly ? 'border-green-600' : 'border-gray-400'} p-[1px]`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${vegOnly ? 'bg-green-600' : 'bg-gray-400'}`} />
                </div>
                <span>Pure Veg</span>
              </button>

              {/* Rating 4.5+ */}
              <button
                type="button"
                onClick={() => setTopRatedOnly(!topRatedOnly)}
                className={`flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  topRatedOnly
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold shadow-xs"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-amber-500">★</span>
                <span>Ratings 4.5+</span>
              </button>

              {/* Budget Under ₹200 */}
              <button
                type="button"
                onClick={() => setUnder200Only(!under200Only)}
                className={`flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  under200Only
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold shadow-xs"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>Under ₹200</span>
              </button>

              {/* Custom Sleek Sort Dropdown (No ugly HTML select) */}
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setSortOpen(!sortOpen)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition shadow-xs ${
                    sortBy !== "default"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{currentSortLabel}</span>
                  <svg
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {sortOpen && (
                  <div className="absolute left-0 mt-1.5 w-44 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg z-30">
                    {sortOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium transition flex items-center justify-between ${
                          sortBy === opt.id
                            ? "bg-emerald-50 text-emerald-800 font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <span className="text-emerald-600 font-black">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>✕</span> Reset filters
              </button>
            )}
          </div>

          {/* Clean Category Chips (Single-Row Horizontal Scroll) */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth">
            {categories.map((c) => {
              const isActive = selectedCategory === c;
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm font-semibold"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="mx-auto max-w-7xl px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCategory === "All" ? "Popular Dishes" : `${selectedCategory}`}
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            {isLoading ? "Loading menu..." : `${filteredFoods.length} dishes`}
          </span>
        </div>

        {isLoading ? (
          <Shimmer />
        ) : filteredFoods.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-gray-700">No dishes found matching your selected filters.</p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} data={food} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FoodMenu;
