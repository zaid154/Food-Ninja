import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Constants";

const COLOR_PRESETS = [
  { label: "Emerald Pastel", bg: "bg-[#f4faee]", border: "border-[#d8ecd0]" },
  { label: "Warm Orange", bg: "bg-[#fff3eb]", border: "border-[#fed7aa]" },
  { label: "Golden Yellow", bg: "bg-[#fff8e7]", border: "border-[#fef08a]" },
  { label: "Soft Rose", bg: "bg-[#fef2f2]", border: "border-[#fecaca]" },
  { label: "Lemon Yellow", bg: "bg-[#fef9c3]", border: "border-[#fde047]" },
  { label: "Pastel Pink", bg: "bg-[#fdf2f8]", border: "border-[#fbcfe8]" },
  { label: "Sky Blue", bg: "bg-[#f0f9ff]", border: "border-[#bae6fd]" },
  { label: "Soft Violet", bg: "bg-[#f5f3ff]", border: "border-[#ddd6fe]" },
];

const AdminCategories = (props) => {
  const context = useOutletContext() || {};
  const categories = props.categories || context.categories || [];
  const onRefresh = props.onRefresh || context.fetchData;
  const showToast = props.showToast || context.showToast || alert;

  const initialCategory = {
    name: "",
    img: "",
    bg: "bg-[#f4faee]",
    description: "",
    displayOrder: 1,
  };

  const [form, setForm] = useState(initialCategory);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      setSaving(true);
      const url = editingId ? `${API_BASE_URL}/categories/${editingId}` : `${API_BASE_URL}/categories`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingId ? "Category updated successfully!" : "New category created successfully!");
        setForm(initialCategory);
        setEditingId(null);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || "Failed to save category.");
      }
    } catch {
      alert("Error connecting to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || "",
      img: cat.img || "",
      bg: cat.bg || "bg-[#f4faee]",
      description: cat.description || "",
      displayOrder: cat.displayOrder || 1,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Dishes in this category will remain safe.`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Category "${name}" deleted.`);
        if (onRefresh) onRefresh();
      } else {
        alert("Failed to delete category.");
      }
    } catch {
      alert("Error connecting to server.");
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${cat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      if (res.ok) {
        showToast(`Category "${cat.name}" is now ${!cat.isActive ? "Active" : "Hidden"}.`);
        if (onRefresh) onRefresh();
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 bg-white p-5 rounded-xl shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Menu Categories & Cuisines ({categories.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, style, and manage categories displayed on the customer Menu page
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold">
            {categories.filter((c) => c.isActive !== false).length} Active on Menu
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Category Creation / Edit Form */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm">
              {editingId ? "Edit Category" : "Create New Category"}
            </h3>
            {editingId && (
              <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                Editing
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Desserts & Sweets"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Image URL (Square photo recommended) *</label>
              <input
                type="url"
                required
                value={form.img}
                onChange={(e) => setForm({ ...form, img: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
              {form.img && (
                <div className="mt-2 flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-2">
                  <img
                    src={form.img}
                    alt="Preview"
                    className="h-12 w-12 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80"; }}
                  />
                  <div className="min-w-0 text-[11px] text-slate-500">
                    <p className="font-semibold text-slate-700">Image Preview</p>
                    <p className="truncate text-slate-400">Card circular thumbnail</p>
                  </div>
                </div>
              )}
            </div>

            {/* Background Color Palette */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Card Background Theme</label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.map((p) => {
                  const isSelected = form.bg === p.bg;
                  return (
                    <button
                      key={p.bg}
                      type="button"
                      onClick={() => setForm({ ...form, bg: p.bg })}
                      className={`h-9 rounded-lg border transition flex items-center justify-center cursor-pointer ${p.bg} ${
                        isSelected ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-105" : "border-slate-200 hover:border-slate-300"
                      }`}
                      title={p.label}
                    >
                      {isSelected && (
                        <svg className="h-3.5 w-3.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description / Tagline</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Freshly prepared specialty delicacies made with authentic recipes."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Display Order</label>
              <input
                type="number"
                min="1"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400">Lower numbers appear first on menu</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Category" : "Add Category to Menu"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm(initialCategory); }}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Categories Cards Grid */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Live Categories Preview ({categories.length})
            </h3>
            <span className="text-xs text-slate-400">Preview as rendered on Customer Menu</span>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat._id || cat.name}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 transition shadow-2xs ${cat.bg || "bg-slate-50"} ${
                  cat.isActive === false ? "opacity-60 border-dashed border-slate-300" : "border-slate-200/80 hover:shadow-md"
                }`}
              >
                {/* Status Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200/60 shadow-2xs">
                    Order #{cat.displayOrder || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(cat)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition cursor-pointer ${
                      cat.isActive !== false
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                    title="Click to toggle active status"
                  >
                    {cat.isActive !== false ? "Active" : "Hidden"}
                  </button>
                </div>

                {/* Card Content */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-14 w-14 rounded-full overflow-hidden bg-white shadow-xs p-1 shrink-0">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="h-full w-full object-cover rounded-full"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80"; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {cat.description || "Authentic recipes"}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-700 mt-1">
                      {cat.dishCount !== undefined ? `${cat.dishCount} Dishes` : "Catalog active"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5 border-t border-slate-200/60 pt-2.5">
                  <button
                    type="button"
                    onClick={() => handleEdit(cat)}
                    className="rounded-lg bg-white/90 border border-slate-200/90 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white shadow-2xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="rounded-lg bg-rose-50 border border-rose-200/80 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
