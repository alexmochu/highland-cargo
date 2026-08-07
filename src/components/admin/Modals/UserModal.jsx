"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// profiles.role CHECK -- widened in 0002_roles_permissions.sql to admit the
// operational roles alongside admin/supplier/partner.
const schema = z.object({
  email: z.string().email("Valid email required"),
  full_name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["admin", "manager", "accountant", "warehouse_staff", "sales_agent", "cashier", "supplier", "partner"]),
  partner_id: z.string().uuid().nullable().optional(),
  supplier_id: z.string().uuid().nullable().optional(),
});

export default function UserModal({ isOpen, onClose, onSave, user, partners, suppliers, roles = [] }) {
  const { control, register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", full_name: "", role: "partner", partner_id: null, supplier_id: null },
  });

  const role = watch("role");

  useEffect(() => {
    reset(user ? {
      email: user.email || "",
      full_name: user.full_name || "",
      role: user.role || "partner",
      partner_id: user.partner_id || null,
      supplier_id: user.supplier_id || null,
    } : undefined);
  }, [user, reset]);

  const submit = async (vals) => {
    // If user.id exists -> update profile
    // If not -> invite via server route (creates auth user + profile), then close
    if (user?.id) {
      await onSave(vals);
    } else {
      await fetch("/api/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vals),
      }).then(async r => {
        if (!r.ok) throw new Error(await r.text());
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{user?.id ? "Edit User" : "Invite User"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <Input placeholder="Full name (optional)" {...register("full_name")} />
          {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {(roles.length ? roles.map(r => r.name) : ["admin", "manager", "accountant", "warehouse_staff", "sales_agent", "cashier", "partner", "supplier"]).map(name => (
                    <SelectItem key={name} value={name} className="capitalize">{name.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

          {role === "partner" && (
            <Controller
              name="partner_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(v)=>field.onChange(v === "none" ? null : v)} value={field.value || "none"}>
                  <SelectTrigger><SelectValue placeholder="Assign Partner (optional)" /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="none">None</SelectItem>
                    {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          )}

          {role === "supplier" && (
            <Controller
              name="supplier_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(v)=>field.onChange(v === "none" ? null : v)} value={field.value || "none"}>
                  <SelectTrigger><SelectValue placeholder="Assign Supplier (optional)" /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="none">None</SelectItem>
                    {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{user?.id ? "Save" : "Invite"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

