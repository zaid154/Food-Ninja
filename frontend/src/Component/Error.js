import { useRouteError, Link } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  const status = error?.status ?? "404";
  const statusText = error?.statusText || error?.message || "Page Not Found";

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <p className="text-5xl font-black tracking-tight text-emerald-600">{status}</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">{statusText}</h1>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          The page or dish you're looking for doesn't exist or is currently unavailable.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
          >
            Back to Food Menu
          </Link>
          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default Error;
