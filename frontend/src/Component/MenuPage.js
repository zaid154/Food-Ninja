import { useState, useEffect, useCallback, useRef } from "react";
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

const getSortOptionIcon = (value, isSelected) => {
  const iconClass = `h-3.5 w-3.5 shrink-0 transition-colors ${
    isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
  }`;

  switch (value) {
    case "recommended":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
      );
    case "price_asc":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 16 4 4 4-4" />
          <path d="M7 20V4" />
          <path d="M11 4h4" />
          <path d="M11 8h7" />
          <path d="M11 12h10" />
        </svg>
      );
    case "price_desc":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 8 4-4 4 4" />
          <path d="M7 4v16" />
          <path d="M11 12h10" />
          <path d="M11 16h7" />
          <path d="M11 20h4" />
        </svg>
      );
    case "rating":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    default:
      return null;
  }
};

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const currentCategory = searchParams.get("category") || "All";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "recommended";
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // Component state
  const [dishes, setDishes] = useState([]);
  const [menuCategories, setMenuCategories] = useState(MENU_CATEGORIES);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const categoryCarouselRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoryCarouselRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      categoryCarouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Fetch dynamic categories created by Admin
  useEffect(() => {
    if (typeof fetch !== "undefined") {
      fetch(`${API_BASE_URL}/categories`)
        .then((r) => r.json())
        .then((data) => {
          if (data && data.categories && data.categories.length > 0) {
            setMenuCategories(data.categories.filter((c) => c.isActive !== false));
          }
        })
        .catch(() => {});
    }
  }, []);
  const [error, setError] = useState(null);

  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);
  const menuTopRef = useRef(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        const catLower = currentCategory.trim().toLowerCase();
        if (catLower === "indian") {
          const indianCuisines = [
            "indian", "north indian", "south indian", "punjabi", "awadhi", "mughlai",
            "rajasthani", "kashmiri", "himachali", "bihari", "gujarati", "maharashtrian",
            "goan", "chettinad", "kerala", "hyderabadi", "andhra", "karnataka", "bengali",
            "odisha", "assamese", "naga", "khasi / meghalaya", "kolkata street food", "indo-chinese"
          ];
          filtered = filtered.filter(
            (d) =>
              (d.category && /indian/i.test(d.category)) ||
              (d.cuisine && indianCuisines.some((c) => c.toLowerCase() === d.cuisine.toLowerCase()))
          );
        } else {
          filtered = filtered.filter(
            (d) =>
              (d.category && d.category.toLowerCase().includes(catLower)) ||
              (d.cuisine && d.cuisine.toLowerCase().includes(catLower))
          );
        }
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

  // Smart truncated pagination with ellipsis (prevents long row of 14+ buttons)
  const getPaginationItems = () => {
    const total = pagination.totalPages;
    const current = currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }

    if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  // Pagination bounds calculation
  const startItem = pagination.totalItems === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
  const endItem = Math.min(currentPage * pagination.limit, pagination.totalItems);

  return (
    <div className="bg-white min-h-[85vh] pt-2 sm:pt-4 pb-12" ref={menuTopRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        
        {/* ========================================================
            1. UNIFIED PAGE HEADER & CONTROLS (Compact & Above Fold)
        ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4 sm:mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Explore Our Menu
              </h1>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-bold border border-emerald-200/60">
                {pagination.totalItems || 38} Dishes
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select a cuisine or search below to discover freshly prepared recipes
            </p>
          </div>

          {/* Modern Themed Sort Dropdown & Quick Reset */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Custom Themed Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setSortOpen((prev) => !prev)}
                className={`group flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-all duration-150 cursor-pointer shadow-xs ${
                  sortOpen
                    ? "border-emerald-600 bg-white ring-2 ring-emerald-500/15 text-slate-900"
                    : currentSort !== "recommended"
                    ? "border-emerald-500/70 bg-emerald-50/60 text-emerald-950 font-semibold hover:border-emerald-600"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                title="Sort dishes"
              >
                {/* Universal Sort Icon */}
                <svg
                  className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                    sortOpen || currentSort !== "recommended"
                      ? "text-emerald-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21 16-4 4-4-4" />
                  <path d="M17 20V4" />
                  <path d="m3 8 4-4 4 4" />
                  <path d="M7 4v16" />
                </svg>

                <span className="text-slate-400 font-normal hidden sm:inline">Sort:</span>
                <span className="font-semibold text-slate-800 tracking-tight">
                  {SORT_OPTIONS.find((o) => o.value === currentSort)?.label || "Recommended"}
                </span>

                {/* Rotating Chevron */}
                <svg
                  className={`h-3 w-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                    sortOpen ? "rotate-180 text-emerald-600" : "group-hover:text-slate-600"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Floating Popover Menu */}
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-900/10 z-50 overflow-hidden">
                  <div className="space-y-0.5" role="listbox">
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = currentSort === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            updateQuery({ sort: opt.value, page: 1 });
                            setSortOpen(false);
                          }}
                          className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition duration-150 cursor-pointer text-left ${
                            isSelected
                              ? "bg-emerald-50 text-emerald-950 font-semibold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {getSortOptionIcon(opt.value, isSelected)}
                            <span>{opt.label}</span>
                          </div>

                          {isSelected && (
                            <svg
                              className="h-3.5 w-3.5 text-emerald-600 shrink-0"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Reset All Filters Button */}
            {(currentCategory !== "All" || currentSearch || currentSort !== "recommended") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:border-rose-200 hover:bg-rose-50/70 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 transition cursor-pointer shadow-xs"
                title="Reset all filters"
              >
                <svg
                  className="h-3 w-3 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================
            2. CATEGORY CAROUSEL (Scalable: Supports 8 to 90+ categories with Arrow Navigation)
        ======================================================== */}
        <div className="relative mb-4 sm:mb-5 group/carousel">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollCategories("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white transition -ml-2 sm:-ml-4 cursor-pointer hidden sm:flex"
            aria-label="Scroll categories left"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollCategories("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white transition -mr-2 sm:-mr-4 cursor-pointer hidden sm:flex"
            aria-label="Scroll categories right"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Horizontal Scroll Track */}
          <div
            ref={categoryCarouselRef}
            className="flex gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth px-1"
          >
            {menuCategories.map((cat) => {
              const isActive = currentCategory.toLowerCase() === cat.name.toLowerCase();

              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(isActive ? "All" : cat.name)}
                  className={`group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border-2 text-center cursor-pointer w-[120px] sm:w-[140px] shrink-0 ${cat.bg || "bg-slate-50"} ${
                    isActive
                      ? "border-emerald-600 shadow-md bg-white/95 ring-2 ring-emerald-500/20"
                      : "border-transparent hover:border-slate-300/80 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {/* Circular Image */}
                  <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full overflow-hidden bg-white shadow-xs p-1 mb-2.5 shrink-0">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="h-full w-full object-cover rounded-full group-hover:scale-105 transition duration-300"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80"; }}
                    />
                  </div>

                  {/* Category Name */}
                  <span className="text-xs font-extrabold text-slate-800 mb-1.5 tracking-tight truncate w-full px-1">
                    {cat.name}
                  </span>

                  {/* Circular Indicator */}
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full shadow-xs transition duration-200 ${
                      isActive
                        ? "bg-emerald-700 text-white"
                        : "bg-white text-slate-600 group-hover:bg-emerald-700 group-hover:text-white"
                    }`}
                  >
                    {isActive ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            3. ACTIVE FILTERS STATUS BAR (Single, Clean, Not Duplicated)
        ======================================================== */}
        {(currentSearch || currentCategory !== "All") && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5 p-2 px-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-500">Active Filter:</span>

              {currentCategory !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 font-bold border border-emerald-200 shadow-2xs">
                  <span>Category: <strong>{currentCategory}</strong></span>
                  <button
                    type="button"
                    onClick={() => updateQuery({ category: "All", page: 1 })}
                    className="hover:text-emerald-950 font-black text-xs cursor-pointer ml-0.5"
                    title="Remove category filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {currentSearch && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-800 px-2.5 py-0.5 font-bold border border-slate-200 shadow-2xs">
                  <span>Search: "<strong>{currentSearch}</strong>"</span>
                  <button
                    type="button"
                    onClick={() => updateQuery({ search: "", page: 1 })}
                    className="hover:text-slate-950 font-black text-xs cursor-pointer ml-0.5"
                    title="Clear search"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="font-bold text-emerald-700 hover:text-emerald-900 underline transition cursor-pointer text-xs"
            >
              Clear All
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="6" x2="6" y2="4" />
                <line x1="10" y1="6" x2="10" y2="4" />
                <line x1="14" y1="6" x2="14" y2="4" />
              </svg>
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
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-xs text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>Prev</span>
                  </button>

                  {/* Smart Truncated Page Numbers */}
                  {getPaginationItems().map((item, idx) => {
                    if (item === "...") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="h-8 w-8 flex items-center justify-center font-bold text-xs text-slate-400 select-none"
                        >
                          •••
                        </span>
                      );
                    }
                    const pageNum = item;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-8 min-w-[32px] px-2 rounded-lg font-bold text-xs transition ${
                          pageNum === currentPage
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-xs text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <span>Next</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
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
