import { useState, useEffect, useRef } from "react";
import AdminDropdown from "./AdminDropdown";
import { useAppDialog } from "../AppDialog";
const FoodDishModal = ({
  isOpen,
  onClose,
  onSave,
  saveError = "",
  editingFoodId,
  foodForm,
  setFoodForm,
  hasUnsavedChanges = false,
  availableCategories = [],
  foodCuisines = [],
  saving = false,
}) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  const [localCuisines, setLocalCuisines] = useState(foodCuisines);
  const closePromptRef = useRef(false);
  const { confirm } = useAppDialog();

  const requestClose = async () => {
    if (saving) return;
    if (hasUnsavedChanges) {
      if (closePromptRef.current) return;
      closePromptRef.current = true;
      const shouldDiscard = await confirm(
        `Your edits${foodForm.name ? ` to ${foodForm.name}` : ""} haven’t been saved. Keep editing or discard them.`,
        {
          title: "Discard unsaved changes?",
          variant: "warning",
          confirmLabel: "Discard Changes",
          cancelLabel: "Keep Editing",
        }
      );
      closePromptRef.current = false;
      if (shouldDiscard) onClose();
      return;
    }
    onClose();
  };

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
      if (e.key === "Escape" && isOpen && !saving) {
        requestClose();
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
  }, [isOpen, onClose, saving, hasUnsavedChanges]);

  if (!isOpen) return null;

  const isVeg = foodForm.dietary === "Non-Veg" ? false : true;
  const imageFitMode = foodForm.imageFit || "contain";

  const handleAddCustomCuisine = (newCuisine) => {
    setLocalCuisines((prev) => Array.from(new Set([newCuisine, ...prev])));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-3 overflow-y-auto"
      onClick={requestClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 py-2.5 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
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
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                    hasUnsavedChanges
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {hasUnsavedChanges
                    ? "Unsaved changes"
                    : editingFoodId
                      ? "All changes saved"
                      : "Not saved yet"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {editingFoodId
                  ? "Update dish pricing, dietary classification, ingredients, and specs"
                  : "Fill in the details to publish a new authentic dish to the customer menu"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={requestClose}
            disabled={saving}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition cursor-pointer disabled:cursor-wait disabled:opacity-50"
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

        <form onSubmit={onSave} className="min-h-0 overflow-y-auto p-3 sm:p-4 space-y-2.5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
            
            <div className="space-y-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  placeholder="Enter a dish name"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <AdminDropdown variant="dish"
                  label="Category *"
                  sublabel="Menu section"
                  value={foodForm.category}
                  options={availableCategories}
                  onChange={(cat) => setFoodForm({ ...foodForm, category: cat })}
                  placeholder="Select Category"
                />

                <AdminDropdown variant="dish"
                  label="Cuisine / Origin *"
                  sublabel="Regional style"
                  value={foodForm.cuisine}
                  options={localCuisines}
                  onChange={(c) => setFoodForm({ ...foodForm, cuisine: c })}
                  allowAdd={true}
                  onAddOption={handleAddCustomCuisine}
                  addLabel="Add New Cuisine"
                  addPlaceholder="Type cuisine (e.g. Awadhi, Japanese)"
                  placeholder="Select Cuisine"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">{foodForm.hasPortions ? "Full Plate Price (₹) *" : "Price (₹) *"}</label>
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
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Energy (kcal)</label>
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

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Nutrition per serving (optional)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[['proteinGrams', 'Protein (g)'], ['carbsGrams', 'Carbs (g)'], ['fatGrams', 'Fat (g)']].map(([field, label]) => (
                    <input
                      key={field}
                      type="number"
                      min="0"
                      value={foodForm[field] ?? ""}
                      onChange={(e) => setFoodForm({ ...foodForm, [field]: e.target.value })}
                      placeholder={label}
                      aria-label={label}
                      className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Portion / Serving Info (Optional)</label>
                  <input
                    type="text"
                    value={foodForm.servingInfo || ""}
                    onChange={(e) => setFoodForm({ ...foodForm, servingInfo: e.target.value })}
                    placeholder="e.g. Serves 1-2, 6 Pcs, 500 ml"
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Original MRP (₹) (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={foodForm.originalPrice || ""}
                    onChange={(e) => setFoodForm({ ...foodForm, originalPrice: e.target.value })}
                    placeholder="e.g. 300 (only for real discount)"
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
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

              {/* Key Ingredients & Key Features (balanced into left column) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Key Ingredients</label>
                  <input
                    type="text"
                    value={Array.isArray(foodForm.ingredients) ? foodForm.ingredients.join(", ") : foodForm.ingredients}
                    onChange={(e) => setFoodForm({ ...foodForm, ingredients: e.target.value })}
                    placeholder="Rice, Spices, Ghee"
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-[11px]">Key Features</label>
                  <input
                    type="text"
                    value={Array.isArray(foodForm.keyFeatures) ? foodForm.keyFeatures.join(", ") : foodForm.keyFeatures}
                    onChange={(e) => setFoodForm({ ...foodForm, keyFeatures: e.target.value })}
                    placeholder="Freshly prepared, House-made sauce"
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
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

                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                      <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Card Preview</span>
                    </span>

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

                    <div className="absolute left-2 top-2 rounded-md bg-white/95 p-1 shadow-xs border border-slate-100">
                      <div className={`flex items-center justify-center h-2.5 w-2.5 rounded-xs border ${foodForm.dietary === "Non-Veg" ? "border-red-600" : "border-green-600"} p-[1px]`}>
                        <div className={`h-1 w-1 rounded-full ${foodForm.dietary === "Non-Veg" ? "bg-red-600" : "bg-green-600"}`} />
                      </div>
                    </div>

                    {foodForm.price && (
                      <div className="absolute bottom-1.5 left-2 rounded-md bg-slate-900/90 backdrop-blur-xs text-white px-1.5 py-0.5 text-[9px] font-bold font-mono shadow-xs">
                        ₹{foodForm.price}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Description / Summary</label>
                <textarea
                  rows={2}
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  placeholder="Authentic dish prepared fresh with traditional herbs and premium ingredients."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition resize-none leading-relaxed"
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(foodForm.hasPortions)}
                      onChange={(e) => setFoodForm({ ...foodForm, hasPortions: e.target.checked })}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="font-bold text-slate-800 text-[11px]">Set Full, Half & Quarter Plate Prices</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Separate portion prices</span>
                </div>

                {foodForm.hasPortions && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5 text-[10px]">Half Plate Price (₹) *</label>
                      <input
                        type="number"
                        min="1"
                        required={foodForm.hasPortions}
                        value={foodForm.halfPrice || ""}
                        onChange={(e) => setFoodForm({ ...foodForm, halfPrice: e.target.value })}
                        placeholder="e.g. 130"
                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5 text-[10px]">Quarter Plate Price (₹) *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={foodForm.quarterPrice || ""}
                        onChange={(e) => setFoodForm({ ...foodForm, quarterPrice: e.target.value })}
                        placeholder="e.g. 40"
                        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {saveError && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="10" cy="10" r="7" />
                <path d="M10 6.5v4.5m0 2.5h.01" strokeLinecap="round" />
              </svg>
              <span>{saveError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={requestClose}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:cursor-wait disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !hasUnsavedChanges}
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition disabled:opacity-50 shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>
                {saving
                  ? "Saving..."
                  : hasUnsavedChanges
                    ? editingFoodId ? "Save Changes" : "Add Dish to Menu"
                    : "No Changes"}
              </span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default FoodDishModal;
