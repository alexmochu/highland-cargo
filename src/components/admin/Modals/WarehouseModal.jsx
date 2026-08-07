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
  name: z.string().min(2, "Name required"),
  country: z.string().min(2, "Country required"),
  city: z.string().optional(),
  type: z.enum(["overseas", "local"]),
  address: z.string().optional(),
  contact: z.string().optional(),
  is_active: z.boolean().optional(),
});

export default function WarehouseModal({ isOpen, onClose, onSave, warehouse }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", country: "", city: "", type: "overseas", address: "", contact: "", is_active: true },
  });

  useEffect(() => {
    reset(warehouse ? {
      name: warehouse.name || "",
      country: warehouse.country || "",
      city: warehouse.city || "",
      type: warehouse.type || "overseas",
      address: warehouse.address || "",
      contact: warehouse.contact || "",
      is_active: warehouse.is_active ?? true,
    } : undefined);
  }, [warehouse, reset]);

  const submit = async (vals) => {
    await onSave(vals);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{warehouse?.id ? "Edit Warehouse" : "Add Warehouse"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Warehouse name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Country" {...register("country")} />
            <Input placeholder="City (optional)" {...register("city")} />
          </div>
          {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="overseas">Overseas sourcing hub</SelectItem>
                  <SelectItem value="local">Local warehouse</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Input placeholder="Address (optional)" {...register("address")} />
          <Input placeholder="Contact (optional)" {...register("contact")} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{warehouse?.id ? "Save" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
