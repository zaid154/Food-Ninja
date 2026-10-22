import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import { clearWishlist } from "../utils/wishlistSlice";
import UserContext from "./Usercontext";
import { LOGO } from "../utils/Constants";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const adminSession = sessionStorage.getItem("adminAuth") === "true";
    const isUserAdmin = user && user.email === "admin@foodninja.com";
    setIsAdmin(adminSession || isUserAdmin);
  }, [user, location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    sessionStorage.removeItem("adminAuth");
    setIsAdmin(false);
    dispatch(clearCart());
    dispatch(clearWishlist());
    setUser(null);
    setUserDropdown(false);
    navigate("/login");
  };

  const cartItem = useSelector((state) => state.cart.item);
  const cartCount = cartItem.reduce((n, i) => n + (i.quantity || 1), 0);

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors py-1 ${
      isActive
        ? "text-slate-900 font-semibold after:absolute after:bottom-[-18px] after:left-0 after:right-0 after:h-[2.5px] after:bg-emerald-700 after:rounded-full"
        : "text-slate-600 hover:text-slate-900"
    }`;

  // Get first letter of username or "M"
  const userInitial = user ? (user.name ? user.name[0].toUpperCase() : "M") : "M";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white p-2 shadow-xs group-hover:bg-emerald-700 transition">
            {/* Bowl with sprout leaf icon */}
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
              <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V15a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7zm-1 16h2v3a1 1 0 0 1-1 1h0a1 1 0 0 1-1-1v-3z" opacity="0.3" />
              <path d="M4 12c0 4.42 3.58 8 8 8s8-3.58 8-8H4z" />
              <path d="M11 6a3 3 0 0 1 3-3c1.66 0 3 1.34 3 3 0 2.21-3 6-3 6s-3-3.79-3-6z" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Food<span className="text-emerald-700">Ninja</span>
            </span>
            <span className="block text-[10px] font-medium text-slate-400 tracking-wider">
              Restaurant Food Delivery
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <a
            href="#menu"
            onClick={(e) => {
              if (location.pathname !== "/") {
                navigate("/#menu");
              } else {
                const el = document.getElementById("menu");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer"
          >
            Menu
          </a>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4">
          {/* Search trigger icon */}
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("hero-search-input");
              if (input) {
                input.focus();
                input.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="flex h-9 w-9 items-center justify-center text-slate-600 hover:text-slate-900 transition"
            title="Search dishes"
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Cart Icon with Counter Badge */}
          <Link
            to="/cart"
            className="relative flex h-9 w-9 items-center justify-center text-slate-600 hover:text-slate-900 transition"
            title="Cart"
            aria-label="Cart"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="sr-only">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile Avatar with Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-1.5 focus:outline-none"
                aria-expanded={userDropdown}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-xs">
                  {userInitial}
                </div>
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-400" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name || "Customer"}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setUserDropdown(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setUserDropdown(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    My Wishlist
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdown(false)}
                      className="block px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-slate-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
            aria-label="Toggle mobile menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-800">
            Home
          </Link>
          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-800"
          >
            Menu
          </a>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-800">
            About
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-800">
            Contact
          </Link>
          <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-800">
            My Orders
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
