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
  customer_id: z.string().uuid("Customer is required"),
  status: z.enum(["pending", "confirmed", "processing", "completed", "cancelled"]),
  discount_amount: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, "Required"),
    quantity: z.string().min(1),
    unit_price: z.string().min(1),
  })).min(1, "Add at least one line item"),
});

export default function OrderModal({ isOpen, onClose, onSave, order, customers }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { customer_id: "", status: "pending", discount_amount: "0", items: [{ description: "", quantity: "1", unit_price: "" }] },
  });
  const { fields, append, remove: removeItem } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    reset(order ? {
      customer_id: order.customer_id || "",
      status: order.status || "pending",
      discount_amount: order.discount_amount?.toString() || "0",
      items: order.order_items?.length ? order.order_items.map(it => ({
        description: it.description, quantity: it.quantity?.toString(), unit_price: it.unit_price?.toString(),
      })) : [{ description: "", quantity: "1", unit_price: "" }],
    } : undefined);
  }, [order, reset]);

  const submit = async (vals) => {
    await onSave({
      customer_id: vals.customer_id,
      status: vals.status,
      discount_amount: Number(vals.discount_amount || 0),
      items: vals.items.map(it => ({ ...it, quantity: Number(it.quantity), unit_price: Number(it.unit_price) })),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{order?.id ? "Edit Order" : "New Order"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Controller name="customer_id" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Customer" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
            <Controller name="status" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {["pending", "confirmed", "processing", "completed", "cancelled"].map(s => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
          </div>
          {errors.customer_id && <p className="text-red-500 text-sm">{errors.customer_id.message}</p>}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">Line Items</p>
              <Button type="button" size="sm" variant="outline" onClick={() => append({ description: "", quantity: "1", unit_price: "" })}>
                <Plus className="w-4 h-4 mr-1" />Add Item
              </Button>
            </div>
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-[1fr_80px_100px_auto] gap-2 items-start">
                <Input placeholder="Description" {...register(`items.${idx}.description`)} />
                <Input placeholder="Qty" {...register(`items.${idx}.quantity`)} />
                <Input placeholder="Unit price" {...register(`items.${idx}.unit_price`)} />
                <Button type="button" size="sm" variant="destructive" onClick={() => removeItem(idx)} disabled={fields.length === 1}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {errors.items && <p className="text-red-500 text-sm">{errors.items.message || errors.items.root?.message}</p>}
          </div>

          <Input placeholder="Discount amount" {...register("discount_amount")} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{order?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
