// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { createClient } from "@/lib/supabase/client";
// // import { toast } from "sonner";

// export default function UserModal({
//   isOpen,
//   onClose,
//   initialData = null,
//   onSave,
//   teamId,
//   role = "admin",
// }) {
//   const supabase = createClient();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     role,
//     team_id: teamId || null,
//     can_manage_products: true,
//     can_manage_partners: true,
//     can_manage_suppliers: true,
//     can_manage_shipments: true,
//     can_manage_team: false,
//   });

//   const isEditing = !!initialData;

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         name: initialData.name || "",
//         email: initialData.email || "",
//         role: initialData.role || role,
//         team_id: initialData.team_id || teamId || null,
//         can_manage_products: initialData.can_manage_products ?? true,
//         can_manage_partners: initialData.can_manage_partners ?? true,
//         can_manage_suppliers: initialData.can_manage_suppliers ?? true,
//         can_manage_shipments: initialData.can_manage_shipments ?? true,
//         can_manage_team: initialData.can_manage_team ?? false,
//       });
//     } else {
//       setFormData((prev) => ({ ...prev, role, team_id: teamId || null }));
//     }
//   }, [initialData, teamId]);

//   const handleChange = (e) => {
//     const { name, type, checked, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.email) {
//       alert("Name and email are required.");
//       return;
//     }

//     try {
//       let user_id;

//       if (isEditing && initialData.user_id) {
//         user_id = initialData.user_id;
//       } else {
//         const response = await fetch("/api/invite-user", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: formData.email,
//             name: formData.name,
//             role: formData.role,
//             teamId,
//           }),
//         });
        
//         // Try JSON parsing safely
//         let result;
//         try {
//           result = await response.json();
//         } catch {
//           const text = await response.text();
//           console.error("Non-JSON response:", text);
//           throw new Error("Unexpected server response");
//         }
        
//         if (!response.ok) {
//           console.log("err", result.error);
//           throw new Error(result.error || "Failed to invite user.");
//         }
        
//         user_id = result.user_id;
//         if (!user_id) throw new Error("User ID not returned from auth system.");
//       }

//       await supabase.from("profiles").upsert([
//         {
//           full_name: formData.name,
//           email: formData.email,
//           user_id,
//           role: formData.role,
//           is_admin: role === "admin",
//           supplier_id: role === "supplier" ? teamId : null,
//           partner_id: null,
//         },
//       ]);

//       if (role === "admin") {
//         await supabase.from("admin_team_members").upsert([
//           {
//             user_id,
//             invited_by_admin_id: teamId,
//             can_manage_products: formData.can_manage_products,
//             can_manage_partners: formData.can_manage_partners,
//             can_manage_suppliers: formData.can_manage_suppliers,
//             can_manage_shipments: formData.can_manage_shipments,
//           },
//         ]);
//       } else if (role === "supplier") {
//         await supabase.from("supplier_team_members").upsert([
//           {
//             user_id,
//             supplier_id: teamId,
//             can_manage_products: formData.can_manage_products,
//             can_manage_team: formData.can_manage_team,
//           },
//         ]);
//       }

//       alert(isEditing ? "Team member updated." : "Team member added.");
//       onSave?.();
//       onClose();
//     } catch (err) {
//       console.error("Error saving team member.",err);
//       alert("Error saving team member.");
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div
//             className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg"
//             initial={{ scale: 0.9 }}
//             animate={{ scale: 1 }}
//             exit={{ scale: 0.9 }}
//           >
//             <h2 className="text-xl font-bold mb-4">
//               {isEditing ? "Edit Team Member" : "Add Team Member"}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full border p-2 rounded shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Email</label>
//                 <input
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full border p-2 rounded shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Permissions</label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" name="can_manage_products" checked={formData.can_manage_products} onChange={handleChange} />
//                     Products
//                   </label>
//                   {role === "admin" && (
//                     <>
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" name="can_manage_partners" checked={formData.can_manage_partners} onChange={handleChange} />
//                         Partners
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" name="can_manage_suppliers" checked={formData.can_manage_suppliers} onChange={handleChange} />
//                         Suppliers
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input type="checkbox" name="can_manage_shipments" checked={formData.can_manage_shipments} onChange={handleChange} />
//                         Shipments
//                       </label>
//                     </>
//                   )}
//                   {role === "supplier" && (
//                     <label className="flex items-center gap-2">
//                       <input type="checkbox" name="can_manage_team" checked={formData.can_manage_team} onChange={handleChange} />
//                       Team
//                     </label>
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 pt-4">
//                 <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
//                   {isEditing ? "Update" : "Add"}
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// profiles.role CHECK (['admin','supplier','partner'])
const schema = z.object({
  email: z.string().email("Valid email required"),
  full_name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["admin", "supplier", "partner"]),
  partner_id: z.string().uuid().nullable().optional(),
  supplier_id: z.string().uuid().nullable().optional(),
});

export default function UserModal({ isOpen, onClose, onSave, user, partners, suppliers }) {
  const { control, register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", full_name: "", role: "partner", partner_id: null, supplier_id: null },
  });

  const role = watch("role");

  useEffect(() => {
    reset(user ? {
      email: user.email || "",
      full_name: user.full_name || "",
      role: user.role || "partner",
      partner_id: user.partner_id || null,
      supplier_id: user.supplier_id || null,
    } : undefined);
  }, [user, reset]);

  const submit = async (vals) => {
    // If user.id exists -> update profile
    // If not -> invite via server route (creates auth user + profile), then close
    if (user?.id) {
      await onSave(vals);
    } else {
      await fetch("/api/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vals),
      }).then(async r => {
        if (!r.ok) throw new Error(await r.text());
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{user?.id ? "Edit User" : "Invite User"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <Input placeholder="Full name (optional)" {...register("full_name")} />
          {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

          {role === "partner" && (
            <Controller
              name="partner_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(v)=>field.onChange(v || null)} value={field.value || ""}>
                  <SelectTrigger><SelectValue placeholder="Assign Partner (optional)" /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">None</SelectItem>
                    {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          )}

          {role === "supplier" && (
            <Controller
              name="supplier_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(v)=>field.onChange(v || null)} value={field.value || ""}>
                  <SelectTrigger><SelectValue placeholder="Assign Supplier (optional)" /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">None</SelectItem>
                    {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{user?.id ? "Save" : "Invite"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

