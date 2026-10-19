import React, { useMemo, useState } from "react";
import Shimmer from "./Shimmer";
import useResipe from "./useRecipes";
import FoodCard from "./food/FoodCard";

const FoodMenu = () => {
  const data = useResipe();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // Dynamically extract categories from database recipes
  const categories = useMemo(() => {
    if (!data || !data.recipes) {
      return ["All", "Biryani", "North Indian", "Pizza", "Burgers", "Chinese", "Rolls", "Momos", "Beverages", "Desserts", "Italian"];
    }
    const catSet = new Set();
    data.recipes.forEach((item) => {
      if (item.category) catSet.add(item.category);
    });
    return ["All", ...Array.from(catSet)];
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

      return matchSearch && matchCategory && matchVeg && matchRating;
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
  }, [data, search, selectedCategory, vegOnly, topRatedOnly, sortBy]);

  const hasActiveFilters = search || selectedCategory !== "All" || vegOnly || topRatedOnly || sortBy !== "default";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setVegOnly(false);
    setTopRatedOnly(false);
    setSortBy("default");
  };

  const isLoading = !data;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Search & Filter Header */}
      <section className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Centered Search Bar */}
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

          {/* Quick Filters Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              {/* Pure Veg */}
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  vegOnly
                    ? "border-green-600 bg-green-50 text-green-700 font-bold"
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
                className={`flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  topRatedOnly
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-amber-500">★</span>
                <span>Ratings 4.5+</span>
              </button>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 outline-none hover:bg-gray-50 cursor-pointer shadow-xs"
              >
                <option value="default">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-800 hover:underline"
              >
                Reset filters
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
                      ? "bg-slate-900 text-white shadow-sm"
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
