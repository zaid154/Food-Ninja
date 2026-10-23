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
    isFeatured: false,
  };

  const [form, setForm] = useState(initialCategory);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "featured" | "active" | "hidden"

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
      isFeatured: Boolean(cat.isFeatured),
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

  const handleToggleFeatured = async (cat) => {
    try {
      const newFeatured = !cat.isFeatured;
      const res = await fetch(`${API_BASE_URL}/categories/${cat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newFeatured }),
      });
      if (res.ok) {
        showToast(`Category "${cat.name}" ${newFeatured ? "added to Homepage Showcase" : "removed from Homepage Showcase"}.`);
        if (onRefresh) onRefresh();
      }
    } catch {
      alert("Failed to update featured showcase status.");
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (cat.name && cat.name.toLowerCase().includes(q)) ||
      (cat.description && cat.description.toLowerCase().includes(q));

    let matchesFilter = true;
    if (filterType === "featured") matchesFilter = Boolean(cat.isFeatured);
    else if (filterType === "active") matchesFilter = cat.isActive !== false;
    else if (filterType === "hidden") matchesFilter = cat.isActive === false;

    return matchesSearch && matchesFilter;
  });

  const featuredCount = categories.filter((c) => Boolean(c.isFeatured)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 bg-white p-5 rounded-xl shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Menu Categories & Scalability ({categories.length} Total)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Scalable architecture supporting 90+ categories with Homepage Showcase control
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold">
            {categories.filter((c) => c.isActive !== false).length} Active on Menu
          </span>
          <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 text-xs font-bold">
            {featuredCount} in Home Showcase (Top 7-8)
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] min-w-0">
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  min="1"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400">Order on menu</span>
              </div>

              {/* Homepage Showcase Switch */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Home Showcase</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 px-2 text-xs font-bold transition cursor-pointer ${
                    form.isFeatured
                      ? "border-amber-400 bg-amber-50 text-amber-900"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <svg className={`h-3.5 w-3.5 ${form.isFeatured ? "text-amber-600" : "text-slate-400"}`} fill={form.isFeatured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>{form.isFeatured ? "Featured (Home)" : "Menu Only"}</span>
                </button>
                <span className="text-[10px] text-slate-400">Max 7-8 on homepage</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Saving..." : editingId ? "Update Category" : "Add Category to Menu"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm(initialCategory); }}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Categories Cards Grid with Search & Filters */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Category Inventory & Home Showcase ({filteredCategories.length} of {categories.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle home showcase or active menu status
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search category name..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
              />
              <svg className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: "all", label: "All Categories", count: categories.length },
              { id: "featured", label: "Featured in Home Showcase", count: featuredCount },
              { id: "active", label: "Active", count: categories.filter((c) => c.isActive !== false).length },
              { id: "hidden", label: "Hidden", count: categories.filter((c) => c.isActive === false).length },
            ].map((f) => {
              const isActive = filterType === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterType(f.id)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100"
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`ml-1.5 text-[10px] font-bold ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No categories match your search or filter.
            </div>
          ) : (
            <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredCategories.map((cat) => (
                <div
                  key={cat._id || cat.name}
                  className={`relative flex flex-col justify-between rounded-2xl border p-4 transition shadow-2xs ${cat.bg || "bg-slate-50"} ${
                    cat.isActive === false ? "opacity-60 border-dashed border-slate-300" : "border-slate-200/80 hover:shadow-md"
                  }`}
                >
                  {/* Top Status Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200/60 shadow-2xs">
                      Order #{cat.displayOrder || 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Home Showcase Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(cat)}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition cursor-pointer flex items-center gap-1 border ${
                          cat.isFeatured
                            ? "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
                            : "bg-white/80 text-slate-500 border-slate-200 hover:bg-slate-100"
                        }`}
                        title="Click to toggle Homepage Showcase"
                      >
                        <svg className={`h-3 w-3 ${cat.isFeatured ? "text-amber-600" : "text-slate-400"}`} fill={cat.isFeatured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>{cat.isFeatured ? "Home" : "+ Home"}</span>
                      </button>

                      {/* Active / Hidden Status Button */}
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
                      className="rounded-lg bg-white/90 border border-slate-200/90 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white shadow-2xs cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat._id, cat.name)}
                      className="rounded-lg bg-rose-50 border border-rose-200/80 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
