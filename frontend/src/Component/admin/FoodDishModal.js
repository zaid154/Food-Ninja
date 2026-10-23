import React, { useState, useEffect, useRef } from "react";

/**
 * Modern Custom Dropdown Component
 * Replaces ugly native OS <select> popups with modern Tailwind emerald styling.
 * Supports inline dynamic addition of custom cuisines (+ Add New Cuisine).
 */
const CustomDropdown = ({
  label,
  sublabel,
  value,
  options = [],
  onChange,
  allowAdd = false,
  onAddOption,
  placeholder = "Select..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleCreateNew = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = newOptionText.trim();
    if (!trimmed) return;
    if (onAddOption) {
      onAddOption(trimmed);
    }
    onChange(trimmed);
    setNewOptionText("");
    setIsAdding(false);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between text-[11px]">
        <span>{label}</span>
        {sublabel && <span className="text-[10px] text-slate-400 font-normal">{sublabel}</span>}
      </label>

      {/* Styled Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-xl border px-3 py-1.5 text-xs flex items-center justify-between bg-white transition cursor-pointer text-left ${
          isOpen
            ? "border-emerald-600 ring-2 ring-emerald-500/20"
            : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <span className={`truncate font-medium ${value ? "text-slate-800" : "text-slate-400"}`}>
          {value || placeholder}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-44 overflow-y-auto divide-y divide-slate-50">
            {options.map((opt) => {
              const isSelected = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-xs flex items-center justify-between text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-900 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && (
                    <svg className="h-3.5 w-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add Custom Option Footer (e.g. for Cuisines) */}
          {allowAdd && (
            <div className="border-t border-slate-100 p-1.5 bg-slate-50/80">
              {isAdding ? (
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    autoFocus
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateNew(e);
                      if (e.key === "Escape") setIsAdding(false);
                    }}
                    placeholder="Type cuisine (e.g. Awadhi, Japanese)"
                    className="w-full rounded-lg border border-emerald-500 bg-white px-2 py-1 text-[11px] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="rounded-lg bg-emerald-700 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-800 transition shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="text-slate-400 hover:text-slate-600 px-1 text-xs font-bold shrink-0 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAdding(true);
                  }}
                  className="w-full flex items-center gap-1.5 text-left text-xs font-bold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>+ Add New Cuisine</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
  const [imageLoadError, setImageLoadError] = useState(false);
  const [localCuisines, setLocalCuisines] = useState(foodCuisines);

  // Sync cuisines prop with local list
  useEffect(() => {
    if (foodCuisines && foodCuisines.length > 0) {
      setLocalCuisines((prev) => Array.from(new Set([...prev, ...foodCuisines])));
    }
  }, [foodCuisines]);

  // Reset image error on open or URL change
  useEffect(() => {
    setImageLoadError(false);
  }, [foodForm.image, isOpen]);

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
  const imageFitMode = foodForm.imageFit || "contain";

  const handleAddCustomCuisine = (newCuisine) => {
    setLocalCuisines((prev) => Array.from(new Set([newCuisine, ...prev])));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Dialog with max-h-[92vh] flex-col to never overflow laptop screens */}
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Fixed at top) */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-5 py-3">
          <div className="flex items-center gap-2.5">
            {/* Elegant Food Cloche / Dining Icon */}
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4v2" />
                <path d="M4 18h16" />
                <path d="M4 18a8 8 0 0 1 16 0" />
                <path d="M10 4a2 2 0 1 1 4 0" />
              </svg>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-md">
                  {editingFoodId
                    ? (foodForm.name ? `Edit ${foodForm.name}` : "Edit Food Dish")
                    : "Add New Food Dish"}
                </h3>
                {editingFoodId && (
                  <span className="rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 border border-slate-200">
                    ID: {editingFoodId}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {editingFoodId
                  ? "Update dish pricing, dietary classification, ingredients, and specs"
                  : "Fill in the details to publish a new authentic dish to the customer menu"}
              </p>
            </div>
          </div>

          {/* Clean ✕ Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close modal"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form Body (Scrollable if viewport is small) */}
        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            
            {/* Left Column: Essential Dish Specifications & Ingredients */}
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  placeholder="e.g. Hyderabadi Dum Biryani, Veg Club Burger"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>

              {/* Category & Cuisine Dropdowns (Custom Tailwind Dropdowns) */}
              <div className="grid grid-cols-2 gap-2.5">
                <CustomDropdown
                  label="Category *"
                  sublabel="Menu section"
                  value={foodForm.category}
                  options={availableCategories}
                  onChange={(cat) => setFoodForm({ ...foodForm, category: cat })}
                  placeholder="Select Category"
                />

                <CustomDropdown
                  label="Cuisine / Origin *"
                  sublabel="Regional style"
                  value={foodForm.cuisine}
                  options={localCuisines}
                  onChange={(c) => setFoodForm({ ...foodForm, cuisine: c })}
                  allowAdd={true}
                  onAddOption={handleAddCustomCuisine}
                  placeholder="Select Cuisine"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    placeholder="199"
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Calories (Kcal)</label>
                  <input
                    type="number"
                    value={foodForm.caloriesPerServing}
                    onChange={(e) => setFoodForm({ ...foodForm, caloriesPerServing: e.target.value })}
                    placeholder="320"
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Delivery Time</label>
                  <input
                    type="text"
                    value={foodForm.deliveryTime}
                    onChange={(e) => setFoodForm({ ...foodForm, deliveryTime: e.target.value })}
                    placeholder="25-30 mins"
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Dietary / Food Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Dietary / Food Classification *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFoodForm({ ...foodForm, dietary: "Veg", isVeg: true })}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 px-1 text-xs font-bold transition cursor-pointer ${
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
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 px-1 text-xs font-bold transition cursor-pointer ${
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
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 px-1 text-xs font-bold transition cursor-pointer ${
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

              {/* Key Ingredients */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Key Ingredients (Comma Separated)</label>
                <input
                  type="text"
                  value={Array.isArray(foodForm.ingredients) ? foodForm.ingredients.join(", ") : foodForm.ingredients}
                  onChange={(e) => setFoodForm({ ...foodForm, ingredients: e.target.value })}
                  placeholder="Basmati Rice, Spices, Ghee, Mint"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>
            </div>

            {/* Right Column: Visuals & Description */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 text-[11px]">Image URL (Direct Link) *</label>
                  {foodForm.image && (
                    <button
                      type="button"
                      onClick={() => setFoodForm({ ...foodForm, image: "" })}
                      className="text-[10px] font-bold text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      Clear URL
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="url"
                    required
                    value={foodForm.image}
                    onChange={(e) => {
                      setImageLoadError(false);
                      setFoodForm({ ...foodForm, image: e.target.value });
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition pr-7"
                  />
                  {foodForm.image && (
                    <button
                      type="button"
                      onClick={() => setFoodForm({ ...foodForm, image: "" })}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Compact 16:9 Food Card Preview */}
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                      <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Card Preview</span>
                    </span>

                    {/* Image Fit Mode Switcher */}
                    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setFoodForm({ ...foodForm, imageFit: "contain" })}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                          imageFitMode === "contain"
                            ? "bg-emerald-700 text-white shadow-2xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Preserves entire platter without cropping (Best for burgers/plated dishes)"
                      >
                        Contain (Full Platter)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFoodForm({ ...foodForm, imageFit: "cover" })}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                          imageFitMode === "cover"
                            ? "bg-emerald-700 text-white shadow-2xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Fills the entire frame (Best for full-frame photos like pizzas)"
                      >
                        Cover (Fill)
                      </button>
                    </div>
                  </div>

                  {/* Proportional Box (Compact height ~90px) */}
                  <div className="relative h-24 w-full rounded-xl overflow-hidden bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                    {foodForm.image && !imageLoadError ? (
                      <img
                        src={foodForm.image}
                        alt={foodForm.name || "Preview"}
                        className={`h-full w-full ${
                          imageFitMode === "contain" ? "object-contain p-1.5" : "object-cover"
                        }`}
                        onError={() => setImageLoadError(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <svg className="h-5 w-5 text-slate-300 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] text-slate-400">
                          {imageLoadError
                            ? "⚠️ Image failed to load. Use direct .jpg or .png URL"
                            : "Paste image link above to preview"}
                        </span>
                      </div>
                    )}

                    {/* Veg / Non-Veg badge on preview */}
                    <div className="absolute left-2 top-2 rounded-md bg-white/95 p-1 shadow-xs border border-slate-100">
                      <div className={`flex items-center justify-center h-2.5 w-2.5 rounded-xs border ${foodForm.dietary === "Non-Veg" ? "border-red-600" : "border-green-600"} p-[1px]`}>
                        <div className={`h-1 w-1 rounded-full ${foodForm.dietary === "Non-Veg" ? "bg-red-600" : "bg-green-600"}`} />
                      </div>
                    </div>

                    {/* Price pill on preview */}
                    {foodForm.price && (
                      <div className="absolute bottom-1.5 left-2 rounded-md bg-slate-900/90 backdrop-blur-xs text-white px-1.5 py-0.5 text-[9px] font-bold font-mono shadow-xs">
                        ₹{foodForm.price}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description / Summary with compact 3 rows */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Description / Summary</label>
                <textarea
                  rows={3}
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  placeholder="Authentic dish prepared fresh with traditional herbs and premium ingredients."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition resize-none leading-relaxed"
                />
              </div>
            </div>

          </div>
        </form>

        {/* Modal Footer Actions (Fixed at bottom) */}
        <div className="shrink-0 flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-100 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            onClick={onSave}
            className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition disabled:opacity-50 shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{saving ? "Saving..." : editingFoodId ? "Save Changes" : "Add Dish to Menu"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDishModal;
