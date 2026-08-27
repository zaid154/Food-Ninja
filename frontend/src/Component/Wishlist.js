import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeWishlist, clearWishlist } from "../utils/wishlistSlice";
import { addCart } from "../utils/cartSlice";

const Wishlist = () => {
    const wishlistItems = useSelector((store) => store.wishlist.item);
    const dispatch = useDispatch();

    // empty state when nothing is liked
    if (wishlistItems.length === 0) {
        return (
            <section className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md rounded-lg bg-white p-8 text-center shadow">
                    <h1 className="text-2xl font-bold text-slate-900">
                        No favorites yet
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Tap the heart on any recipe to save it here.
                    </p>
                    <Link
                        to="/"
                        className="mt-5 inline-block rounded-md bg-teal-600 px-5 py-2 text-sm font-semibold text-white"
                    >
                        Browse recipes
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            My Favorites
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                            {wishlistItems.length} recipe{wishlistItems.length > 1 ? "s" : ""} saved
                        </p>
                    </div>

                    <button
                        onClick={() => dispatch(clearWishlist())}
                        className="rounded-sm border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50"
                    >
                        Clear all
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.id}
                            className="overflow-hidden rounded-lg bg-white shadow"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-44 w-full object-cover"
                            />

                            <div className="p-4">
                                <h3 className="text-base font-bold text-slate-900">
                                    {item.name}
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    {item.cuisine} • ₹{item.caloriesPerServing}
                                </p>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => dispatch(addCart(item))}
                                        className="flex-1 rounded-md bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                    >
                                        Add to cart
                                    </button>
                                    <button
                                        onClick={() => dispatch(removeWishlist(item.id))}
                                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-teal-600 hover:bg-teal-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Wishlist;
