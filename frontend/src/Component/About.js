import { useState } from "react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Dishes", value: "38" },
  { label: "Cuisines", value: "10+" },
  { label: "Delivery Time", value: "25-30 min" },
  { label: "Coverage", value: "Delhi NCR" }
];

const About = () => {
  const [likes, setLikes] = useState(0);

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              About Food Ninja
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              Fresh Restaurant Food — Delivered Ninja Fast.
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Food Ninja is designed to provide quick, delicious meals at lightning speed. We partner with top-rated local kitchens and restaurants to make sure every order arrives fresh, hot, and on time.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="rounded-md bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 shadow-sm"
              >
                Browse Menu
              </Link>
              <button
                onClick={() => setLikes((l) => l + 1)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Like ({likes})
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=70"
                alt="Plated meal"
                className="h-72 w-full object-cover md:h-96"
                loading="lazy"
              />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Our Mission
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Delivering chef-crafted recipes effortlessly with speed and quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { title: "Quality & Hygiene", body: "Every recipe is prepared with fresh ingredients and quality tested." },
            { title: "Ninja Speed Delivery", body: "Lightning fast delivery from your local neighborhood favorites." },
            { title: "Transparent Pricing", body: "No hidden charges. Clear, fair, and budget-friendly pricing." }
          ].map((v) => (
            <div key={v.title} className="rounded-lg bg-white p-5 ring-1 ring-slate-200 shadow-sm">
              <p className="text-base font-bold text-slate-900">{v.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
