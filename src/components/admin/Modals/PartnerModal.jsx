// components/Modals/PartnerModal.jsx
"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  country: z.string().optional(),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
});

export default function PartnerModal({ isOpen, onClose, onSave, partner }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", country: "", contact_email: "", phone: "" }
  });

  useEffect(() => {
    if (partner) reset({
      name: partner.name || "",
      country: partner.country || "",
      contact_email: partner.contact_email || "",
      phone: partner.phone || "",
    });
    else reset({ name: "", country: "", contact_email: "", phone: "" });
  }, [partner, reset]);

  if (!isOpen) return null;

  const submit = async (vals) => {
    await onSave(vals);
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit(submit)} className="space-y-4 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold">{partner ? "Edit Partner" : "Add Partner"}</h3>
        <input {...register("name")} placeholder="Partner name" className="input" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        <input {...register("country")} placeholder="Country" className="input" />
        <input {...register("contact_email")} placeholder="Contact email" className="input" />
        {errors.contact_email && <p className="text-red-500 text-sm">{errors.contact_email.message}</p>}
        <input {...register("phone")} placeholder="Phone" className="input" />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{partner ? "Save" : "Create"}</Button>
        </div>
      </form>
    </div>
  );
}
