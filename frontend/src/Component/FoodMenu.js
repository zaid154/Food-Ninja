import React, { useMemo, useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import useResipe from "./useRecipes";
import FoodCard from "./food/FoodCard";

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

const FoodMenu = () => {
  const data = useResipe();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewAllDishes, setViewAllDishes] = useState(false);

  useEffect(() => {
    // scroll reset on category change
  }, [selectedCategory, search]);

  // Order popular dishes exactly as in mockup:
  // 1. Russian Borscht (35)
  // 2. Lebanese Falafel Wrap (37)
  // 3. South Indian Masala Dosa (36)
  // 4. Brazilian Caipirinha (38)
  const allDishes = useMemo(() => {
    if (!data || !data.recipes) return [];
    const list = [...data.recipes];

    // Find the 4 mockup favorites
    const borscht = list.find((i) => i.id === 35 || i.name.toLowerCase().includes("borscht"));
    const falafel = list.find((i) => i.id === 37 || i.name.toLowerCase().includes("falafel"));
    const dosa = list.find((i) => i.id === 36 || i.name.toLowerCase().includes("dosa"));
    const caipirinha = list.find((i) => i.id === 38 || i.name.toLowerCase().includes("caipirinha"));

    const featured = [borscht, falafel, dosa, caipirinha].filter(Boolean);
    const rest = list.filter((i) => !featured.some((f) => f.id === i.id));

    return [...featured, ...rest];
  }, [data]);

  // Filtered dishes based on category & search
  const filteredDishes = useMemo(() => {
    let result = allDishes;
    const q = search.trim().toLowerCase();
    const targetCat = selectedCategory.toLowerCase();

    if (q) {
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.category && i.category.toLowerCase().includes(q)) ||
          (i.cuisine && i.cuisine.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (i) =>
          (i.category && i.category.toLowerCase().includes(targetCat)) ||
          (i.cuisine && i.cuisine.toLowerCase().includes(targetCat))
      );
    }

    return result;
  }, [allDishes, search, selectedCategory]);

  // If not in view all and no filters applied, display exactly the 4 popular mockup dishes
  const displayedDishes = useMemo(() => {
    if (viewAllDishes || search || selectedCategory !== "All") {
      return filteredDishes;
    }
    return filteredDishes.slice(0, 4);
  }, [filteredDishes, viewAllDishes, search, selectedCategory]);

  if (!data) return <Shimmer />;

  return (
    <div className="bg-white">
      {/* ========================================================
          1. HERO SECTION (1:1 from Mockup Left Screen)
      ======================================================== */}
      <section className="relative overflow-hidden bg-white pt-6 pb-14 sm:pt-10 sm:pb-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge: • Fresh Food • Fast Delivery */}
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Fresh Food • Fast Delivery</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-slate-900 tracking-tight leading-[1.08]">
                Good Food <br />
                Brings People <br />
                <span className="text-emerald-600">Together</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-500 max-w-md leading-relaxed">
                Explore a wide variety of delicious dishes, prepared with fresh ingredients and delivered to your door.
              </p>

              {/* Delivery Address / Search Input Pill */}
              <div className="relative flex items-center rounded-full bg-white border border-slate-200 shadow-md p-1.5 max-w-lg">
                <div className="pl-3.5 text-emerald-600 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <input
                  id="hero-search-input"
                  type="text"
                  placeholder="Enter your delivery address"
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
                  className="rounded-full bg-emerald-700 px-7 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 transition shadow-xs shrink-0"
                >
                  Search
                </button>
              </div>

              {/* 3 Trust Features Under Search */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 max-w-lg text-slate-700">
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
          2. BROWSE BY CATEGORY (1:1 from Mockup Left Screen)
      ======================================================== */}
      <section className="py-10 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
              <p className="text-xs text-slate-400 mt-1">Find your favorite cuisine</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setViewAllDishes(true);
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          {/* 7 Pastel Category Cards in exact order */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {PRESET_CATEGORIES.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(isActive ? "All" : cat.name)}
                  className={`flex flex-col items-center justify-between p-4 rounded-2xl transition-all duration-200 border text-center cursor-pointer ${cat.bg} ${
                    isActive ? "border-emerald-600 shadow-sm ring-2 ring-emerald-500/20" : "border-transparent hover:border-slate-300"
                  }`}
                >
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-white shadow-xs p-1 mb-3">
                    <img src={cat.img} alt={cat.name} className="h-full w-full object-cover rounded-full" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 mb-3">{cat.name}</span>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs text-slate-600 transition ${
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

      {/* ========================================================
          3. POPULAR DISHES (1:1 from Mockup Left Screen)
      ======================================================== */}
      <section id="menu" className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular Dishes</h2>
              <p className="text-xs text-slate-400 mt-1">Our customers' favorites</p>
            </div>
            <button
              type="button"
              onClick={() => setViewAllDishes(!viewAllDishes)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>{viewAllDishes ? "Show Less" : "View All"}</span>
              <span>→</span>
            </button>
          </div>

          {/* Active Filter Pill Status if filtered */}
          {(selectedCategory !== "All" || search) && (
            <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
              <span>Showing:</span>
              {selectedCategory !== "All" && (
                <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md">
                  {selectedCategory}
                </span>
              )}
              {search && (
                <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-md">
                  "{search}"
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearch("");
                }}
                className="text-emerald-700 font-bold hover:underline ml-2"
              >
                Clear
              </button>
            </div>
          )}

          {/* Grid of 4 Dish Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedDishes.map((item) => (
              <FoodCard key={item.id} data={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. BETTER FOOD BETTER MOOD BANNER (1:1 from Mockup)
      ======================================================== */}
      <section className="py-8 pb-16">
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
                  Freshly prepared meals, just for you.
                </p>
                <div className="pt-2">
                  <a
                    href="#menu"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition"
                  >
                    <span>Explore Menu</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Right Dish Banner with "Eat Good Feel Good" Doodle */}
              <div className="lg:col-span-5 relative flex items-center justify-end">
                <div className="relative h-44 sm:h-52 w-full max-w-md rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80"
                    alt="Eat Good Feel Good"
                    className="h-full w-full object-cover"
                  />
                  {/* Eat Good Feel Good Doodle overlay */}
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

export default FoodMenu;
