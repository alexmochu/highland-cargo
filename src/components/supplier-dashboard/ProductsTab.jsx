"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useProducts } from "@/hooks/supplier/useSupplierData";
import * as svc from "@/services/supplierService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2),
  price: z.string().optional(),
  description: z.string().optional(),
  region: z.enum(["dubai", "china", "uk"]),
  category_id: z.string().min(1, "Category is required"),
});

export default function ProductsTab({ supplierId }) {
  const { products, reload, loading } = useProducts(supplierId);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", price: "", description: "", region: "dubai", category_id: "" }
  });

  useEffect(() => {
    svc.fetchCategories(setCategories);
  }, []);

  useEffect(() => {
    if (editing) {
      reset({
        name: editing.name || "",
        price: editing.price || "",
        description: editing.description || "",
        region: editing.region || "dubai",
        category_id: editing.category_id || "",
      });
      setOpen(true);
    }
  }, [editing, reset]);

  const onSubmit = async (vals) => {
    try {
      const payload = { ...vals, supplier_id: supplierId };
      await svc.saveProductForSupplier(payload, editing?.id);
      toast.success("Product saved");
      setOpen(false);
      setEditing(null);
      reload();
    } catch (e) {
      toast.error("Failed to save product");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      await svc.deleteProductById(id);
      toast.success("Product deleted");
      reload();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Button className="bg-ink text-paper" onClick={() => { setEditing(null); reset(); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Region</th>
                  <th>Price</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {!loading && products.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.product_categories?.name}</td>
                    <td className="uppercase">{p.region}</td>
                    <td>{p.price}</td>
                    {/* <td className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(p.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td> */}
                  </tr>
                ))}
                {loading && <tr><td colSpan={5}>Loading…</td></tr>}
              </tbody>
            </table></div>
          </div>
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">{editing ? "Edit product" : "Add product"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input className="input w-full" placeholder="Name" {...register("name")} />
              {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}

              <select {...register("category_id")} className="input w-full">
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <div className="text-red-500 text-sm">{errors.category_id.message}</div>}

              <input className="input w-full" placeholder="Price" {...register("price")} />
              <textarea className="textarea w-full" placeholder="Description" {...register("description")} />

              <label className="block text-sm">Region</label>
              <select {...register("region")} className="input w-full">
                <option value="dubai">Dubai</option>
                <option value="china">China</option>
                <option value="uk">UK</option>
              </select>

              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => { setOpen(false); setEditing(null); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {editing ? "Save" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
