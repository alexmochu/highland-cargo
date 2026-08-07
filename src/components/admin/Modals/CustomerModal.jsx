"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  customer_group: z.string().optional(),
});

export default function CustomerModal({ isOpen, onClose, onSave, customer }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", address: "", customer_group: "" },
  });

  useEffect(() => {
    reset(customer ? {
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      customer_group: customer.customer_group || "",
    } : undefined);
  }, [customer, reset]);

  const submit = async (vals) => {
    await onSave(vals);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{customer?.id ? "Edit Customer" : "Add Customer"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Full name / company" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Email" {...register("email")} />
            <Input placeholder="Phone" {...register("phone")} />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          <Input placeholder="Address" {...register("address")} />
          <Input placeholder="Customer group (optional)" {...register("customer_group")} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{customer?.id ? "Save" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
