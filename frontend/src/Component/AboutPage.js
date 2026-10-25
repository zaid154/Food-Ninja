import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const METRICS = [
  { val: "38+", label: "Signature Dishes" },
  { val: "100%", label: "Cooked Fresh" },
  { val: "25–30m", label: "Express Delivery" },
  { val: "Delhi NCR", label: "Central Kitchen Hub" },
];

const KITCHEN_STEPS = [
  {
    num: "01",
    title: "Fresh Farm Sourcing",
    desc: "Vegetables, dairy, and poultry are procured fresh every morning from verified local suppliers. Zero preservatives or artificial coloring."
  },
  {
    num: "02",
    title: "Dedicated Kitchen Zones",
    desc: "100% strictly segregated cutting boards, utensils, and cooking stations for Vegetarian (Green), Non-Vegetarian (Red), and Vegan meals."
  },
  {
    num: "03",
    title: "Tamper-Evident Thermal Seals",
    desc: "Hot dishes are packed in biodegradable, food-grade thermal containers sealed with security labels to guarantee hygiene."
  },
  {
    num: "04",
    title: "Direct Express Delivery",
    desc: "Dispatched directly from our Connaught Place kitchen via our dedicated delivery fleet within 25–30 minutes flat."
  }
];

const AboutPage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("https://api.github.com/users/zaid154")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white pt-2 sm:pt-4 text-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8 sm:mb-10">
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Fresh Restaurant Food. <br />
              <span className="text-emerald-700">Crafted on Order, Delivered Fast.</span>
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              FoodNinja is our flagship artisanal restaurant and dedicated cloud kitchen based in Connaught Place, New Delhi. Unlike third-party marketplace aggregators, we don&apos;t outsource your food. Every meal on our menu is prepared in-house by our master chefs using fresh morning produce, cold-pressed oils, and authentic regional spice blends.
            </p>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              We maintain strictly segregated, hygienic preparation zones for Vegetarian, Non-Vegetarian, and Vegan dishes. No frozen pre-cooked gravies — only piping hot food delivered within 25–30 minutes flat.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {METRICS.map((m, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 text-center sm:text-left">
                  <p className="text-2xl font-black text-emerald-700">{m.val}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/menu" className="rounded-full bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800">
                Browse Our Menu →
              </Link>
              <Link to="/contact" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900">
                Contact Kitchen Desk
              </Link>
            </div>
          </div>

          {/* Right Visual Image Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80"
                alt="FoodNinja Master Chefs in Kitchen"
                className="h-72 sm:h-80 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5 bg-white border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Culinary Standard</span>
                    <h3 className="text-sm font-black text-slate-900">Connaught Place Central Kitchen</h3>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">FSSAI Verified</span>
                </div>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Every dish is cooked in small artisanal batches using authentic cast-iron woks, clay tandoors, and stone-ground spices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Kitchen Process */}
        <div className="mb-10">
          <div className="mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Kitchen Philosophy</span>
            <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">How FoodNinja Prepares Your Meal</h2>
            <p className="text-xs text-slate-500 mt-0.5">From morning farm sourcing to hot, tamper-evident doorstep dispatch.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KITCHEN_STEPS.map((s) => (
              <div key={s.num} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white text-xs font-mono font-bold mb-3">{s.num}</span>
                <h3 className="text-sm font-black text-slate-900 mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Section: Food Safety + Founder Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
              <h3 className="text-base font-black text-slate-900">Food Safety, Hygiene & Statutory Verification</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">We operate under strict compliance with the Food Safety and Standards Act of India (FSSAI).</p>
            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-3.5">
              <div>
                <strong className="text-slate-900 block font-bold">FSSAI Central Kitchen Registration:</strong>
                <span className="text-slate-500">License No. 13324001000452 (Single Commercial Restaurant & Cloud Kitchen)</span>
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">Registered Office & Kitchen Address:</strong>
                <span className="text-slate-500">FoodNinja Central Kitchen, Connaught Place, New Delhi 110001, India</span>
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">Direct Customer & Order Support:</strong>
                <a href="mailto:foodninja@gmail.com" className="text-emerald-700 font-semibold hover:underline">foodninja@gmail.com</a>
                <span className="text-slate-400 block mt-0.5">Helpline: +91 98765 43210 (Mon–Sun, 9:00 AM – 11:30 PM)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-[#f8fafc] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              {profile ? (
                <img src={profile.avatar_url} alt={profile.name || "Mohd Zaid"} className="h-12 w-12 rounded-full object-cover border-2 border-emerald-600 shadow-xs" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-white font-black text-lg">MZ</div>
              )}
              <div>
                <h3 className="text-sm font-black text-slate-900">{profile ? profile.name : "Mohd Zaid"}</h3>
                <p className="text-[11px] font-semibold text-emerald-700">Founder & Engineering Lead • github.com/zaid154</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic border-t border-slate-200/60 pt-3.5">
              &quot;We founded FoodNinja with a simple commitment: exceptional, chef-crafted meals without compromising on kitchen hygiene, authentic ingredients, or speed. Every line of code on this web platform and every recipe cooked in our kitchen is crafted with genuine passion.&quot;
            </p>
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>Full-Stack Architecture (MERN)</span>
              <a href={profile ? profile.html_url : "https://github.com/zaid154"} target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">
                View GitHub Profile →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
