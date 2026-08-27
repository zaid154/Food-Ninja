import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Banner */}
      <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-3">
                <svg className="w-3.5 h-3.5 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Fast Express Delivery
              </span>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Order Delicious Food Online.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Hot, freshly cooked restaurant food delivered right to your doorstep in 25–30 minutes.
              </p>

              {/* Search Bar */}
              <div className="mt-5 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search dishes (e.g. Biryani, Butter Chicken, Pizza, Burger)..."
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none shadow-sm focus:border-emerald-500"
                  />
                  <svg viewBox="0 0 24 24" className="absolute left-3 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Grocery Promo Card */}
            <div className="w-full md:w-80 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-600">Daily Essentials</span>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Instant</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mt-2">Need Groceries & Milk?</h3>
              <p className="text-xs text-slate-500 mt-1">Order fresh milk, fruits, veggies & daily essentials from our store.</p>
              <Link
                to="/grocery"
                className="mt-4 block text-center rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Visit Grocery Store →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Bar */}
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  selectedCategory === c
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
              vegOnly
                ? "border-green-600 bg-green-50 text-green-700"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${vegOnly ? 'bg-green-600' : 'bg-slate-400'}`}></span>
            Pure Veg Only
          </button>
        </div>

        {/* Dishes Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900">
              {selectedCategory === "All" ? "Popular Dishes Near You" : `${selectedCategory} Dishes`}
            </h2>
            <span className="text-xs font-semibold text-slate-500">{filteredFoods.length} items available</span>
          </div>

          {filteredFoods.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-base font-bold text-slate-800">No dishes found matching your filter.</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("All"); setVegOnly(false); }}
                className="mt-3 inline-block text-xs font-bold text-emerald-600 hover:underline"
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
        </div>
      </div>
    </div>
  );
};

export default FoodMenu;
