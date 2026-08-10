"use client";
import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

const schema = z.object({
  supplier_id: z.string().uuid("Supplier is required"),
  warehouse_id: z.string().uuid("Warehouse is required"),
  status: z.enum(["pending", "received", "cancelled"]),
  items: z.array(z.object({
    product_id: z.string().uuid().nullable().optional(),
    description: z.string().min(1, "Required"),
    quantity: z.string().min(1),
    unit_cost: z.string().min(1),
  })).min(1, "Add at least one line item"),
});

export default function PurchaseModal({ isOpen, onClose, onSave, purchase, suppliers, warehouses, products }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { supplier_id: "", warehouse_id: "", status: "pending", items: [{ product_id: null, description: "", quantity: "1", unit_cost: "" }] },
  });
  const { fields, append, remove: removeItem } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    reset(purchase ? {
      supplier_id: purchase.supplier_id || "",
      warehouse_id: purchase.warehouse_id || "",
      status: purchase.status || "pending",
      items: purchase.purchase_items?.length ? purchase.purchase_items.map(it => ({
        product_id: it.product_id, description: it.description, quantity: it.quantity?.toString(), unit_cost: it.unit_cost?.toString(),
      })) : [{ product_id: null, description: "", quantity: "1", unit_cost: "" }],
    } : undefined);
  }, [purchase, reset]);

  const submit = async (vals) => {
    await onSave({ ...vals, items: vals.items.map(it => ({ ...it, quantity: Number(it.quantity), unit_cost: Number(it.unit_cost) })) });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{purchase?.id ? "Edit Purchase" : "New Purchase"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Controller name="supplier_id" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Supplier" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
            <Controller name="warehouse_id" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Warehouse" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
            <Controller name="status" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {["pending", "received", "cancelled"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
          {(errors.supplier_id || errors.warehouse_id) && <p className="text-red-500 text-sm">Supplier and warehouse are required.</p>}
          <p className="text-xs text-text-3">Setting status to "received" posts stock-in movements for the warehouse above.</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-2">Line Items</p>
              <Button type="button" size="sm" variant="outline" onClick={() => append({ product_id: null, description: "", quantity: "1", unit_cost: "" })}>
                <Plus className="w-4 h-4 mr-1" />Add Item
              </Button>
            </div>
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-[1fr_1fr_70px_100px_auto] gap-2 items-start">
                <Controller name={`items.${idx}.product_id`} control={control} render={({ field }) => (
                  <Select onValueChange={(v) => field.onChange(v === "none" ? null : v)} value={field.value || "none"}>
                    <SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="none">Custom line</SelectItem>
                      {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                <Input placeholder="Description" {...register(`items.${idx}.description`)} />
                <Input placeholder="Qty" {...register(`items.${idx}.quantity`)} />
                <Input placeholder="Unit cost" {...register(`items.${idx}.unit_cost`)} />
                <Button type="button" size="sm" variant="destructive" onClick={() => removeItem(idx)} disabled={fields.length === 1}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {errors.items && <p className="text-red-500 text-sm">{errors.items.message || errors.items.root?.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{purchase?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
