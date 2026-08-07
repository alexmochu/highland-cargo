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
  order_id: z.string().uuid("Order is required"),
  delivered_to: z.string().min(2, "Required"),
  delivered_at: z.string().optional(),
  notes: z.string().optional(),
});

export default function DeliveryNoteModal({ isOpen, onClose, onSave, note, orders }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { order_id: "", delivered_to: "", delivered_at: "", notes: "" },
  });

  useEffect(() => {
    reset(note ? {
      order_id: note.order_id || "",
      delivered_to: note.delivered_to || "",
      delivered_at: note.delivered_at ? note.delivered_at.slice(0, 16) : "",
      notes: note.notes || "",
    } : undefined);
  }, [note, reset]);

  const submit = async (vals) => {
    await onSave({ ...vals, delivered_at: vals.delivered_at ? new Date(vals.delivered_at).toISOString() : null });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{note?.id ? "Edit Delivery Note" : "New Delivery Note"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Controller name="order_id" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Order" /></SelectTrigger>
              <SelectContent className="bg-white">
                {orders.map(o => <SelectItem key={o.id} value={o.id}>{o.order_number}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
          {errors.order_id && <p className="text-red-500 text-sm">{errors.order_id.message}</p>}

          <Input placeholder="Delivered to (name)" {...register("delivered_to")} />
          {errors.delivered_to && <p className="text-red-500 text-sm">{errors.delivered_to.message}</p>}

          <Input type="datetime-local" {...register("delivered_at")} />
          <Input placeholder="Notes (optional)" {...register("notes")} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{note?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
