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
  from_warehouse_id: z.string().uuid("Required"),
  to_warehouse_id: z.string().uuid("Required"),
  status: z.enum(["pending", "in_transit", "completed", "cancelled"]),
  items: z.array(z.object({
    product_id: z.string().uuid("Product required"),
    quantity: z.string().min(1),
  })).min(1, "Add at least one item"),
}).refine(d => d.from_warehouse_id !== d.to_warehouse_id, { message: "Source and destination must differ", path: ["to_warehouse_id"] });

export default function StockTransferModal({ isOpen, onClose, onSave, transfer, warehouses, products }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { from_warehouse_id: "", to_warehouse_id: "", status: "pending", items: [{ product_id: "", quantity: "1" }] },
  });
  const { fields, append, remove: removeItem } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    reset(transfer ? {
      from_warehouse_id: transfer.from_warehouse_id || "",
      to_warehouse_id: transfer.to_warehouse_id || "",
      status: transfer.status || "pending",
      items: transfer.stock_transfer_items?.length ? transfer.stock_transfer_items.map(it => ({ product_id: it.product_id, quantity: it.quantity?.toString() })) : [{ product_id: "", quantity: "1" }],
    } : undefined);
  }, [transfer, reset]);

  const submit = async (vals) => {
    await onSave({ ...vals, items: vals.items.map(it => ({ ...it, quantity: Number(it.quantity) })) });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{transfer?.id ? "Edit Stock Transfer" : "New Stock Transfer"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Controller name="from_warehouse_id" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="From warehouse" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
            <Controller name="to_warehouse_id" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="To warehouse" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
            <Controller name="status" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {["pending", "in_transit", "completed", "cancelled"].map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
          {errors.to_warehouse_id && <p className="text-red-500 text-sm">{errors.to_warehouse_id.message}</p>}
          <p className="text-xs text-text-3">Setting status to "completed" posts stock-out at source and stock-in at destination.</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-2">Items</p>
              <Button type="button" size="sm" variant="outline" onClick={() => append({ product_id: "", quantity: "1" })}>
                <Plus className="w-4 h-4 mr-1" />Add Item
              </Button>
            </div>
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-[1fr_100px_auto] gap-2 items-start">
                <Controller name={`items.${idx}.product_id`} control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
                    <SelectContent className="bg-white">
                      {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                <Input placeholder="Qty" {...register(`items.${idx}.quantity`)} />
                <Button type="button" size="sm" variant="destructive" onClick={() => removeItem(idx)} disabled={fields.length === 1}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {errors.items && <p className="text-red-500 text-sm">{errors.items.message || errors.items.root?.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{transfer?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
