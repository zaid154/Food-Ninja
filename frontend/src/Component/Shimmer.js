import React from "react";

const ShimmerCard = () => {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Dish Image Skeleton with glossy moving sweep */}
      <div className="skeleton relative h-48 w-full bg-slate-200">
        <div className="absolute left-3 top-3 h-4 w-4 rounded-sm bg-white/60" />
        <div className="absolute bottom-3 left-3 h-4 w-12 rounded bg-white/60" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div>
          <div className="skeleton h-4 w-3/4 rounded bg-slate-200 mb-2" />
          <div className="skeleton h-3 w-1/3 rounded bg-slate-200 mb-3" />
          <div className="space-y-1.5">
            <div className="skeleton h-2.5 w-full rounded bg-slate-100" />
            <div className="skeleton h-2.5 w-4/5 rounded bg-slate-100" />
          </div>
        </div>

        {/* Footer Row Skeleton */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="skeleton h-5 w-16 rounded bg-slate-200" />
          <div className="skeleton h-8 w-24 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

const Shimmer = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(8).fill("").map((_, index) => (
        <ShimmerCard key={index} />
      ))}
    </div>
  );
};

export default Shimmer;
