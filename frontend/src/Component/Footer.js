import React from "react";
import { Link } from "react-router-dom";
import { LOGO } from "../utils/Constants";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-xs">
        {/* Brand Col */}
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1.5 shadow-md">
              <img src={LOGO} alt="Food Ninja" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-black text-white">
              Food<span className="text-emerald-500">Ninja</span>
            </span>
          </Link>
          <p className="text-slate-400 leading-relaxed">
            Order restaurant dishes and daily grocery essentials online. Fast delivery and fresh quality guaranteed.
          </p>
          <p className="text-slate-500 pt-1">
            © 2026 Food Ninja Technologies Pvt Ltd.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Explore</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Food Menu</Link></li>
            <li><Link to="/grocery" className="hover:text-emerald-400 transition-colors">Grocery Store</Link></li>
            <li><Link to="/orders" className="hover:text-emerald-400 transition-colors">My Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-emerald-400 transition-colors">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-emerald-400 transition-colors">Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Store Location */}
        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Store Hub</h4>
          <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2665.642120207283!2d77.13818217409751!3d28.704311180820017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d017cd13394f5%3A0x811f2d3fe616d07a!2sPC%20Training%20Institute%20Limited%20(PCTIL)!5e1!3m2!1sen!2sin!4v1769801846833!5m2!1sen!2sin"
              width="100%"
              height="120"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-2 text-slate-400 text-[11px]">
            New Delhi, Delhi 110034, India
          </p>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-4 text-center text-[11px] text-slate-500">
        <p>Food Ninja Delivery Platform • Single Store Model • All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
