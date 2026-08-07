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
  order_id: z.string().uuid().nullable().optional(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
  amount: z.string().min(1, "Amount required"),
  due_date: z.string().optional(),
});

export default function InvoiceModal({ isOpen, onClose, onSave, invoice, customers, orders }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { customer_id: "", order_id: null, status: "draft", amount: "", due_date: "" },
  });

  useEffect(() => {
    reset(invoice ? {
      customer_id: invoice.customer_id || "",
      order_id: invoice.order_id || null,
      status: invoice.status || "draft",
      amount: invoice.amount?.toString() || "",
      due_date: invoice.due_date || "",
    } : undefined);
  }, [invoice, reset]);

  const submit = async (vals) => {
    await onSave({ ...vals, amount: Number(vals.amount) });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{invoice?.id ? "Edit Invoice" : "New Invoice"}</DialogTitle></DialogHeader>
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

          <Controller name="order_id" control={control} render={({ field }) => (
            <Select onValueChange={(v) => field.onChange(v === "none" ? null : v)} value={field.value || "none"}>
              <SelectTrigger><SelectValue placeholder="Linked order (optional)" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="none">None</SelectItem>
                {orders.map(o => <SelectItem key={o.id} value={o.id}>{o.order_number}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />

          <Input placeholder="Amount" {...register("amount")} />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

          <Input type="date" {...register("due_date")} />

          <Controller name="status" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent className="bg-white">
                {["draft", "sent", "paid", "overdue", "cancelled"].map(s => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{invoice?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
