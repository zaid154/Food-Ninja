import React from "react";

function Shimmer() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {Array(10).fill("").map((_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <div className="skeleton h-[290px] w-full" />

          <div className="flex flex-col gap-2 p-4">
            <div className="skeleton h-4 w-3/4 rounded" />

            <div className="space-y-1.5">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-11/12 rounded" />
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="skeleton h-5 w-16 rounded" />
              <div className="skeleton h-4 w-12 rounded-sm" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="skeleton h-9 rounded-lg" />
              <div className="skeleton h-9 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Shimmer;
