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
  warehouse_id: z.string().uuid("Required"),
  reason: z.string().optional(),
  status: z.enum(["pending", "approved"]),
  items: z.array(z.object({
    product_id: z.string().uuid("Product required"),
    quantity_change: z.string().min(1),
  })).min(1, "Add at least one item"),
});

export default function StockAdjustmentModal({ isOpen, onClose, onSave, adjustment, warehouses, products }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { warehouse_id: "", reason: "", status: "pending", items: [{ product_id: "", quantity_change: "" }] },
  });
  const { fields, append, remove: removeItem } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    reset(adjustment ? {
      warehouse_id: adjustment.warehouse_id || "",
      reason: adjustment.reason || "",
      status: adjustment.status || "pending",
      items: adjustment.stock_adjustment_items?.length ? adjustment.stock_adjustment_items.map(it => ({ product_id: it.product_id, quantity_change: it.quantity_change?.toString() })) : [{ product_id: "", quantity_change: "" }],
    } : undefined);
  }, [adjustment, reset]);

  const submit = async (vals) => {
    await onSave({ ...vals, items: vals.items.map(it => ({ ...it, quantity_change: Number(it.quantity_change) })) });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{adjustment?.id ? "Edit Stock Adjustment" : "New Stock Adjustment"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>
          {errors.warehouse_id && <p className="text-red-500 text-sm">{errors.warehouse_id.message}</p>}
          <Input placeholder="Reason (e.g. damaged goods, stock count correction)" {...register("reason")} />
          <p className="text-xs text-slate-400">Setting status to "approved" posts the quantity change to stock. Use negative numbers for losses.</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">Items</p>
              <Button type="button" size="sm" variant="outline" onClick={() => append({ product_id: "", quantity_change: "" })}>
                <Plus className="w-4 h-4 mr-1" />Add Item
              </Button>
            </div>
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-[1fr_120px_auto] gap-2 items-start">
                <Controller name={`items.${idx}.product_id`} control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
                    <SelectContent className="bg-white">
                      {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                <Input placeholder="+/- qty" {...register(`items.${idx}.quantity_change`)} />
                <Button type="button" size="sm" variant="destructive" onClick={() => removeItem(idx)} disabled={fields.length === 1}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {errors.items && <p className="text-red-500 text-sm">{errors.items.message || errors.items.root?.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{adjustment?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
