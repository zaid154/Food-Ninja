import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="bg-gray-50 min-h-[85vh]">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              About Food Ninja
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Fresh Restaurant Food — Delivered Ninja Fast.
            </h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
              Food Ninja is designed to provide quick, chef-crafted meals at lightning speed. We partner with top-rated local kitchens and restaurants to ensure every order arrives fresh, piping hot, and right on time.
            </p>

            {/* Redesigned Modern Stats Grid */}
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center sm:text-left">
                <p className="text-2xl font-black text-emerald-600">38+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Dishes
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center sm:text-left">
                <p className="text-2xl font-black text-emerald-600">10+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Cuisines
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center sm:text-left">
                <p className="text-2xl font-black text-emerald-600">25–30m</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Delivery
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center sm:text-left">
                <p className="text-2xl font-black text-emerald-600">Delhi NCR</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Coverage
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700"
              >
                Browse Food Menu
              </Link>
              <Link
                to="/contact"
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Right Image Card */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=70"
                alt="Plated meal"
                className="h-72 w-full object-cover md:h-88"
                loading="lazy"
              />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Our Mission
                </p>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  Delivering chef-crafted recipes effortlessly with exceptional speed, authentic hygiene, and premium quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Quality & Hygiene",
              body: "Every recipe is prepared with fresh ingredients, authentic spices, and inspected for highest safety standards.",
              icon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              )
            },
            {
              title: "Ninja Speed Delivery",
              body: "State-of-the-art delivery routing gets your food from kitchen to doorstep in 25–30 minutes flat.",
              icon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )
            },
            {
              title: "Transparent Pricing",
              body: "Zero hidden charges. Clear, fair pricing with live order tracking and instant order support.",
              icon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              )
            }
          ].map((v) => (
            <div key={v.title} className="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
              {v.icon}
              <p className="text-base font-bold text-gray-900">{v.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
