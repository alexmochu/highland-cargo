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
  order_id: z.string().uuid("order_id (uuid) required"),
  product_id: z.string().uuid("Select product"),
  partner_id: z.string().uuid("Select partner"),
  supplier_id: z.string().uuid().nullable().optional(),
  source_location: z.enum(["Dubai","China"]).nullable().optional(),
  destination_location: z.string().default("Kenya").optional(),
  tracking_number: z.string().optional(),
  status: z.enum([
    "Pending Payment","Payment Confirmed","Sourcing from Supplier","In Transit to Kenya","At Kenya Warehouse","Out for Delivery","Delivered"
  ]),
});

export default function ShipmentModal({ isOpen, onClose, onSave, shipment, partners, suppliers, products }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      order_id: "", product_id: "", partner_id: "", supplier_id: null,
      source_location: "Dubai", destination_location: "Kenya",
      tracking_number: "", status: "Pending Payment",
    },
  });

  useEffect(() => {
    reset(shipment ? {
      order_id: shipment.order_id, product_id: shipment.product_id, partner_id: shipment.partner_id,
      supplier_id: shipment.supplier_id || null, source_location: shipment.source_location || "Dubai",
      destination_location: shipment.destination_location || "Kenya", tracking_number: shipment.tracking_number || "",
      status: shipment.status || "Pending Payment",
    } : undefined);
  }, [shipment, reset]);

  const submit = async (vals) => { await onSave(vals); onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{shipment ? "Edit Shipment" : "Add Shipment"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Order ID (uuid)" {...register("order_id")} />
          {errors.order_id && <p className="text-red-500 text-sm">{errors.order_id.message}</p>}

          <Controller name="product_id" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
              <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          )}/>
          {errors.product_id && <p className="text-red-500 text-sm">{errors.product_id.message}</p>}

          <Controller name="partner_id" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
              <SelectContent>{partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          )}/>
          {errors.partner_id && <p className="text-red-500 text-sm">{errors.partner_id.message}</p>}

          <Controller name="supplier_id" control={control} render={({ field }) => (
            <Select onValueChange={(v)=>field.onChange(v || null)} value={field.value || ""}>
              <SelectTrigger><SelectValue placeholder="Supplier (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">None</SelectItem>
                {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}/>

          <Controller name="source_location" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || "Dubai"}>
              <SelectTrigger><SelectValue placeholder="Source location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Dubai">Dubai</SelectItem>
                <SelectItem value="China">China</SelectItem>
              </SelectContent>
            </Select>
          )}/>

          <Input placeholder="Destination (default Kenya)" {...register("destination_location")} />

          <Input placeholder="Tracking number (optional)" {...register("tracking_number")} />

          <Controller name="status" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {["Pending Payment","Payment Confirmed","Sourcing from Supplier","In Transit to Kenya","At Kenya Warehouse","Out for Delivery","Delivered"]
                  .map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )}/>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
