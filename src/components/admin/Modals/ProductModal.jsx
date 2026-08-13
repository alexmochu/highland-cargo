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
import { X } from "lucide-react";

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
  images: z.any().optional(), // will handle validation in componen
});

export default function ProductModal({ isOpen, onClose, onSave, product, categories, partners, suppliers }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", price: "", info: "", description: "", category_id: "", partner_id: null, supplier_id: null, region: null, added_by_admin: true, images: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(product ? {
        name: product.name || "",
        price: product.price || "",
        info: product.info || "",
        description: product.description || "",
        category_id: product.category_id || "",
        partner_id: product.partner_id || null,
        supplier_id: product.supplier_id || null,
        region: product.region || null,
        added_by_admin: product.added_by_admin ?? true,
        images: product.product_images 
        ? product.product_images.map(img => ({ previewUrl: img.image_url, file: null }))
        : [],
      } : {
        name: "", price: "", info: "", description: "", category_id: "", partner_id: null, supplier_id: null, region: null, added_by_admin: true, images: [],
      });
    }
  }, [product, reset, isOpen]);

  const submit = async (vals) => { 
    try {
      await onSave(vals); 
      onClose(); 
    } catch (e) {
      // Error handled in useProductsPaginated
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-lg max-h-[90vh] overflow-y-auto">
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
              <Select onValueChange={(v) => field.onChange(v || null)} value={field.value || ""}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent className="bg-white">
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
              <Select onValueChange={(v) => field.onChange(v || null)} value={field.value || ""}>
                <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent className="bg-white">
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
              <Select onValueChange={(v) => field.onChange(v === "all" ? null : v)} value={field.value || "all"}>
                <SelectTrigger><SelectValue placeholder="Partner (optional)" /></SelectTrigger>
                <SelectContent className="bg-white">
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
              <Select onValueChange={(v) => field.onChange(v === "all" ? null : v)} value={field.value || "all"}>
                <SelectTrigger><SelectValue placeholder="Supplier (optional)" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">None</SelectItem>
                  {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />

<Controller
  name="images"
  control={control}
  render={({ field }) => {
    const handleFiles = (e) => {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      const updated = [...(field.value || []), ...newFiles].slice(0, 4);
      field.onChange(updated);

      // Reset input so selecting the same file again still triggers onChange
      e.target.value = null;
    };

    const removeFile = (index) => {
      const newFiles = field.value.filter((_, i) => i !== index);
      field.onChange(newFiles);
    };

    return (
      <div className="space-y-2">
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
        />
        <p className="text-sm text-text-3">Upload up to 4 images</p>

        {/* Previews */}
        {field.value?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {field.value.map((file, idx) => (
              <div
                key={idx}
                className="relative w-20 h-20 border rounded overflow-hidden group"
              >
                <img
                  src={file.previewUrl || URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover"
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }}
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

