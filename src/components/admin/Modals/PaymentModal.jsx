"use client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  invoice_id: z.string().uuid("Invoice is required"),
  amount: z.string().min(1, "Amount required"),
  method: z.enum(["cash", "bank_transfer"]),
});

// Records a manual (cash/bank) payment. Card payments run through
// /api/payments/initiate + the Paystack webhook instead, so aren't editable here.
export default function PaymentModal({ isOpen, onClose, onSave, invoices }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { invoice_id: "", amount: "", method: "cash" },
  });

  const submit = async (vals) => {
    await onSave({ ...vals, amount: Number(vals.amount) });
    reset({ invoice_id: "", amount: "", method: "cash" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Controller name="invoice_id" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Invoice" /></SelectTrigger>
              <SelectContent className="bg-white">
                {invoices.map(inv => (
                  <SelectItem key={inv.id} value={inv.id}>
                    {inv.invoice_number} ({inv.currency} {Number(inv.amount - (inv.amount_paid || 0)).toLocaleString()} due)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />
          {errors.invoice_id && <p className="text-red-500 text-sm">{errors.invoice_id.message}</p>}

          <Input placeholder="Amount received" {...register("amount")} />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

          <Controller name="method" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Method" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          )} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Record Payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
