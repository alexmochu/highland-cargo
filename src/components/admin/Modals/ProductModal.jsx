// "use client";

// import { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// // import { toast } from "sonner";
// import { createClient } from "@/lib/supabase/client";

// export default function ProductModal({ isOpen, onClose, product = null, onSave }) {
//   const supabase = createClient();

//   const [formData, setFormData] = useState({
//     name: "",
//     region: "",
//     price: "",
//     description: "",
//   });

//   const isEditing = !!product;

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || "",
//         region: product.region || "",
//         price: product.price || "",
//         description: product.description || "",
//       });
//     } else {
//       setFormData({ name: "", region: "", price: "", description: "" });
//     }
//   }, [product]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     const { name, region, price } = formData;

//     if (!name || !region || !price) {
//       alert("Please fill in required fields.");
//       return;
//     }

//     try {
//       if (isEditing) {
//         const { error } = await supabase
//           .from("products")
//           .update(formData)
//           .eq("id", product.id);

//         if (error) throw error;
//         alert("Product updated successfully.");
//       } else {
//         const { error } = await supabase.from("products").insert([formData]);
//         if (error) throw error;
//         alert("Product created successfully.");
//       }

//       onClose();
//       if (onSave) onSave(); // Optionally trigger a refresh in parent
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="name">Name</Label>
//             <Input name="name" value={formData.name} onChange={handleChange} />
//           </div>
//           <div>
//             <Label htmlFor="region">Region</Label>
//             <Input name="region" value={formData.region} onChange={handleChange} />
//           </div>
//           <div>
//             <Label htmlFor="price">Price</Label>
//             <Input
//               name="price"
//               type="number"
//               min="0"
//               value={formData.price}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Input name="description" value={formData.description} onChange={handleChange} />
//           </div>
//         </div>

//         <div className="pt-4 flex justify-end gap-2">
//           <Button variant="ghost" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit}>
//             {isEditing ? "Update" : "Create"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.string().min(1, "Price is required"), // schema uses text
  info: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().uuid("Select a category"),
  partner_id: z.string().uuid().nullable().optional(),
  supplier_id: z.string().uuid().nullable().optional(),
  region: z.enum(["dubai", "china", "uk"], { required_error: "Region is required" }),
  added_by_admin: z.boolean().optional(),
});

export default function ProductModal({ isOpen, onClose, onSave, product, categories, partners, suppliers }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", price: "", info: "", description: "", category_id: "", partner_id: null, supplier_id: null, region: "dubai", added_by_admin: true,
    },
  });

  useEffect(() => {
    reset(product ? {
      name: product.name || "",
      price: product.price || "",
      info: product.info || "",
      description: product.description || "",
      category_id: product.category_id || "",
      partner_id: product.partner_id || null,
      supplier_id: product.supplier_id || null,
      region: product.region || "dubai",
      added_by_admin: product.added_by_admin ?? true,
    } : undefined);
  }, [product, reset]);

  const submit = async (vals) => { await onSave(vals); onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Input placeholder="Price (text)" {...register("price")} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

          <Textarea placeholder="Description" {...register("description")} />
          <Textarea placeholder="Info (optional)" {...register("info")} />

          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}

          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent>
                  {["dubai","china","uk"].map(r => <SelectItem key={r} value={r}>{r.toUpperCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {errors.region && <p className="text-red-500 text-sm">{errors.region.message}</p>}

          <Controller
            name="partner_id"
            control={control}
            render={({ field }) => (
              <Select onValueChange={(v)=>field.onChange(v || null)} value={field.value || ""}>
                <SelectTrigger><SelectValue placeholder="Partner (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">None</SelectItem>
                  {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="supplier_id"
            control={control}
            render={({ field }) => (
              <Select onValueChange={(v)=>field.onChange(v || null)} value={field.value || ""}>
                <SelectTrigger><SelectValue placeholder="Supplier (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">None</SelectItem>
                  {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

