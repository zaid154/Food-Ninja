import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, LOGO } from "../utils/Constants";

const Footer = () => {
  const [settings, setSettings] = useState({
    restaurantName: "Food Ninja",
    fssaiNumber: "10020011000123",
    gstinNumber: "07AAAAF1234A1Z5",
    storeAddress: "Shop 12, Food Street, Sector 62, Delhi NCR",
    storePhone: "+91 98765 43210",
  });

  useEffect(() => {
    if (typeof fetch !== "undefined") {
      fetch(`${API_BASE_URL}/settings`)
        .then((r) => r.json())
        .then((d) => {
          if (d && d.settings) setSettings(d.settings);
        })
        .catch(() => {});
    }
  }, []);

  return (
    <footer className="bg-[#111928] text-slate-300 mt-10 sm:mt-12 pt-10 sm:pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img src={LOGO} alt="Food Ninja" className="h-10 w-10 rounded-full object-cover p-0.5 bg-white shadow-xs" />
              <span className="font-black text-xl tracking-tight text-white">Food<span className="text-emerald-400">Ninja</span></span>
            </Link>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed max-w-xs">
              Delicious meals crafted with fresh ingredients, delivered hot and fresh directly to your doorstep.
            </p>
            {settings.storePhone && (
              <p className="mt-3 text-xs text-emerald-400 font-semibold">
                Helpline: {settings.storePhone}
              </p>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-emerald-400 transition-colors">Menu</Link>
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
            <h4 className="text-sm font-semibold text-white mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">Help Center & Support</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
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
          <div>
            <p>© {new Date().getFullYear()} {settings.restaurantName || "Food Ninja"}. All rights reserved.</p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              FSSAI Lic. No: {settings.fssaiNumber || "10020011000123"} • GSTIN: {settings.gstinNumber || "07AAAAF1234A1Z5"}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="font-medium text-slate-400">Good Food • Happy People</p>
            {settings.storeAddress && (
              <p className="text-[10px] text-slate-500 mt-0.5">{settings.storeAddress}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
