import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DishCard from "./DishCard";
import { API_BASE_URL } from "../utils/Constants";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const SortIcon = ({ value, isSelected }) => {
  const cls = `h-3.5 w-3.5 shrink-0 ${isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`;
  if (value === "recommended") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </svg>
    );
  }
  if (value === "rating") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill={isSelected ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d={value === "price_asc" ? "m3 16 4 4 4-4M7 20V4M11 4h4M11 8h7M11 12h10" : "m3 8 4-4 4 4M7 4v16M11 4h10M11 8h7M11 12h4"} />
    </svg>
  );
};

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const currentSort = searchParams.get("sort") || "recommended";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const selectedCategories = useMemo(() => {
    if (!categoryParam || categoryParam.toLowerCase() === "all") return [];
    return categoryParam.split(",").map((c) => c.trim()).filter(Boolean);
  }, [categoryParam]);

  const [dishes, setDishes] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 12, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef(null);
  const menuTopRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE_URL}/categories`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted) return;
        setMenuCategories(Array.isArray(data?.categories) ? data.categories.filter((c) => c.isActive !== false) : []);
      })
      .catch(() => { if (mounted) setMenuCategories([]); })
      .finally(() => { if (mounted) setCategoriesLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const updateQuery = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || (key === "category" && val === "All") || (key === "page" && val === 1) || (key === "sort" && val === "recommended")) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(val));
      }
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleToggleCategory = (catName) => {
    const exists = selectedCategories.some((c) => c.toLowerCase() === catName.toLowerCase());
    let next;
    if (exists) {
      next = selectedCategories.filter((c) => c.toLowerCase() !== catName.toLowerCase());
    } else {
      next = [...selectedCategories, catName];
    }
    updateQuery({
      category: next.length > 0 ? next.join(",") : "All",
      page: 1,
    });
  };

  const fetchDishes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParts = [`page=${currentPage}`, "limit=12"];
      if (selectedCategories.length > 0) {
        queryParts.push(`category=${encodeURIComponent(selectedCategories.join(","))}`);
      }
      if (currentSearch) queryParts.push(`search=${encodeURIComponent(currentSearch)}`);
      if (currentSort && currentSort !== "recommended") queryParts.push(`sort=${encodeURIComponent(currentSort)}`);

      const res = await fetch(`${API_BASE_URL}/recipes?${queryParts.join("&")}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.recipes)) {
        setDishes(data.recipes);
        setPagination(data.pagination || { currentPage, limit: 12, totalItems: data.recipes.length, totalPages: Math.ceil(data.recipes.length / 12) || 1 });
      } else {
        setDishes([]);
      }
    } catch (err) {
      setDishes([]);
      setPagination({ currentPage, limit: 12, totalItems: 0, totalPages: 1 });
      setError(err.message || "Could not connect to the menu server.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategories, currentSearch, currentSort]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === currentPage) return;
    updateQuery({ page: newPage });
    menuTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getPaginationItems = () => {
    const total = pagination.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "...", total];
    if (currentPage >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", total];
  };

  const startItem = pagination.totalItems === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
  const endItem = Math.min(currentPage * pagination.limit, pagination.totalItems);

  return (
    <div className="bg-white min-h-[85vh] pt-1 pb-8" ref={menuTopRef}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        {/* Sleek Compact Header Bar */}
        <div className="rounded-xl border border-emerald-100/90 bg-gradient-to-r from-emerald-50/70 via-white to-amber-50/40 px-3 py-1.5 sm:px-4 sm:py-2 mb-2 shadow-2xs">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Explore Food<span className="text-emerald-600">Ninja</span> Menu
              </h1>
              <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[10px] sm:text-[11px] font-bold shadow-xs">
                {pagination.totalItems || dishes.length} Dishes
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setSortOpen((p) => !p)}
                  className={`group flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all duration-150 cursor-pointer shadow-xs ${
                    sortOpen
                      ? "border-emerald-600 bg-white ring-2 ring-emerald-500/15 text-slate-900"
                      : currentSort !== "recommended"
                      ? "border-emerald-500/70 bg-emerald-50/60 text-emerald-950 font-semibold"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  title="Sort dishes"
                >
                  <SortIcon value={currentSort} isSelected={sortOpen || currentSort !== "recommended"} />
                  <span className="text-slate-400 font-normal hidden md:inline">Sort:</span>
                  <span className="font-semibold text-slate-800 tracking-tight text-[11px] sm:text-xs">
                    {SORT_OPTIONS.find((o) => o.value === currentSort)?.label || "Recommended"}
                  </span>
                  <svg className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${sortOpen ? "rotate-180 text-emerald-600" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </button>

                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-900/10 z-50 overflow-hidden">
                    <div className="space-y-0.5" role="listbox">
                      {SORT_OPTIONS.map((opt) => {
                        const isSelected = currentSort === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { updateQuery({ sort: opt.value, page: 1 }); setSortOpen(false); }}
                            className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition cursor-pointer text-left ${
                              isSelected ? "bg-emerald-50 text-emerald-950 font-semibold" : "text-slate-700 hover:bg-slate-50 font-medium"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <SortIcon value={opt.value} isSelected={isSelected} />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <svg className="h-3.5 w-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {(selectedCategories.length > 0 || currentSearch || currentSort !== "recommended") && (
                <button
                  type="button"
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:border-rose-200 hover:bg-rose-50/70 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-rose-700 transition cursor-pointer shadow-xs"
                  title="Reset all filters"
                >
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Compact Categories Selection Bar */}
        {categoriesLoading ? (
          <p className="mb-2 py-2 text-center text-xs text-slate-400">Loading categories…</p>
        ) : menuCategories.length > 0 ? (
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto py-0.5 mb-2.5 scrollbar-none">
            {menuCategories.map((cat) => {
              const isActive = selectedCategories.some((c) => c.toLowerCase() === cat.name.toLowerCase());
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleToggleCategory(cat.name)}
                  className={`group relative flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-lg transition-all duration-150 border text-center cursor-pointer w-[66px] sm:w-[74px] shrink-0 ${cat.bg || "bg-slate-50"} ${
                    isActive
                      ? "border-emerald-600 shadow-xs bg-white/95 ring-2 ring-emerald-500/20"
                      : "border-transparent hover:border-slate-300/80 hover:shadow-xs hover:-translate-y-0.5"
                  }`}
                  title={isActive ? `Deselect ${cat.name}` : `Select ${cat.name}`}
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden bg-white shadow-2xs p-0.5 mb-1 shrink-0">
                    {cat.img ? (
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="h-full w-full rounded-full object-cover transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center rounded-full text-xs font-bold text-emerald-700">
                        {cat.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-bold tracking-tight truncate w-full px-0.5 ${isActive ? "text-emerald-800" : "text-slate-800"}`}>
                    {cat.name}
                  </span>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs text-[8px] font-bold">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Dishes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="h-80 rounded-2xl bg-slate-100 animate-pulse border border-slate-100 p-4 flex flex-col justify-between">
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
            <button type="button" onClick={fetchDishes} className="mt-4 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition">
              Try Again
            </button>
          </div>
        ) : dishes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-16 text-center my-6">
            <h3 className="text-base font-bold text-slate-800">No Dishes Found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">We couldn&apos;t find any dishes matching your current selection.</p>
            <button type="button" onClick={() => setSearchParams(new URLSearchParams())} className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {dishes.map((dish) => (
                <DishCard key={dish.id} data={dish} />
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
              <div>
                Showing <span className="font-bold text-slate-900">{startItem}</span> to <span className="font-bold text-slate-900">{endItem}</span> of <span className="font-bold text-slate-900">{pagination.totalItems}</span> dishes
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-xs text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                    <span>Prev</span>
                  </button>

                  {getPaginationItems().map((item, idx) => (
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="h-8 w-8 flex items-center justify-center font-bold text-xs text-slate-400 select-none">•••</span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handlePageChange(item)}
                        className={`h-8 min-w-[32px] px-2 rounded-lg font-bold text-xs transition ${
                          item === currentPage ? "bg-emerald-600 text-white shadow-xs" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  ))}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-xs text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <span>Next</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
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
