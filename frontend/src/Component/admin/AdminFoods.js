import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";

export const FOOD_CATEGORIES = [
  "Biryani",
  "North Indian",
  "South Indian",
  "Chinese",
  "Pizza",
  "Burgers",
  "Rolls & Wraps",
  "Momos & Dimsum",
  "Pasta & Italian",
  "Sandwiches & Snacks",
  "Mughlai & Kebabs",
  "Desserts & Sweets",
  "Beverages & Drinks",
  "Salads & Healthy Bowls",
  "Street Food"
];

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

const AdminFoods = (props) => {
  const context = useOutletContext() || {};
  const foods = props.foods || context.foods || [];
  const onRefresh = props.onRefresh || context.fetchData;
  const showToast = props.showToast || context.showToast || alert;

  const initialFood = {
    name: "",
    category: "Biryani",
    cuisine: "Hyderabadi",
    price: "",
    caloriesPerServing: "",
    deliveryTime: "25-30 mins",
    dietary: "Veg",
    isVeg: true,
    image: "",
    description: "",
    ingredients: ""
  };

  const [foodForm, setFoodForm] = useState(initialFood);
  const [editingFoodId, setEditingFoodId] = useState(null);

  const handleSaveFood = async (e) => {
    e.preventDefault();
    const ingArray = typeof foodForm.ingredients === "string"
      ? foodForm.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
      : foodForm.ingredients;

    const isVegVal = foodForm.dietary === "Non-Veg" ? false : true;

    const payload = {
      name: foodForm.name.trim(),
      category: foodForm.category,
      cuisine: foodForm.cuisine || "Indian",
      price: Number(foodForm.price),
      caloriesPerServing: Number(foodForm.caloriesPerServing) || Number(foodForm.price) * 2,
      deliveryTime: foodForm.deliveryTime || "25-30 mins",
      isVeg: isVegVal,
      dietary: foodForm.dietary || (isVegVal ? "Veg" : "Non-Veg"),
      image: foodForm.image.trim(),
      description: foodForm.description.trim() || `Authentic ${foodForm.name} prepared fresh with aromatic ingredients.`,
      ingredients: ingArray.length > 0 ? ingArray : ["Fresh Ingredients", "Spices", "Chef Special Blend"],
      rating: 4.8
    };

    try {
      const url = editingFoodId ? `${API_BASE_URL}/recipes/${editingFoodId}` : `${API_BASE_URL}/recipes`;
      const res = await fetch(url, {
        method: editingFoodId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingFoodId ? "Dish updated successfully!" : "New food dish added to menu!");
        setFoodForm(initialFood);
        setEditingFoodId(null);
        onRefresh();
      } else {
        alert("Failed to save food dish.");
      }
    } catch {
      alert("Error connecting to server.");
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish from the menu?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/recipes/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Dish removed from menu");
        onRefresh();
      }
    } catch {
      alert("Failed to delete dish");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      {/* Food Form */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs h-fit">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-slate-900 text-sm">
            {editingFoodId ? "Edit Food Dish" : "Add New Food Dish"}
          </h3>
          {editingFoodId && (
            <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
              Editing #{editingFoodId}
            </span>
          )}
        </div>

        <form onSubmit={handleSaveFood} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Dish Name *</label>
            <input
              type="text"
              required
              value={foodForm.name}
              onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
              placeholder="e.g. Hyderabadi Dum Biryani"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={foodForm.category}
                onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 bg-white"
              >
                {FOOD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cuisine / Origin *</label>
              <select
                value={foodForm.cuisine}
                onChange={(e) => setFoodForm({ ...foodForm, cuisine: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 bg-white"
              >
                {FOOD_CUISINES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                value={foodForm.price}
                onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                placeholder="199"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Calories (Kcal)</label>
              <input
                type="number"
                value={foodForm.caloriesPerServing}
                onChange={(e) => setFoodForm({ ...foodForm, caloriesPerServing: e.target.value })}
                placeholder="320"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Delivery Time</label>
              <input
                type="text"
                value={foodForm.deliveryTime}
                onChange={(e) => setFoodForm({ ...foodForm, deliveryTime: e.target.value })}
                placeholder="25-30 mins"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Image URL (Direct Link) *</label>
            <input
              type="url"
              required
              value={foodForm.image}
              onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description / Summary</label>
            <textarea
              rows={2}
              value={foodForm.description}
              onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
              placeholder="Authentic dish prepared fresh with traditional herbs and premium ingredients."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Key Ingredients (Comma Separated)</label>
            <input
              type="text"
              value={Array.isArray(foodForm.ingredients) ? foodForm.ingredients.join(", ") : foodForm.ingredients}
              onChange={(e) => setFoodForm({ ...foodForm, ingredients: e.target.value })}
              placeholder="Basmati Rice, Spices, Ghee, Mint, Caramelized Onions"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-400">Separated by comma for tags in product page</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Dietary / Food Type *</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFoodForm({ ...foodForm, dietary: "Veg", isVeg: true })}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 px-1 text-xs font-bold transition ${
                  (foodForm.dietary || (foodForm.isVeg ? "Veg" : "Non-Veg")) === "Veg"
                    ? "border-green-600 bg-green-50 text-green-700"
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
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 px-1 text-xs font-bold transition ${
                  (foodForm.dietary || (foodForm.isVeg ? "Veg" : "Non-Veg")) === "Non-Veg"
                    ? "border-red-600 bg-red-50 text-red-700"
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
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 px-1 text-xs font-bold transition ${
                  foodForm.dietary === "Vegan"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-xs">🌱</span>
                <span>Vegan</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {editingFoodId ? "Update Dish in Menu" : "Add Dish to Menu"}
            </button>
            {editingFoodId && (
              <button
                type="button"
                onClick={() => { setEditingFoodId(null); setFoodForm(initialFood); }}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Food Dishes Table */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          Current Active Food Dishes ({foods.length})
        </h3>
        <div className="overflow-x-auto max-h-[640px] overflow-y-auto pr-1">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="sticky top-0 bg-white border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] z-10">
              <tr>
                <th className="pb-2.5 min-w-[160px]">Dish</th>
                <th className="pb-2.5 min-w-[90px]">Category</th>
                <th className="pb-2.5 min-w-[100px]">Cuisine</th>
                <th className="pb-2.5 min-w-[70px]">Price</th>
                <th className="pb-2.5 min-w-[90px]">Type</th>
                <th className="pb-2.5 text-right min-w-[110px] pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {foods.map((f) => {
                const isVegan = f.dietary === "Vegan";
                const isVeg = f.isVeg !== false && f.dietary !== "Non-Veg";

                return (
                  <tr key={f.id} className="text-slate-700 hover:bg-slate-50/50 transition">
                    <td className="py-3 flex items-center gap-3">
                      <img src={f.image} alt={f.name} className="h-10 w-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <Link to={`/restaurant/${f.id}`} target="_blank" className="font-bold text-slate-900 hover:text-emerald-600 truncate block">
                          {f.name}
                        </Link>
                        <p className="text-[10px] text-slate-400">{f.deliveryTime || "25-30 mins"}</p>
                      </div>
                    </td>
                    <td className="font-medium text-slate-900 whitespace-nowrap">{f.category}</td>
                    <td className="whitespace-nowrap">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700 text-[11px]">
                        {f.cuisine || "Indian"}
                      </span>
                    </td>
                    <td className="font-black text-slate-900 whitespace-nowrap">₹{f.price || f.caloriesPerServing}</td>
                    <td className="whitespace-nowrap">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                        isVegan
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : isVeg
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {isVegan ? "VEGAN 🌱" : isVeg ? "VEG" : "NON-VEG"}
                      </span>
                    </td>
                    <td className="text-right space-x-1.5 whitespace-nowrap pr-2">
                      <button
                        onClick={() => {
                          setEditingFoodId(f.id);
                          const foodDietary = f.dietary || (f.isVeg !== false ? "Veg" : "Non-Veg");
                          setFoodForm({
                            name: f.name || "",
                            category: f.category || "Biryani",
                            cuisine: f.cuisine || "Indian",
                            price: f.price || f.caloriesPerServing || 199,
                            caloriesPerServing: f.caloriesPerServing || 300,
                            deliveryTime: f.deliveryTime || "25-30 mins",
                            dietary: foodDietary,
                            isVeg: foodDietary !== "Non-Veg",
                            image: f.image || "",
                            description: f.description || "",
                            ingredients: Array.isArray(f.ingredients) ? f.ingredients.join(", ") : (f.ingredients || "")
                          });
                        }}
                        className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-bold text-slate-700 hover:bg-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFood(f.id)}
                        className="rounded-lg bg-red-50 px-2.5 py-1.5 font-bold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFoods;
