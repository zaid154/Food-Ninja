import React, { useEffect } from "react";

const FoodDishModal = ({
  isOpen,
  onClose,
  onSave,
  editingFoodId,
  foodForm,
  setFoodForm,
  availableCategories = [],
  foodCuisines = [],
  saving = false,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isVeg = foodForm.dietary === "Non-Veg" ? false : true;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {editingFoodId ? `Edit Dish #${editingFoodId}` : "Add New Food Dish to Menu"}
                </h3>
                {editingFoodId && (
                  <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                    Editing Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {editingFoodId
                  ? "Update dish pricing, dietary classification, ingredients, and specs"
                  : "Fill in the details to publish a new authentic dish to the customer menu"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={onSave} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            
            {/* Left Column: Essential Details */}
            <div className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  placeholder="e.g. Hyderabadi Dum Biryani"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cuisine / Origin *</label>
                  <select
                    value={foodForm.cuisine}
                    onChange={(e) => setFoodForm({ ...foodForm, cuisine: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    {foodCuisines.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    placeholder="199"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Calories (Kcal)</label>
                  <input
                    type="number"
                    value={foodForm.caloriesPerServing}
                    onChange={(e) => setFoodForm({ ...foodForm, caloriesPerServing: e.target.value })}
                    placeholder="320"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivery Time</label>
                  <input
                    type="text"
                    value={foodForm.deliveryTime}
                    onChange={(e) => setFoodForm({ ...foodForm, deliveryTime: e.target.value })}
                    placeholder="25-30 mins"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Dietary / Food Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Dietary / Food Classification *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFoodForm({ ...foodForm, dietary: "Veg", isVeg: true })}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-1 text-xs font-bold transition cursor-pointer ${
                      (foodForm.dietary || (isVeg ? "Veg" : "Non-Veg")) === "Veg"
                        ? "border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600/30"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex h-3 w-3 items-center justify-center rounded-xs border border-green-600 p-[1px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    </span>
                    <span>Veg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFoodForm({ ...foodForm, dietary: "Non-Veg", isVeg: false })}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-1 text-xs font-bold transition cursor-pointer ${
                      (foodForm.dietary || (isVeg ? "Veg" : "Non-Veg")) === "Non-Veg"
                        ? "border-red-600 bg-red-50 text-red-700 ring-1 ring-red-600/30"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex h-3 w-3 items-center justify-center rounded-xs border border-red-600 p-[1px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    </span>
                    <span>Non-Veg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFoodForm({ ...foodForm, dietary: "Vegan", isVeg: true })}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-1 text-xs font-bold transition cursor-pointer ${
                      foodForm.dietary === "Vegan"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/30"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <svg className="h-3 w-3 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
                    </svg>
                    <span>Vegan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Visuals & Descriptions */}
            <div className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL (Direct Link) *</label>
                <input
                  type="url"
                  required
                  value={foodForm.image}
                  onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                />

                {/* Instant Live Image Preview */}
                <div className="mt-2.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
                    {foodForm.image ? (
                      <img
                        src={foodForm.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80";
                        }}
                      />
                    ) : (
                      <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 text-[11px]">
                    <p className="font-bold text-slate-800">
                      {foodForm.name ? foodForm.name : "Dish Image Preview"}
                    </p>
                    <p className="text-slate-400 truncate">
                      {foodForm.image ? "Rendered on customer food card" : "Paste valid image URL to preview"}
                    </p>
                    {foodForm.price && (
                      <p className="text-emerald-700 font-bold font-mono mt-0.5">
                        ₹{foodForm.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Ingredients (Comma Separated)</label>
                <input
                  type="text"
                  value={Array.isArray(foodForm.ingredients) ? foodForm.ingredients.join(", ") : foodForm.ingredients}
                  onChange={(e) => setFoodForm({ ...foodForm, ingredients: e.target.value })}
                  placeholder="Basmati Rice, Spices, Ghee, Mint, Caramelized Onions"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Separated by comma for tags in product view</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Summary</label>
                <textarea
                  rows={2}
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  placeholder="Authentic dish prepared fresh with traditional herbs and premium ingredients."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition disabled:opacity-50 shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{saving ? "Saving..." : editingFoodId ? "Save Changes" : "Add Dish to Menu"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodDishModal;
