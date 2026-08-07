"use client";
import { useState, useEffect } from "react";
import * as svc from "@/services/supplierService";

export default function ProductQuickAdd({ supplierId, onNext }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", region: "dubai", category_id: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    svc.fetchCategories(setCategories);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await svc.saveProductForSupplier({ ...form, supplier_id: supplierId });
      onNext();
    } catch (err) {
      setError(err.message || "Failed to add product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
      <p className="text-slate-500 text-sm">Add your first product to get listed in the catalog -- you can add more later from your dashboard.</p>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
        <input
          type="text"
          className="border border-slate-300 rounded-lg p-2 w-full"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <select
          className="border border-slate-300 rounded-lg p-2 w-full"
          value={form.category_id}
          onChange={e => setForm({ ...form, category_id: e.target.value })}
          required
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
          <input
            type="text"
            className="border border-slate-300 rounded-lg p-2 w-full"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Warehouse Region</label>
          <select
            className="border border-slate-300 rounded-lg p-2 w-full"
            value={form.region}
            onChange={e => setForm({ ...form, region: e.target.value })}
          >
            <option value="dubai">Dubai</option>
            <option value="china">China</option>
            <option value="uk">UK</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          className="border border-slate-300 rounded-lg p-2 w-full"
          rows={3}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={onNext} className="text-slate-500 text-sm underline">
          Skip for now
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save & Continue →"}
        </button>
      </div>
    </form>
  );
}
