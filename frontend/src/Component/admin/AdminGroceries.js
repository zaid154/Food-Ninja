import React, { useState } from "react";

export const GROCERY_CATEGORIES = [
  "Dairy, Bread & Eggs",
  "Fruits & Vegetables",
  "Snacks & Munchies",
  "Cold Drinks & Juices",
  "Bakery & Biscuits",
  "Atta, Rice & Dal",
  "Masala, Oil & Dry Fruits",
  "Meat, Fish & Seafood",
  "Daily Essentials"
];

const AdminGroceries = ({ groceries, onRefresh, showToast }) => {
  const initialGrocery = {
    title: "",
    category: "Dairy, Bread & Eggs",
    price: "",
    unit: "1 Litre",
    stock: 50,
    thumbnail: "",
    description: ""
  };

  const [groceryForm, setGroceryForm] = useState(initialGrocery);
  const [editingGroceryId, setEditingGroceryId] = useState(null);

  const handleSaveGrocery = async (e) => {
    e.preventDefault();
    const payload = {
      title: groceryForm.title.trim(),
      category: groceryForm.category,
      price: Number(groceryForm.price),
      unit: groceryForm.unit.trim() || "1 Unit",
      stock: Number(groceryForm.stock) || 50,
      thumbnail: groceryForm.thumbnail.trim(),
      description: groceryForm.description.trim() || `Fresh ${groceryForm.title} delivered express.`,
      rating: 4.8
    };

    try {
      const url = editingGroceryId
        ? `http://localhost:5000/api/groceries/${editingGroceryId}`
        : "http://localhost:5000/api/groceries";
      const res = await fetch(url, {
        method: editingGroceryId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingGroceryId ? "Grocery product updated!" : "New grocery product added!");
        setGroceryForm(initialGrocery);
        setEditingGroceryId(null);
        onRefresh();
      } else {
        alert("Failed to save grocery item.");
      }
    } catch {
      alert("Error connecting to server.");
    }
  };

  const handleDeleteGrocery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this grocery item?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/groceries/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Grocery item removed from store");
        onRefresh();
      }
    } catch {
      alert("Failed to delete grocery");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      {/* Grocery Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="font-black text-slate-900 text-sm">
            {editingGroceryId ? "Edit Grocery Product" : "Add New Grocery Product"}
          </h3>
          {editingGroceryId && (
            <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
              Editing #{editingGroceryId}
            </span>
          )}
        </div>

        <form onSubmit={handleSaveGrocery} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={groceryForm.title}
              onChange={(e) => setGroceryForm({ ...groceryForm, title: e.target.value })}
              placeholder="e.g. Amul Taaza Homogenised Milk"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={groceryForm.category}
                onChange={(e) => setGroceryForm({ ...groceryForm, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 bg-white"
              >
                {GROCERY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit / Pack Size *</label>
              <input
                type="text"
                required
                value={groceryForm.unit}
                onChange={(e) => setGroceryForm({ ...groceryForm, unit: e.target.value })}
                placeholder="e.g. 1 Litre / 500 g"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                value={groceryForm.price}
                onChange={(e) => setGroceryForm({ ...groceryForm, price: e.target.value })}
                placeholder="54"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={groceryForm.stock}
                onChange={(e) => setGroceryForm({ ...groceryForm, stock: e.target.value })}
                placeholder="50"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Thumbnail Image URL *</label>
            <input
              type="url"
              required
              value={groceryForm.thumbnail}
              onChange={(e) => setGroceryForm({ ...groceryForm, thumbnail: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Product Description</label>
            <textarea
              rows={2}
              value={groceryForm.description}
              onChange={(e) => setGroceryForm({ ...groceryForm, description: e.target.value })}
              placeholder="Fresh, premium quality grocery essential."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {editingGroceryId ? "Update Grocery Product" : "Add to Grocery Store"}
            </button>
            {editingGroceryId && (
              <button
                type="button"
                onClick={() => { setEditingGroceryId(null); setGroceryForm(initialGrocery); }}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Grocery Products Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-extrabold text-slate-900 text-sm mb-4">
          Current Active Groceries ({groceries.length})
        </h3>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-white border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="pb-2.5">Product</th>
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5">Unit / Weight</th>
                <th className="pb-2.5">Price</th>
                <th className="pb-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groceries.map((g) => (
                <tr key={g.id} className="text-slate-700">
                  <td className="py-3 flex items-center gap-3">
                    <img src={g.thumbnail || g.images?.[0]} alt={g.title} className="h-10 w-10 rounded-lg object-cover border border-slate-200" />
                    <span className="font-bold text-slate-900">{g.title}</span>
                  </td>
                  <td>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-800 font-medium text-[11px]">
                      {g.category}
                    </span>
                  </td>
                  <td className="text-slate-500 font-mono">{g.unit || "1 Unit"}</td>
                  <td className="font-black text-slate-900">₹{g.price}</td>
                  <td className="text-right space-x-1.5">
                    <button
                      onClick={() => {
                        setEditingGroceryId(g.id);
                        setGroceryForm({
                          title: g.title || "",
                          category: g.category || "Dairy, Bread & Eggs",
                          price: g.price || 50,
                          unit: g.unit || "1 kg",
                          stock: g.stock || 50,
                          thumbnail: g.thumbnail || g.images?.[0] || "",
                          description: g.description || ""
                        });
                      }}
                      className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-bold text-slate-700 hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGrocery(g.id)}
                      className="rounded-lg bg-red-50 px-2.5 py-1.5 font-bold text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminGroceries;
