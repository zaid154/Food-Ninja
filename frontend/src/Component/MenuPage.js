import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import FoodCard from "./food/FoodCard";
import Shimmer from "./Shimmer";
import { API_BASE_URL } from "../utils/Constants";
import { FALLBACK_RECIPES } from "../utils/fallbackDishes";

const MENU_CATEGORIES = [
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
    img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Italian",
    bg: "bg-[#fdf2f8]",
    img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Beverages",
    bg: "bg-[#f0f9ff]",
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80",
  },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const currentCategory = searchParams.get("category") || "All";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "recommended";
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // Component state
  const [dishes, setDishes] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const menuTopRef = useRef(null);

  // Helper to update query params while preserving others
  const updateQuery = useCallback(
    (updates) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "" || (key === "category" && value === "All") || (key === "page" && value === 1) || (key === "sort" && value === "recommended")) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Fetch paginated dishes from server
  const fetchDishes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParts = [
        `page=${currentPage}`,
        `limit=12`,
      ];
      if (currentCategory && currentCategory !== "All") {
        queryParts.push(`category=${encodeURIComponent(currentCategory)}`);
      }
      if (currentSearch && currentSearch.trim()) {
        queryParts.push(`search=${encodeURIComponent(currentSearch.trim())}`);
      }
      if (currentSort && currentSort !== "recommended") {
        queryParts.push(`sort=${encodeURIComponent(currentSort)}`);
      }

      const url = `${API_BASE_URL}/recipes?${queryParts.join("&")}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to load menu (${res.status})`);
      }

      const data = await res.json();
      if (data && Array.isArray(data.recipes)) {
        setDishes(data.recipes);
        setPagination(
          data.pagination || {
            currentPage,
            limit: 12,
            totalItems: data.recipes.length,
            totalPages: Math.ceil(data.recipes.length / 12) || 1,
          }
        );
      } else {
        setDishes([]);
      }
    } catch (err) {
      // Fallback on network or server error
      let filtered = [...FALLBACK_RECIPES];
      if (currentCategory && currentCategory !== "All") {
        filtered = filtered.filter(
          (d) =>
            (d.category && d.category.toLowerCase().includes(currentCategory.toLowerCase())) ||
            (d.cuisine && d.cuisine.toLowerCase().includes(currentCategory.toLowerCase()))
        );
      }
      if (currentSearch && currentSearch.trim()) {
        const q = currentSearch.toLowerCase();
        filtered = filtered.filter((d) => d.name.toLowerCase().includes(q));
      }
      if (currentSort === "price_asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (currentSort === "price_desc") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (currentSort === "rating") {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / 12) || 1;
      const start = (currentPage - 1) * 12;
      setDishes(filtered.slice(start, start + 12));
      setPagination({
        currentPage,
        limit: 12,
        totalItems,
        totalPages,
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentCategory, currentSearch, currentSort]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // Handlers
  const handleCategorySelect = (cat) => {
    updateQuery({ category: cat, page: 1 });
  };

  const handleSortChange = (e) => {
    updateQuery({ sort: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === currentPage) return;
    updateQuery({ page: newPage });
    if (menuTopRef.current) {
      menuTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Pagination bounds calculation
  const startItem = pagination.totalItems === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
  const endItem = Math.min(currentPage * pagination.limit, pagination.totalItems);

  return (
    <div className="bg-white min-h-[85vh] py-8 sm:py-12" ref={menuTopRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        
        {/* ========================================================
            1. PAGE HEADER
        ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Our Menu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Browse through handcrafted recipes, fresh salads, gourmet specialties, and beverages prepared fresh on order.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end">
            <label htmlFor="sort-select" className="text-xs font-bold text-slate-600">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={currentSort}
              onChange={handleSortChange}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ========================================================
            2. BROWSE BY CATEGORY (7 Pastel Cards - Exact Mockup)
        ======================================================== */}
        <div className="py-6 sm:py-8 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Browse by Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Select a cuisine to explore matching dishes
              </p>
            </div>

            {/* Quick Status / Reset Pill */}
            <div className="flex items-center gap-2">
              {currentCategory !== "All" ? (
                <button
                  type="button"
                  onClick={() => handleCategorySelect("All")}
                  className="group inline-flex items-center gap-2 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3.5 py-1.5 text-xs font-bold text-emerald-800 transition shadow-2xs cursor-pointer"
                  title="Click to reset to All Categories"
                >
                  <span>
                    Category: <strong className="text-emerald-900">{currentCategory}</strong>
                  </span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 group-hover:bg-emerald-700 text-white text-[10px] transition">
                    ✕
                  </span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>All Dishes ({pagination.totalItems || 38})</span>
                </div>
              )}
            </div>
          </div>

          {/* 7 Spacious Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = currentCategory.toLowerCase() === cat.name.toLowerCase();

              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(isActive ? "All" : cat.name)}
                  className={`group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl transition-all duration-200 border text-center cursor-pointer ${cat.bg} ${
                    isActive
                      ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/30 scale-[1.02]"
                      : "border-transparent hover:border-slate-200 hover:shadow-md hover:-translate-y-1"
                  }`}
                >
                  {/* Circular Image */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-white shadow-xs p-1 mb-3 shrink-0">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="h-full w-full object-cover rounded-full group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Category Name */}
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 mb-3 tracking-tight">
                    {cat.name}
                  </span>

                  {/* Circular Arrow Indicator */}
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full shadow-xs transition duration-200 ${
                      isActive
                        ? "bg-emerald-700 text-white"
                        : "bg-white text-slate-600 group-hover:bg-emerald-700 group-hover:text-white"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            3. ACTIVE FILTERS STATUS BAR
        ======================================================== */}
        {(currentSearch || currentCategory !== "All") && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="font-bold text-slate-600">Active Filters:</span>

            {currentSearch && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-semibold text-slate-800 border border-slate-200 shadow-2xs">
                <span>Search: "{currentSearch}"</span>
                <button
                  type="button"
                  onClick={() => updateQuery({ search: "", page: 1 })}
                  className="text-slate-400 hover:text-slate-700 font-bold ml-1"
                  title="Remove search filter"
                >
                  ✕
                </button>
              </span>
            )}

            {currentCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-800 border border-emerald-200 shadow-2xs">
                <span>Category: {currentCategory}</span>
                <button
                  type="button"
                  onClick={() => updateQuery({ category: "All", page: 1 })}
                  className="text-emerald-600 hover:text-emerald-900 font-bold ml-1"
                  title="Remove category filter"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="ml-auto text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* ========================================================
            4. DISHES GRID OR STATES
        ======================================================== */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="h-80 rounded-2xl bg-slate-100 animate-pulse border border-slate-100 p-4 flex flex-col justify-between"
              >
                <div className="h-44 w-full rounded-xl bg-slate-200" />
                <div className="space-y-2 mt-3">
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded" />
                </div>
                <div className="flex items-center justify-between pt-3">
                  <div className="h-5 w-16 bg-slate-200 rounded" />
                  <div className="h-8 w-20 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-12 text-center my-6">
            <h3 className="text-base font-bold text-rose-800">Unable to Load Dishes</h3>
            <p className="mt-1 text-xs text-rose-600">{error}</p>
            <button
              type="button"
              onClick={fetchDishes}
              className="mt-4 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : dishes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-16 text-center my-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3 text-2xl">
              🍽️
            </div>
            <h3 className="text-base font-bold text-slate-800">No Dishes Found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any dishes matching your current search or category filter.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dishes.map((dish) => (
                <FoodCard key={dish.id} data={dish} />
              ))}
            </div>

            {/* ========================================================
                5. SERVER-SIDE PAGINATION BAR
            ======================================================== */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
              <div>
                Showing <span className="font-bold text-slate-900">{startItem}</span> to{" "}
                <span className="font-bold text-slate-900">{endItem}</span> of{" "}
                <span className="font-bold text-slate-900">{pagination.totalItems}</span> dishes
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ← Prev
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-8 w-8 rounded-lg font-bold text-xs transition ${
                        pageNum === currentPage
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MenuPage;
