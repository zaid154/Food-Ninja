import React, { useState, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import { clearWishlist } from "../utils/wishlistSlice";
import UserContext from "./Usercontext";
import { LOGO } from "../utils/Constants";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const adminSession = sessionStorage.getItem("adminAuth") === "true";
    const isUserAdmin = user && user.email === "admin@foodninja.com";
    setIsAdmin(adminSession || isUserAdmin);
  }, [user, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    sessionStorage.removeItem("adminAuth");
    setIsAdmin(false);
    dispatch(clearCart());
    dispatch(clearWishlist());
    setUser(null);
    navigate("/login");
  };

  const cartItem = useSelector((state) => state.cart.item);
  const cartCount = cartItem.reduce((n, i) => n + (i.quantity || 1), 0);

  const wishlistItem = useSelector((state) => state.wishlist.item);
  const wishlistCount = wishlistItem.length;

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "text-emerald-700 bg-emerald-50/80 font-semibold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 p-1">
            <img src={LOGO} alt="Food Ninja" className="h-full w-full object-contain" />
          </div>
          <div className="leading-none">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Food<span className="text-emerald-600">Ninja</span>
            </span>
            <span className="hidden sm:block text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
              Restaurant Food Delivery
            </span>
          </div>
        </Link>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Food Menu
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            My Orders
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Subtle Wishlist Button */}
          <Link
            to="/wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 transition"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Primary Cart Action */}
          <Link
            to="/cart"
            className="flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-emerald-700">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Admin Dashboard Quick Access */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-slate-900 text-white hover:bg-slate-800 transition"
              title="Admin Console"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Link>
          )}

          {/* User Profile / Auth */}
          {user ? (
            <div className="flex h-9 items-center gap-2 pl-2 border-l border-slate-200">
              <span className="hidden sm:inline text-xs font-medium text-slate-700 max-w-[110px] truncate">
                {user.name || user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex h-9 items-center rounded-lg border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className={linkClass}>Food Menu</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)} className={linkClass}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)} className={linkClass}>Contact</NavLink>
          <NavLink to="/orders" onClick={() => setMenuOpen(false)} className={linkClass}>My Orders</NavLink>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-1.5 text-sm font-semibold text-emerald-600">
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
