"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CompanyDetails({
  userId,
  supplierId,
  onNext,
}) {
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", country: "" });

  async function handleSubmit(e) {
    e.preventDefault();

    let id = supplierId;

    // If supplier does not exist, create it
    if (!id) {
      const { data: supplier, error } = await supabase
        .from("suppliers")
        .insert([{ name: form.name, location: form.country }])
        .select()
        .single();

      if (error) {
        console.error("Error creating supplier:", error);
        return;
      }
      id = supplier.id;

      // Link profile + team
      await supabase.from("profiles").update({ supplier_id: id }).eq("user_id", userId);
      await supabase.from("supplier_team_members").insert([{ supplier_id: id, user_id: userId }]);
    } else {
      // Update supplier info
      await supabase.from("suppliers").update({
        name: form.name,
        location: form.country,
      }).eq("id", id);
    }

    onNext();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Company Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Country"
        value={form.country}
        onChange={e => setForm({ ...form, country: e.target.value })}
        required
      />
      <button type="submit">Save & Continue</button>
    </form>
  );
}
