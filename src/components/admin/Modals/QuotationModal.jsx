"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  customer_id: z.string().uuid("Customer is required"),
  origin_warehouse_id: z.string().uuid().nullable().optional(),
  destination: z.string().optional(),
  cargo_description: z.string().optional(),
  weight_kg: z.string().optional(),
  volume_cbm: z.string().optional(),
  mode: z.enum(["air", "sea"]),
  status: z.enum(["pending", "quoted", "accepted", "rejected", "expired"]),
  quoted_amount: z.string().optional(),
});

export default function QuotationModal({ isOpen, onClose, onSave, quotation, customers, warehouses }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { customer_id: "", origin_warehouse_id: null, destination: "", cargo_description: "", weight_kg: "", volume_cbm: "", mode: "air", status: "pending", quoted_amount: "" },
  });

  useEffect(() => {
    reset(quotation ? {
      customer_id: quotation.customer_id || "",
      origin_warehouse_id: quotation.origin_warehouse_id || null,
      destination: quotation.destination || "",
      cargo_description: quotation.cargo_description || "",
      weight_kg: quotation.weight_kg?.toString() || "",
      volume_cbm: quotation.volume_cbm?.toString() || "",
      mode: quotation.mode || "air",
      status: quotation.status || "pending",
      quoted_amount: quotation.quoted_amount?.toString() || "",
    } : undefined);
  }, [quotation, reset]);

  const submit = async (vals) => {
    await onSave({
      ...vals,
      weight_kg: vals.weight_kg ? Number(vals.weight_kg) : null,
      volume_cbm: vals.volume_cbm ? Number(vals.volume_cbm) : null,
      quoted_amount: vals.quoted_amount ? Number(vals.quoted_amount) : null,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{quotation?.id ? "Edit Quotation" : "New Quotation"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Controller name="customer_id" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Customer" /></SelectTrigger>
              <SelectContent className="bg-white">
                {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
          {errors.customer_id && <p className="text-red-500 text-sm">{errors.customer_id.message}</p>}

          <Controller name="origin_warehouse_id" control={control} render={({ field }) => (
            <Select onValueChange={(v) => field.onChange(v === "none" ? null : v)} value={field.value || "none"}>
              <SelectTrigger><SelectValue placeholder="Origin warehouse (optional)" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="none">None</SelectItem>
                {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />

          <Input placeholder="Destination" {...register("destination")} />
          <Input placeholder="Cargo description" {...register("cargo_description")} />

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Weight (kg)" {...register("weight_kg")} />
            <Input placeholder="Volume (cbm)" {...register("volume_cbm")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Controller name="mode" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Mode" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="air">Air Freight</SelectItem>
                  <SelectItem value="sea">Sea Freight</SelectItem>
                </SelectContent>
              </Select>
            )} />
            <Controller name="status" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {["pending", "quoted", "accepted", "rejected", "expired"].map(s => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
          </div>

          <Input placeholder="Quoted amount (KES)" {...register("quoted_amount")} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{quotation?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
