import React, { useMemo, useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import useResipe from "./useRecipes";
import FoodCard from "./food/FoodCard";

// Mockup Assets
import heroCompositionImg from "../assets/mockup/hero_composition.png";
import bannerCompositionImg from "../assets/mockup/banner_composition.png";
import catBiryaniImg from "../assets/mockup/icon_cat_biryani.png";
import catPizzaImg from "../assets/mockup/icon_cat_pizza.png";
import catBurgerImg from "../assets/mockup/icon_cat_burger.png";
import catChineseImg from "../assets/mockup/icon_cat_chinese.png";
import catIndianImg from "../assets/mockup/icon_cat_indian.png";
import catItalianImg from "../assets/mockup/icon_cat_italian.png";
import catBeveragesImg from "../assets/mockup/icon_cat_beverages.png";

// Mockup 4 Popular Dishes images
import dishBorschtImg from "../assets/mockup/dish_img_borscht.png";
import dishFalafelImg from "../assets/mockup/dish_img_falafel.png";
import dishDosaImg from "../assets/mockup/dish_img_dosa.png";
import dishCaipirinhaImg from "../assets/mockup/dish_img_caipirinha.png";

const PRESET_CATEGORIES = [
  { name: "Biryani", bg: "bg-[#f2f9ed]", icon: catBiryaniImg },
  { name: "Pizza", bg: "bg-[#fff1e8]", icon: catPizzaImg },
  { name: "Burgers", bg: "bg-[#ffede6]", icon: catBurgerImg },
  { name: "Chinese", bg: "bg-[#f7f1ee]", icon: catChineseImg },
  { name: "Indian", bg: "bg-[#fff7e6]", icon: catIndianImg },
  { name: "Italian", bg: "bg-[#fbeff5]", icon: catItalianImg },
  { name: "Beverages", bg: "bg-[#edf4ff]", icon: catBeveragesImg },
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

    // Find the 4 mockup favorites and attach exact mockup visuals
    let borscht = list.find((i) => i.id === 35 || i.name.toLowerCase().includes("borscht"));
    let falafel = list.find((i) => i.id === 37 || i.name.toLowerCase().includes("falafel"));
    let dosa = list.find((i) => i.id === 36 || i.name.toLowerCase().includes("dosa"));
    let caipirinha = list.find((i) => i.id === 38 || i.name.toLowerCase().includes("caipirinha"));

    // Map exact visuals if found
    if (borscht) borscht = { ...borscht, image: dishBorschtImg, rating: 4.3, price: 150 };
    if (falafel) falafel = { ...falafel, image: dishFalafelImg, rating: 4.7, price: 160 };
    if (dosa) dosa = { ...dosa, image: dishDosaImg, rating: 4.4, price: 160 };
    if (caipirinha) caipirinha = { ...caipirinha, image: dishCaipirinhaImg, rating: 4.2, price: 170 };

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
          1. HERO SECTION (100% Mockup Match Left Screen)
      ======================================================== */}
      <section className="relative overflow-hidden bg-white pt-4 pb-10 sm:pt-6 sm:pb-14">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-5">
              {/* Badge: • Fresh Food • Fast Delivery */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-1.5 text-xs font-bold text-[#1b7a43] border border-[#d2edd6]">
                <span className="h-2 w-2 rounded-full bg-[#1b7a43]" />
                <span>Fresh Food • Fast Delivery</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-900 tracking-tight leading-[1.1]">
                Good Food <br />
                Brings People <br />
                <span className="text-emerald-600">Together</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-500 max-w-md leading-relaxed">
                Explore a wide variety of delicious dishes, prepared with fresh ingredients and delivered to your door.
              </p>

              {/* Delivery Address / Search Input Pill */}
              <div className="relative flex items-center rounded-full bg-white border border-slate-200 shadow-sm p-1.5 max-w-lg">
                <div className="pl-3.5 text-emerald-600 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
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
                  className="rounded-full bg-emerald-700 px-7 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 transition shadow-xs shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* 3 Trust Features Under Search */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 max-w-lg text-slate-700">
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

            {/* Right Graphic: Exact Mockup Roasted Chicken Salad Bowl + "Healthy Tasty Fresh" Doodle */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <img
                src={heroCompositionImg}
                alt="Good Food Brings People Together"
                className="w-full max-w-[500px] h-auto object-contain select-none pointer-events-none drop-shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. BROWSE BY CATEGORY (1:1 from Mockup Left Screen)
      ======================================================== */}
      <section id="categories" className="py-8 bg-white border-t border-slate-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-[26px] font-black tracking-tight text-slate-900">
                Browse by Category
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Find your favorite cuisine
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setViewAllDishes(true);
              }}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group cursor-pointer"
            >
              <span>View All</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          {/* 7 Pastel Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {PRESET_CATEGORIES.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(isActive ? "All" : cat.name);
                    const el = document.getElementById("menu");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`group flex flex-col items-center justify-between rounded-2xl ${cat.bg} p-3.5 pt-4 pb-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                    isActive ? "ring-2 ring-emerald-600 shadow-sm" : ""
                  }`}
                >
                  {/* Category Dish Thumbnail */}
                  <div className="h-14 w-14 flex items-center justify-center transition-transform group-hover:scale-110">
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain drop-shadow-xs"
                      loading="lazy"
                    />
                  </div>

                  {/* Category Name */}
                  <div className="mt-2 text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {cat.name}
                  </div>

                  {/* Circular White Arrow Button */}
                  <div className="mt-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs group-hover:bg-emerald-600 transition">
                    <svg viewBox="0 0 20 20" className="h-3 w-3 text-slate-600 group-hover:text-white transition" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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
      <section id="menu" className="py-10 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-[26px] font-black tracking-tight text-slate-900">
                Popular Dishes
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                {selectedCategory !== "All"
                  ? `Showing results for ${selectedCategory}`
                  : "Our customers' favorites"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewAllDishes(!viewAllDishes)}
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group cursor-pointer"
            >
              <span>{viewAllDishes ? "Show Less" : "View All"}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          {displayedDishes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
              <p className="text-base font-semibold text-slate-700">No dishes found matching your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-3 text-xs font-bold text-emerald-700 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedDishes.map((dish) => (
                <FoodCard key={dish.id} data={dish} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          4. "BETTER FOOD BETTER MOOD" BANNER (1:1 from Mockup)
      ======================================================== */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-[#ebf4ed] border border-[#dceee0] px-8 py-8 sm:px-12 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            {/* Left Content */}
            <div className="space-y-3 z-10 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 tracking-tight leading-tight">
                Better Food <br />
                Better Mood
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Freshly prepared meals, just for you.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewAllDishes(true);
                    const el = document.getElementById("menu");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-emerald-800 transition shadow-xs cursor-pointer"
                >
                  <span>Explore Menu</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Falling Mint Leaf Accent */}
            <div className="hidden lg:block absolute left-1/3 top-1/2 -translate-y-1/2 opacity-80 pointer-events-none">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-600 rotate-45" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.54 0 3-.35 4.31-.97L12 16.71V12h4.71l4.32-4.31C20.65 6.16 16.7 2 12 2z" />
              </svg>
            </div>

            {/* Right Graphic: Platter + "Eat Good Feel Good" Doodle */}
            <div className="relative shrink-0 max-w-md">
              <img
                src={bannerCompositionImg}
                alt="Eat Good Feel Good"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoodMenu;
