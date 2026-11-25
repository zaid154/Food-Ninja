import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DishCard from "./DishCard";
import { API_BASE_URL } from "../utils/Constants";

const HomePage = () => {
  const navigate = useNavigate();
  const [addressQuery, setAddressQuery] = useState("");
  const [rawDishes, setRawDishes] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dishes and featured categories from API
  useEffect(() => {
    let isMounted = true;
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const [dishesRes, catRes] = await Promise.all([
          fetch(`${API_BASE_URL}/recipes?all=true`).catch(() => null),
          fetch(`${API_BASE_URL}/categories?featured=true`).catch(() => null),
        ]);

        const dishesJson = dishesRes?.ok ? await dishesRes.json() : null;
        if (isMounted) {
          setRawDishes(Array.isArray(dishesJson?.recipes) ? dishesJson.recipes : []);
        }

        const catJson = catRes?.ok ? await catRes.json() : null;
        if (isMounted) {
          const categories = Array.isArray(catJson?.categories) ? catJson.categories : [];
          setFeaturedCategories(categories.slice(0, 8));
        }
      } catch {
        if (isMounted) {
          setRawDishes([]);
          setFeaturedCategories([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPopular();
    return () => {
      isMounted = false;
    };
  }, []);

  const popularDishes = useMemo(() => rawDishes.slice(0, 4), [rawDishes]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const q = addressQuery.trim();
    if (q) {
      navigate(`/menu?search=${encodeURIComponent(q)}`);
    } else {
      navigate("/menu");
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-white pt-6 pb-12 sm:pt-10 sm:pb-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-slate-900 tracking-tight leading-[1.08]">
                Good Food <br />
                Brings People <br />
                <span className="text-emerald-600">Together</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-500 max-w-md leading-relaxed">
                Explore a wide variety of delicious dishes, prepared with fresh ingredients and delivered to your door.
              </p>

              <form
                onSubmit={handleHeroSearch}
                className="relative flex items-center rounded-full bg-white border border-slate-200 shadow-md p-1.5 max-w-lg"
              >
                <div className="pl-3.5 text-emerald-600 shrink-0">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  value={addressQuery}
                  onChange={(e) => setAddressQuery(e.target.value)}
                  className="flex-1 bg-transparent px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-emerald-700 px-7 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 transition shadow-xs shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </form>

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

            <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
              <div className="absolute -top-2 left-0 sm:-left-8 z-10 text-emerald-700 font-doodle rotate-[-12deg] select-none pointer-events-none">
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

      <section id="categories" className="py-10 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
              <p className="text-xs text-slate-400 mt-1">Find your favorite cuisine</p>
            </div>
            <Link
              to="/menu"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          {loading ? (
            <p className="py-8 text-center text-xs text-slate-400">Loading categories…</p>
          ) : featuredCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {featuredCategories.map((cat) => (
                <button
                  key={cat._id || cat.name}
                  type="button"
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex flex-col items-center justify-between rounded-2xl border border-transparent p-4 text-center transition-all duration-200 hover:border-slate-300 hover:shadow-xs ${cat.bg || "bg-slate-50"}`}
                >
                  <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-xs">
                    {cat.img ? (
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="h-full w-full rounded-full object-cover"
                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <span className="text-lg font-bold text-emerald-700">{cat.name?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="mb-3 text-xs font-bold text-slate-800">{cat.name}</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-600 shadow-xs transition">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-xs text-slate-400">No featured categories are available right now.</p>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular Dishes</h2>
              <p className="text-xs text-slate-400 mt-1">Our customers' favorites</p>
            </div>
            <Link
              to="/menu"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-slate-100 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : popularDishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularDishes.map((item) => (
                <DishCard key={item.id} data={item} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-xs text-slate-400">No dishes are available right now.</p>
          )}
        </div>
      </section>

      <section className="py-8 pb-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-[#eaf6ee] border border-emerald-100/70 p-8 sm:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Better Food <br />
                  Better Mood
                </h3>
                <p className="text-sm text-slate-600">
                  Freshly prepared meals, just for you.
                </p>
                <div className="pt-2">
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition"
                  >
                    <span>Explore Menu</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex items-center justify-end">
                <div className="relative h-44 sm:h-52 w-full max-w-md rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80"
                    alt="Eat Good Feel Good"
                    className="h-full w-full object-cover"
                  />
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

export default HomePage;
