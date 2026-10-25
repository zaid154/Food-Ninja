import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useOutletContext } from "react-router-dom";
import AdminDropdown from "./AdminDropdown";
import { API_BASE_URL } from "../../utils/Constants";
import { useAppDialog } from "../AppDialog";
import { FOOD_CUISINES } from "./AdminDishesPage";

const optionalNumber = (value) => (value === "" || value == null ? null : Number(value));
const parseList = (value) =>
  Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : String(value || "").split(/[\n,]/).map((item) => item.trim()).filter(Boolean);

const initialFood = {
  name: "",
  category: "",
  cuisine: "Indian",
  imageFit: "cover",
  price: "",
  originalPrice: "",
  servingInfo: "",
  hasPortions: false,
  halfPrice: "",
  quarterPrice: "",
  caloriesPerServing: "",
  proteinGrams: "",
  carbsGrams: "",
  fatGrams: "",
  deliveryTime: "25-30 mins",
  dietary: "Veg",
  isVeg: true,
  image: "",
  description: "",
  ingredients: "",
  keyFeatures: "",
};

const AdminDishFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const context = useOutletContext() || {};
  const { confirm, alert: showDialog } = useAppDialog();

  const foods = context.foods || [];
  const categories = context.categories || [];
  const onRefresh = context.fetchData;
  const showToast = context.showToast || showDialog;

  const availableCategories = categories.map((c) => c.name).filter(Boolean);

  const [foodForm, setFoodForm] = useState(initialFood);
  const [savedFoodForm, setSavedFoodForm] = useState(initialFood);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [imageLoadError, setImageLoadError] = useState(false);
  const [localCuisines, setLocalCuisines] = useState(FOOD_CUISINES);

  const hasUnsavedChanges = JSON.stringify(foodForm) !== JSON.stringify(savedFoodForm);

  // Sync cuisines
  useEffect(() => {
    if (foods && foods.length > 0) {
      setLocalCuisines((prev) =>
        Array.from(new Set([...prev, ...foods.map((f) => f.cuisine).filter(Boolean)]))
      );
    }
  }, [foods]);

  // Load food data when editing
  useEffect(() => {
    if (!isEditing) {
      const blank = {
        ...initialFood,
        category: availableCategories[0] || "",
      };
      setFoodForm(blank);
      setSavedFoodForm(blank);
      setLoading(false);
      return;
    }

    const loadFood = async () => {
      // First try to find in context foods
      let existing = foods.find((f) => String(f.id) === String(id) || String(f._id) === String(id));
      if (!existing) {
        try {
          setLoading(true);
          const res = await fetch(`${API_BASE_URL}/recipes/${id}`);
          if (res.ok) {
            const data = await res.json();
            existing = data.recipe || data.food || data;
          }
        } catch (err) {
          console.error("Failed to fetch food details:", err);
        }
      }

      if (existing) {
        const foodDietary = existing.dietary || (existing.isVeg !== false ? "Veg" : "Non-Veg");
        const loadedForm = {
          name: existing.name || "",
          category: existing.category || "",
          cuisine: existing.cuisine || "Indian",
          imageFit: existing.imageFit || "cover",
          price: existing.price || existing.caloriesPerServing || 199,
          originalPrice: existing.originalPrice || "",
          servingInfo: existing.servingInfo || "",
          hasPortions: Boolean(existing.hasPortions),
          halfPrice: existing.halfPrice || "",
          quarterPrice: existing.quarterPrice || "",
          caloriesPerServing: existing.caloriesPerServing ?? "",
          proteinGrams: existing.proteinGrams ?? "",
          carbsGrams: existing.carbsGrams ?? "",
          fatGrams: existing.fatGrams ?? "",
          deliveryTime: existing.deliveryTime || "25-30 mins",
          dietary: foodDietary,
          isVeg: foodDietary !== "Non-Veg",
          image: existing.image || "",
          description: existing.description || "",
          ingredients: Array.isArray(existing.ingredients)
            ? existing.ingredients.join(", ")
            : existing.ingredients || "",
          keyFeatures: Array.isArray(existing.keyFeatures)
            ? existing.keyFeatures.join(", ")
            : existing.keyFeatures || "",
        };
        setFoodForm(loadedForm);
        setSavedFoodForm(loadedForm);
      } else {
        setSaveError("Dish not found or could not be loaded.");
      }
      setLoading(false);
    };

    loadFood();
  }, [id, isEditing]);

  const handleBack = async () => {
    if (saving) return;
    if (hasUnsavedChanges) {
      const shouldDiscard = await confirm(
        `Your edits${foodForm.name ? ` to ${foodForm.name}` : ""} haven’t been saved. Keep editing or discard them?`,
        {
          title: "Discard unsaved changes?",
          variant: "warning",
          confirmLabel: "Discard Changes",
          cancelLabel: "Keep Editing",
        }
      );
      if (!shouldDiscard) return;
    }
    navigate("/admin/foods");
  };

  const handleAddCustomCuisine = (newCuisine) => {
    setLocalCuisines((prev) => Array.from(new Set([newCuisine, ...prev])));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!hasUnsavedChanges && isEditing) return;

    if (!foodForm.name.trim()) {
      setSaveError("Please enter a dish name.");
      return;
    }
    if (!foodForm.category) {
      setSaveError("Please select a category.");
      return;
    }
    if (!foodForm.price || Number(foodForm.price) <= 0) {
      setSaveError("Please enter a valid price.");
      return;
    }
    if (!foodForm.image.trim()) {
      setSaveError("Please provide an image URL for the dish.");
      return;
    }

    const ingArray = typeof foodForm.ingredients === "string"
      ? foodForm.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
      : foodForm.ingredients;

    const isVegVal = foodForm.dietary === "Non-Veg" ? false : true;

    const payload = {
      name: foodForm.name.trim(),
      category: foodForm.category,
      cuisine: foodForm.cuisine || "Indian",
      imageFit: foodForm.imageFit || "cover",
      price: Number(foodForm.price),
      originalPrice: foodForm.originalPrice ? Number(foodForm.originalPrice) : 0,
      servingInfo: foodForm.servingInfo ? String(foodForm.servingInfo).trim() : "",
      hasPortions: Boolean(foodForm.hasPortions),
      halfPrice: foodForm.hasPortions && foodForm.halfPrice ? Number(foodForm.halfPrice) : 0,
      quarterPrice: foodForm.hasPortions && foodForm.quarterPrice ? Number(foodForm.quarterPrice) : 0,
      caloriesPerServing: optionalNumber(foodForm.caloriesPerServing),
      proteinGrams: optionalNumber(foodForm.proteinGrams),
      carbsGrams: optionalNumber(foodForm.carbsGrams),
      fatGrams: optionalNumber(foodForm.fatGrams),
      deliveryTime: foodForm.deliveryTime || "25-30 mins",
      isVeg: isVegVal,
      dietary: foodForm.dietary || (isVegVal ? "Veg" : "Non-Veg"),
      image: foodForm.image.trim(),
      description: foodForm.description.trim() || `Authentic ${foodForm.name} prepared fresh with aromatic ingredients.`,
      ingredients: ingArray.length > 0 ? ingArray : ["Fresh Ingredients", "Spices", "Chef Special Blend"],
      keyFeatures: parseList(foodForm.keyFeatures),
      rating: 4.8,
    };

    try {
      setSaving(true);
      setSaveError("");
      const url = isEditing ? `${API_BASE_URL}/recipes/${id}` : `${API_BASE_URL}/recipes`;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          isEditing
            ? `${payload.name} saved successfully. Changes are live!`
            : `${payload.name} added successfully to menu!`
        );
        if (onRefresh) onRefresh();
        navigate("/admin/foods");
      } else {
        const result = await res.json().catch(() => ({}));
        setSaveError(result.message || "Dish could not be saved. Please try again.");
      }
    } catch {
      setSaveError("Could not connect to the server. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const imageFitMode = foodForm.imageFit || "cover";

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
        <div className="text-center space-y-2">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="text-xs font-bold text-slate-600">Loading dish details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition cursor-pointer"
            title="Return to food dishes inventory"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                {isEditing ? `Edit: ${foodForm.name || "Dish"}` : "Add New Food Dish"}
              </h1>
              {isEditing && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600">
                  ID: {id}
                </span>
              )}
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                  hasUnsavedChanges
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {hasUnsavedChanges ? "Unsaved changes" : isEditing ? "All changes saved" : "New entry"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? "Update pricing, description, portions, image and dietary details"
                : "Create a new authentic recipe entry for your live customer menu"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleBack}
            disabled={saving}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || (!hasUnsavedChanges && isEditing)}
            className="rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{isEditing ? "Save Changes" : "Publish Dish"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveError && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="10" cy="10" r="7" />
            <path d="M10 6.5v4.5m0 2.5h.01" strokeLinecap="round" />
          </svg>
          <div className="flex-1">
            <p className="font-bold">Cannot Save Dish</p>
            <p className="text-[11px] text-rose-700 mt-0.5">{saveError}</p>
          </div>
        </div>
      )}

      {/* Main 2-Column Responsive Form Card */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Dish Attributes & Ingredients */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="font-bold text-slate-900 text-sm">Dish Specifications & Pricing</h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Basic details displayed to customers on menu cards</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">Dish Name *</label>
              <input
                type="text"
                required
                value={foodForm.name}
                onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                placeholder="e.g. Hyderabadi Dum Biryani"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminDropdown
                variant="dish"
                label="Category *"
                sublabel="Menu section"
                value={foodForm.category}
                options={availableCategories}
                onChange={(cat) => setFoodForm({ ...foodForm, category: cat })}
                placeholder="Select Category"
              />

              <AdminDropdown
                variant="dish"
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

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                  {foodForm.hasPortions ? "Full Plate Price (₹) *" : "Price (₹) *"}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={foodForm.price}
                  onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                  placeholder="199"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Energy (kcal)</label>
                <input
                  type="number"
                  value={foodForm.caloriesPerServing}
                  onChange={(e) => setFoodForm({ ...foodForm, caloriesPerServing: e.target.value })}
                  placeholder="320"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Delivery Time</label>
                <input
                  type="text"
                  value={foodForm.deliveryTime}
                  onChange={(e) => setFoodForm({ ...foodForm, deliveryTime: e.target.value })}
                  placeholder="25-30 mins"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">Nutrition per serving (optional)</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  ["proteinGrams", "Protein (g)"],
                  ["carbsGrams", "Carbs (g)"],
                  ["fatGrams", "Fat (g)"],
                ].map(([field, label]) => (
                  <input
                    key={field}
                    type="number"
                    min="0"
                    value={foodForm[field] ?? ""}
                    onChange={(e) => setFoodForm({ ...foodForm, [field]: e.target.value })}
                    placeholder={label}
                    className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Portion / Serving Info (Optional)</label>
                <input
                  type="text"
                  value={foodForm.servingInfo || ""}
                  onChange={(e) => setFoodForm({ ...foodForm, servingInfo: e.target.value })}
                  placeholder="e.g. Serves 1-2, 6 Pcs, 500 ml"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Original MRP (₹) (Optional)</label>
                <input
                  type="number"
                  min="0"
                  value={foodForm.originalPrice || ""}
                  onChange={(e) => setFoodForm({ ...foodForm, originalPrice: e.target.value })}
                  placeholder="e.g. 300 (strike-through discount)"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-[11px]">Dietary / Food Classification *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFoodForm({ ...foodForm, dietary: "Veg", isVeg: true })}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2 text-xs font-bold transition cursor-pointer ${
                    (foodForm.dietary || (foodForm.isVeg ? "Veg" : "Non-Veg")) === "Veg"
                      ? "border-green-600 bg-green-50 text-green-700 ring-2 ring-green-600/20"
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
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2 text-xs font-bold transition cursor-pointer ${
                    (foodForm.dietary || (foodForm.isVeg ? "Veg" : "Non-Veg")) === "Non-Veg"
                      ? "border-red-600 bg-red-50 text-red-700 ring-2 ring-red-600/20"
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
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2 text-xs font-bold transition cursor-pointer ${
                    foodForm.dietary === "Vegan"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                  </svg>
                  <span>Vegan</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Key Ingredients</label>
                <input
                  type="text"
                  value={Array.isArray(foodForm.ingredients) ? foodForm.ingredients.join(", ") : foodForm.ingredients}
                  onChange={(e) => setFoodForm({ ...foodForm, ingredients: e.target.value })}
                  placeholder="Basmati Rice, Saffron, Ghee"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Key Features</label>
                <input
                  type="text"
                  value={Array.isArray(foodForm.keyFeatures) ? foodForm.keyFeatures.join(", ") : foodForm.keyFeatures}
                  onChange={(e) => setFoodForm({ ...foodForm, keyFeatures: e.target.value })}
                  placeholder="Slow-cooked, Authentic recipe"
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Media, Card Preview, Description & Portions */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="font-bold text-slate-900 text-sm">Media, Preview & Portions</h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Live visual preview and portion pricing structure</p>
            </div>

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
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500 pr-7"
                />
                {foodForm.image && (
                  <button
                    type="button"
                    onClick={() => setFoodForm({ ...foodForm, image: "" })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Preview Card */}
              <div className="mt-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Live Card Preview</span>
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
                    >
                      Contain
                    </button>
                    <button
                      type="button"
                      onClick={() => setFoodForm({ ...foodForm, imageFit: "cover" })}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                        imageFitMode === "cover"
                          ? "bg-emerald-700 text-white shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Cover
                    </button>
                  </div>
                </div>

                <div className="relative h-28 w-full rounded-xl overflow-hidden bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                  {foodForm.image && !imageLoadError ? (
                    <img
                      src={foodForm.image}
                      alt={foodForm.name || "Preview"}
                      className={`h-full w-full ${
                        imageFitMode === "contain" ? "object-contain p-2" : "object-cover"
                      }`}
                      onError={() => setImageLoadError(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
                      <svg className="h-6 w-6 text-slate-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px]">
                        {imageLoadError
                          ? "⚠️ Image failed to load. Use direct URL"
                          : "Paste image link to preview"}
                      </span>
                    </div>
                  )}

                  <div className="absolute left-2 top-2 rounded-md bg-white/95 p-1 shadow-xs border border-slate-100">
                    <div className={`flex items-center justify-center h-2.5 w-2.5 rounded-xs border ${foodForm.dietary === "Non-Veg" ? "border-red-600" : "border-green-600"} p-[1px]`}>
                      <div className={`h-1 w-1 rounded-full ${foodForm.dietary === "Non-Veg" ? "bg-red-600" : "bg-green-600"}`} />
                    </div>
                  </div>

                  {foodForm.price && (
                    <div className="absolute bottom-1.5 left-2 rounded-md bg-slate-900/90 backdrop-blur-xs text-white px-2 py-0.5 text-[10px] font-bold font-mono shadow-xs">
                      ₹{foodForm.price}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">Description / Summary</label>
              <textarea
                rows={3}
                value={foodForm.description}
                onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                placeholder="Authentic dish prepared fresh with traditional herbs and premium ingredients."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500 resize-none leading-relaxed"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
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
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5 text-[10px]">Half Plate Price (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      required={foodForm.hasPortions}
                      value={foodForm.halfPrice || ""}
                      onChange={(e) => setFoodForm({ ...foodForm, halfPrice: e.target.value })}
                      placeholder="e.g. 130"
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5 text-[10px]">Quarter Plate Price (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      required={foodForm.hasPortions}
                      value={foodForm.quarterPrice || ""}
                      onChange={(e) => setFoodForm({ ...foodForm, quarterPrice: e.target.value })}
                      placeholder="e.g. 70"
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={saving}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || (!hasUnsavedChanges && isEditing)}
            className="rounded-xl bg-emerald-700 hover:bg-emerald-800 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{isEditing ? "Save Changes" : "Publish Dish to Menu"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDishFormPage;
