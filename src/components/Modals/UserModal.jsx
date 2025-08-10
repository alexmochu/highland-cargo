"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
// import { toast } from "sonner";

export default function UserModal({
  isOpen,
  onClose,
  initialData = null,
  onSave,
  teamId,
  role = "admin",
}) {
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role,
    team_id: teamId || null,
    can_manage_products: true,
    can_manage_partners: true,
    can_manage_suppliers: true,
    can_manage_shipments: true,
    can_manage_team: false,
  });

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || role,
        team_id: initialData.team_id || teamId || null,
        can_manage_products: initialData.can_manage_products ?? true,
        can_manage_partners: initialData.can_manage_partners ?? true,
        can_manage_suppliers: initialData.can_manage_suppliers ?? true,
        can_manage_shipments: initialData.can_manage_shipments ?? true,
        can_manage_team: initialData.can_manage_team ?? false,
      });
    } else {
      setFormData((prev) => ({ ...prev, role, team_id: teamId || null }));
    }
  }, [initialData, teamId]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Name and email are required.");
      return;
    }

    try {
      let user_id;

      if (isEditing && initialData.user_id) {
        user_id = initialData.user_id;
      } else {
        const response = await fetch("/api/invite-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            role: formData.role,
            teamId,
          }),
        });
        
        // Try JSON parsing safely
        let result;
        try {
          result = await response.json();
        } catch {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error("Unexpected server response");
        }
        
        if (!response.ok) {
          console.log("err", result.error);
          throw new Error(result.error || "Failed to invite user.");
        }
        
        user_id = result.user_id;
        if (!user_id) throw new Error("User ID not returned from auth system.");
      }

      await supabase.from("profiles").upsert([
        {
          full_name: formData.name,
          email: formData.email,
          user_id,
          role: formData.role,
          is_admin: role === "admin",
          supplier_id: role === "supplier" ? teamId : null,
          partner_id: null,
        },
      ]);

      if (role === "admin") {
        await supabase.from("admin_team_members").upsert([
          {
            user_id,
            invited_by_admin_id: teamId,
            can_manage_products: formData.can_manage_products,
            can_manage_partners: formData.can_manage_partners,
            can_manage_suppliers: formData.can_manage_suppliers,
            can_manage_shipments: formData.can_manage_shipments,
          },
        ]);
      } else if (role === "supplier") {
        await supabase.from("supplier_team_members").upsert([
          {
            user_id,
            supplier_id: teamId,
            can_manage_products: formData.can_manage_products,
            can_manage_team: formData.can_manage_team,
          },
        ]);
      }

      alert(isEditing ? "Team member updated." : "Team member added.");
      onSave?.();
      onClose();
    } catch (err) {
      console.error("Error saving team member.",err);
      alert("Error saving team member.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Team Member" : "Add Team Member"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="can_manage_products" checked={formData.can_manage_products} onChange={handleChange} />
                    Products
                  </label>
                  {role === "admin" && (
                    <>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="can_manage_partners" checked={formData.can_manage_partners} onChange={handleChange} />
                        Partners
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="can_manage_suppliers" checked={formData.can_manage_suppliers} onChange={handleChange} />
                        Suppliers
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="can_manage_shipments" checked={formData.can_manage_shipments} onChange={handleChange} />
                        Shipments
                      </label>
                    </>
                  )}
                  {role === "supplier" && (
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="can_manage_team" checked={formData.can_manage_team} onChange={handleChange} />
                      Team
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
