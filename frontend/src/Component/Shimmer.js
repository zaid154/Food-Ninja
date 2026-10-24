
const ShimmerCard = () => {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Dish Image Skeleton */}
      <div className="skeleton relative h-48 w-full">
        {/* Veg / Non-Veg Indicator Placeholder */}
        <div className="absolute left-3 top-3 h-5 w-5 rounded-md bg-white/70 shadow-sm" />

        {/* Rating Pill Placeholder */}
        <div className="absolute bottom-3 left-3 h-5 w-11 rounded-md bg-white/70 shadow-sm" />

        {/* Wishlist Button Placeholder */}
        <div className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/70 shadow-sm" />
      </div>

      {/* Dish Info Skeleton */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Delivery Time */}
        <div className="flex items-center justify-between">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>

        {/* Dish Title */}
        <div className="mt-1">
          <div className="skeleton h-6 w-3/4 rounded" />
        </div>

        {/* Description (2 lines matching FoodCard h-9) */}
        <div className="mt-1 flex flex-col justify-center space-y-1.5 h-9">
          <div className="skeleton h-2.5 w-full rounded" />
          <div className="skeleton h-2.5 w-4/5 rounded" />
        </div>

        {/* Pricing & Add to Cart Row */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="skeleton h-6 w-14 rounded" />
          <div className="skeleton h-8 w-16 rounded-lg" />
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
