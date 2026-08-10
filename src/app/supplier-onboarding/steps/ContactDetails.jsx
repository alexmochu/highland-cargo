"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactDetails({ supplierId, onNext }) {
  const supabase = createClient();
  const [form, setForm] = useState({ contact_email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supplierId) {
      setError("Company details must be saved first.");
      return;
    }
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("suppliers")
      .update({ contact_email: form.contact_email, phone: form.phone })
      .eq("id", supplierId);

    setSaving(false);

    if (updateError) {
      setError(updateError.message || "Failed to save contact details.");
      return;
    }

    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-text-2 mb-1">Contact Email</label>
        <input
          type="email"
          className="border border-line-strong rounded-lg p-2 w-full"
          placeholder="you@company.com"
          value={form.contact_email}
          onChange={e => setForm({ ...form, contact_email: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-2 mb-1">Phone Number</label>
        <input
          type="tel"
          className="border border-line-strong rounded-lg p-2 w-full"
          placeholder="+254 7XX XXX XXX"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-ink text-paper px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save & Continue →"}
      </button>
    </form>
  );
}
