import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";
import FoodDishModal from "./FoodDishModal";
import { useAppDialog } from "../AppDialog";

export const FOOD_CUISINES = [
  "Indian",
  "North Indian",
  "South Indian",
  "Hyderabadi",
  "Mughlai",
  "Indo-Chinese",
  "Italian",
  "American",
  "Mexican",
  "Continental",
  "Pan-Asian",
  "Tibetan",
  "Middle Eastern",
  "Thai"
];
const optionalNumber = (value) => value === "" || value == null ? null : Number(value);
const parseList = (value) => Array.isArray(value)
  ? value.map((item) => String(item).trim()).filter(Boolean)
  : String(value || "").split(/[\n,]/).map((item) => item.trim()).filter(Boolean);

const AdminFoodsPage = (props) => {
  const context = useOutletContext() || {};
  const { confirm, alert: showDialog } = useAppDialog();
  const foods = props.foods || context.foods || [];
  const categories = props.categories || context.categories || [];
  const onRefresh = props.onRefresh || context.fetchData;
  const showToast = props.showToast || context.showToast || showDialog;

  const availableCategories = categories.map((category) => category.name).filter(Boolean);

  // Dynamic cuisines dynamically unified from database dishes + standard cuisines
  const dynamicCuisines = Array.from(
    new Set([
      ...FOOD_CUISINES,
      ...foods.map((f) => f.cuisine).filter(Boolean)
    ])
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStock, setSelectedStock] = useState("All"); // "All" | "In Stock" | "Sold Out"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const initialFood = {
    name: "",
    category: availableCategories[0] || "",
    cuisine: "Hyderabadi",
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
    keyFeatures: ""
  };

  const [foodForm, setFoodForm] = useState(initialFood);
  const [savedFoodForm, setSavedFoodForm] = useState(initialFood);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const hasUnsavedChanges = JSON.stringify(foodForm) !== JSON.stringify(savedFoodForm);

  // Filter foods based on search query, category chip, and stock status
  const filteredFoods = foods.filter((f) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (f.name && f.name.toLowerCase().includes(q)) ||
      (f.category && f.category.toLowerCase().includes(q)) ||
      (f.cuisine && f.cuisine.toLowerCase().includes(q)) ||
      String(f.id).includes(q);

    const matchesCategory =
      selectedCategory === "All" ||
      (f.category && f.category.toLowerCase() === selectedCategory.toLowerCase());

    const isAvailable = f.inStock !== false;
    const matchesStock =
      selectedStock === "All" ||
      (selectedStock === "In Stock" && isAvailable) ||
      (selectedStock === "Sold Out" && !isAvailable);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAddModal = () => {
    const blankFood = { ...initialFood };
    setEditingFoodId(null);
    setFoodForm(blankFood);
    setSavedFoodForm(blankFood);
    setSaveError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (f) => {
    setEditingFoodId(f.id);
    const foodDietary = f.dietary || (f.isVeg !== false ? "Veg" : "Non-Veg");
    const nextFoodForm = {
      name: f.name || "",
      category: f.category || "",
      cuisine: f.cuisine || "Indian",
      imageFit: f.imageFit || "cover",
      price: f.price || f.caloriesPerServing || 199,
      originalPrice: f.originalPrice || "",
      servingInfo: f.servingInfo || "",
      hasPortions: Boolean(f.hasPortions),
      halfPrice: f.halfPrice || "",
      quarterPrice: f.quarterPrice || "",
      caloriesPerServing: f.caloriesPerServing ?? "",
      proteinGrams: f.proteinGrams ?? "",
      carbsGrams: f.carbsGrams ?? "",
      fatGrams: f.fatGrams ?? "",
      deliveryTime: f.deliveryTime || "25-30 mins",
      dietary: foodDietary,
      isVeg: foodDietary !== "Non-Veg",
      image: f.image || "",
      description: f.description || "",
      ingredients: Array.isArray(f.ingredients) ? f.ingredients.join(", ") : (f.ingredients || ""),
      keyFeatures: Array.isArray(f.keyFeatures) ? f.keyFeatures.join(", ") : (f.keyFeatures || "")
    };
    setFoodForm(nextFoodForm);
    setSavedFoodForm(nextFoodForm);
    setSaveError("");
    setIsModalOpen(true);
  };

  const handleCloseFoodModal = () => {
    if (saving) return;
    setSaveError("");
    setIsModalOpen(false);
  };

  const handleFoodFormChange = (nextForm) => {
    setFoodForm(nextForm);
    setSaveError("");
  };

  const handleToggleStock = async (food) => {
    try {
      const newStock = food.inStock === false ? true : false;
      const res = await fetch(`${API_BASE_URL}/recipes/${food.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: newStock }),
      });
      if (res.ok) {
        showToast(`${food.name} is now ${newStock ? "In Stock" : "Out of Stock"}`);
        if (onRefresh) onRefresh();
      } else {
        showDialog("Failed to update stock status.", { title: "Update failed", variant: "error" });
      }
    } catch {
      showDialog("Could not connect to the server. Please try again.", { title: "Connection error", variant: "error" });
    }
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    if (!hasUnsavedChanges) return;
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
      rating: 4.8
    };

    try {
      setSaving(true);
      setSaveError("");
      const url = editingFoodId ? `${API_BASE_URL}/recipes/${editingFoodId}` : `${API_BASE_URL}/recipes`;
      const res = await fetch(url, {
        method: editingFoodId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingFoodId ? `${payload.name} saved successfully. Changes are live.` : `${payload.name} added successfully. It is now on the menu.`);
        setFoodForm(initialFood);
        setSavedFoodForm(initialFood);
        setEditingFoodId(null);
        setIsModalOpen(false);
        if (onRefresh) onRefresh();
      } else {
        const result = await res.json().catch(() => ({}));
        setSaveError(result.message || "Dish could not be saved. Your changes are still here—please try again.");
      }
    } catch {
      setSaveError("Could not connect to the server. Your changes are still here—please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFood = async (id, dishName) => {
    if (!await confirm(`Remove "${dishName || "this dish"}" from the menu?`, {
      title: "Delete dish?",
      variant: "danger",
      confirmLabel: "Delete Dish",
    })) return;
    try {
      const res = await fetch(`${API_BASE_URL}/recipes/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Dish removed from menu");
        if (onRefresh) onRefresh();
      }
    } catch {
      showDialog("Failed to delete dish.", { title: "Could not delete dish", variant: "error" });
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                Menu Inventory & Stock Management
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                {filteredFoods.length} of {foods.length} Dishes
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live authentic catalog across {availableCategories.length} categories. Toggle real-time kitchen availability or edit specifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dish, cuisine, ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
              />
              <svg className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <Link
              to="/admin/foods/new"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition shrink-0 ${availableCategories.length ? "bg-emerald-700 hover:bg-emerald-800 cursor-pointer" : "bg-slate-400 pointer-events-none"}`}
              title={availableCategories.length ? "Add a new dish to the live customer menu" : "Create a category before adding dishes"}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add New Food Dish</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold mr-1 text-[11px] shrink-0">Category:</span>
            {["All", ...availableCategories].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 text-xs shrink-0">
            <span className="text-slate-400 font-semibold mr-1 text-[11px]">Stock:</span>
            {[
              { id: "All", label: "All", count: foods.length },
              { id: "In Stock", label: "In Stock", count: foods.filter((f) => f.inStock !== false).length },
              { id: "Sold Out", label: "Sold Out", count: foods.filter((f) => f.inStock === false).length },
            ].map((st) => {
              const isSelected = selectedStock === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStock(st.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-2xs font-bold"
                      : "bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100"
                  }`}
                >
                  <span>{st.label}</span>
                  <span className={`ml-1 text-[10px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                    ({st.count})
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        <div className="overflow-x-auto max-h-[680px] overflow-y-auto pr-1">
          {filteredFoods.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-600">No dishes found matching your criteria.</p>
              <p>Try clearing your search query or changing category/stock filters.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="sticky top-0 bg-white border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] z-10">
                <tr>
                  <th className="pb-3 min-w-[220px]">Dish Details</th>
                  <th className="pb-3 min-w-[110px]">Category</th>
                  <th className="pb-3 min-w-[120px]">Cuisine</th>
                  <th className="pb-3 min-w-[90px]">Price</th>
                  <th className="pb-3 min-w-[100px]">Dietary</th>
                  <th className="pb-3 min-w-[120px]">Kitchen Stock</th>
                  <th className="pb-3 text-right min-w-[120px] pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFoods.map((f) => {
                  const isVegan = f.dietary === "Vegan";
                  const isVeg = f.isVeg !== false && f.dietary !== "Non-Veg";
                  const isAvailable = f.inStock !== false;

                  return (
                    <tr key={f.id} className="text-slate-700 hover:bg-slate-50/60 transition">
                      <td className="py-3 flex items-center gap-3">
                        <img
                          src={f.image}
                          alt={f.name}
                          className={`h-11 w-11 rounded-xl ${f.imageFit === "contain" ? "object-contain p-0.5 bg-white" : "object-cover"} border border-slate-200 shrink-0`}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/restaurant/${f.id}`}
                            target="_blank"
                            className="font-bold text-slate-900 hover:text-emerald-600 truncate block text-xs"
                            title="Open dish preview in new tab"
                          >
                            {f.name}
                          </Link>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            ID #{f.id} • {f.deliveryTime || "25-30 mins"} • {f.caloriesPerServing ? `${f.caloriesPerServing} kcal` : "Authentic"}
                          </p>
                        </div>
                      </td>

                      <td className="font-semibold text-slate-900 whitespace-nowrap">
                        {f.category}
                      </td>

                      <td className="whitespace-nowrap">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-700 text-[11px] border border-slate-200/60">
                          {f.cuisine || "Indian"}
                        </span>
                      </td>

                      <td className="font-black text-slate-900 whitespace-nowrap text-sm">
                        ₹{f.price || f.caloriesPerServing}
                      </td>

                      <td className="whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap border ${
                          isVegan
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : isVeg
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            isVegan ? "bg-emerald-600" : isVeg ? "bg-green-600" : "bg-red-600"
                          }`} />
                          <span>{isVegan ? "VEGAN" : isVeg ? "VEG" : "NON-VEG"}</span>
                        </span>
                      </td>

                      <td className="whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(f)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition cursor-pointer border ${
                            isAvailable
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                          }`}
                          title="Click to toggle live kitchen stock"
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-600" : "bg-rose-600"}`} />
                          <span>{isAvailable ? "In Stock" : "Sold Out"}</span>
                        </button>
                      </td>

                      <td className="text-right space-x-1.5 whitespace-nowrap pr-2">
                        <Link
                          to={`/admin/foods/edit/${f.id}`}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer transition shadow-2xs inline-block"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteFood(f.id, f.name)}
                          className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 hover:bg-red-100 cursor-pointer transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <FoodDishModal
        isOpen={isModalOpen}
        onClose={handleCloseFoodModal}
        onSave={handleSaveFood}
        editingFoodId={editingFoodId}
        foodForm={foodForm}
        setFoodForm={handleFoodFormChange}
        hasUnsavedChanges={hasUnsavedChanges}
        saveError={saveError}
        availableCategories={availableCategories}
        foodCuisines={dynamicCuisines}
        saving={saving}
      />
    </div>
  );
};

export default AdminFoodsPage;
