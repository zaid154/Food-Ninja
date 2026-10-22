import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#111928] text-slate-300 mt-20 pt-14 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                  <path d="M4 13c0 4.418 3.582 8 8 8s8-3.582 8-8H4z" fill="#ffffff" />
                  <path d="M12 4c-3 0-5 2.5-5 5.5 0 2.5 2 4.5 5 4.5s5-2 5-4.5c0-3-2-5.5-5-5.5zm0 2c1.8 0 3 1.5 3 3.5 0 1.2-.8 2.5-3 2.5s-3-1.3-3-2.5C9 7.5 10.2 6 12 6z" fill="#10b981" />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Food<span className="text-emerald-500">Ninja</span>
                </span>
                <span className="block text-[10px] font-medium text-slate-400 tracking-wider">
                  Restaurant Food Delivery
                </span>
              </div>
            </Link>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed max-w-xs">
              Delicious meals crafted with fresh ingredients, delivered hot and fresh directly to your doorstep.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <a href="#menu" className="hover:text-emerald-400 transition-colors">Menu</a>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex items-center gap-3 text-slate-400">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-emerald-700 hover:text-white transition">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-emerald-700 hover:text-white transition">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-emerald-700 hover:text-white transition">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-emerald-700 hover:text-white transition">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-slate-500">
          <p>© 2025 FoodNinja. All rights reserved.</p>
          <p className="font-medium text-slate-400">Good Food • Happy People</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
