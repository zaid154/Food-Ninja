import React, { useMemo, useState } from "react";
import Shimmer from "./Shimmer.js";
import usegroceries from "./Usegroceries";
import GroceryCard from "./grocery/GroceryCard";
import { GROCERY_CATEGORIES } from "./admin/AdminGroceries";

const Grocery = () => {
  const Grocery_data = usegroceries();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...GROCERY_CATEGORIES];

  const products = useMemo(() => {
    if (!Grocery_data?.products) return [];
    return Grocery_data.products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(query.toLowerCase()));
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [Grocery_data, query, selectedCategory]);

  if (!Grocery_data) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <Shimmer />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 pb-16">
      {/* Header / Search */}
      <div className="border-b border-slate-200 bg-white py-8 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Fresh Daily Store</span>
            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl mt-1">
              Groceries & Essentials
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Delivered to your home in 15–20 minutes.</p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search milk, bread, butter, fruits, oil..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-4 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:bg-white"
            />
            <svg viewBox="0 0 24 24" className="absolute left-3 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mx-auto max-w-7xl flex flex-wrap gap-2 mt-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === c
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            {selectedCategory === "All" ? "All Grocery Essentials" : selectedCategory}
          </h2>
          <span className="text-xs text-slate-500 font-medium">{products.length} products</span>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-base font-bold text-slate-800">No grocery products found.</p>
            <button
              onClick={() => { setQuery(""); setSelectedCategory("All"); }}
              className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <GroceryCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Grocery;
