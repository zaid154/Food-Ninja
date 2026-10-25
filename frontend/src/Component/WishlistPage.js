import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearWishlist } from "../utils/wishlistSlice";
import FoodCard from "./food/FoodCard";

const WishlistPage = () => {
    const wishlistItems = useSelector((store) => store.wishlist.item);
    const dispatch = useDispatch();

    // Beautiful empty state when nothing is in wishlist
    if (wishlistItems.length === 0) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-black text-gray-900">
                        Your Wishlist is Empty
                    </h1>
                    <p className="mt-2 text-xs leading-relaxed text-gray-500">
                        Explore our delicious menu and tap the heart icon on any dish to save it to your favorites.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <Link
                            to="/"
                            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700"
                        >
                            Explore Food Menu
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-[85vh] bg-gray-50 px-4 py-8 md:px-6">
            <div className="mx-auto max-w-7xl">
                {/* Header Row */}
                <div className="mb-6 flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">
                            My Favorites
                        </h1>
                        <p className="mt-0.5 text-xs text-gray-500">
                            {wishlistItems.length} {wishlistItems.length === 1 ? "dish" : "dishes"} saved in your wishlist
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => dispatch(clearWishlist())}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:border-red-200 shadow-xs"
                    >
                        Clear All
                    </button>
                </div>

                {/* Uniform Responsive Dishes Grid reusing standard FoodCard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <FoodCard key={item.id} data={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WishlistPage;
