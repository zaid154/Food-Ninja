import React, { useMemo, useState } from "react";
import Shimmer from "./Shimmer";
import useResipe from "./useRecipes";
import FoodCard from "./food/FoodCard";

const CATEGORIES = [
  "All",
  "Biryani",
  "North Indian",
  "South Indian",
  "Chinese & Noodles",
  "Pizza",
  "Burgers",
  "Rolls & Wraps",
  "Momos & Dimsum",
  "Mughlai & Kebabs",
  "Pasta & Italian",
  "Desserts & Bakery",
  "Beverages & Shakes"
];

const FoodMenu = () => {
  const data = useResipe();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);

  const filteredFoods = useMemo(() => {
    if (!data || !data.recipes) return [];
    return data.recipes.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        (item.cuisine && item.cuisine.toLowerCase().includes(search.toLowerCase()));
      const matchCategory =
        selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchVeg = vegOnly ? item.isVeg === true : true;
      return matchSearch && matchCategory && matchVeg;
    });
  }, [data, search, selectedCategory, vegOnly]);

  if (!data) return <Shimmer />;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Search Header Bar */}
      <section className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for dishes, cuisines, or restaurants..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 shadow-sm"
            />
            <svg viewBox="0 0 24 24" className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="mx-auto max-w-7xl px-4 pt-6">
        {/* Filters & Categories */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === c
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Pure Veg Filter */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              vegOnly
                ? "border-green-600 bg-green-50 text-green-700 font-bold"
                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className={`flex items-center justify-center h-3 w-3 rounded-sm border ${vegOnly ? 'border-green-600' : 'border-gray-400'} p-[1px]`}>
              <div className={`h-1.5 w-1.5 rounded-full ${vegOnly ? 'bg-green-600' : 'bg-gray-400'}`} />
            </div>
            Pure Veg
          </button>
        </div>

        {/* Dishes Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === "All" ? "Popular Dishes" : `${selectedCategory}`}
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {filteredFoods.length} items
            </span>
          </div>

          {filteredFoods.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-gray-700">No dishes found matching your search.</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("All"); setVegOnly(false); }}
                className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFoods.map((food) => (
                <FoodCard key={food.id} data={food} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FoodMenu;
