"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Name required"),
});

export default function SupplierModal({ isOpen, onClose, onSave, supplier }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "" }
  });

  useEffect(() => {
    if (supplier) reset({ name: supplier.name || "" });
    else reset({ name: "" });
  }, [supplier, reset]);

  if (!isOpen) return null;

  const submit = async (vals) => {
    await onSave(vals);
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit(submit)} className="space-y-4 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold">{supplier ? "Edit Supplier" : "Add Supplier"}</h3>
        <input {...register("name")} placeholder="Supplier name" className="input" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{supplier ? "Save" : "Create"}</Button>
        </div>
      </form>
    </div>
  );
}
