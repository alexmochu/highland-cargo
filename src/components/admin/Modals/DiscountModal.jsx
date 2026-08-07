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
  code: z.string().min(2, "Code required"),
  type: z.enum(["percentage", "fixed"]),
  value: z.string().min(1, "Value required"),
  is_active: z.boolean().optional(),
});

export default function DiscountModal({ isOpen, onClose, onSave, discount }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { code: "", type: "percentage", value: "", is_active: true },
  });

  useEffect(() => {
    reset(discount ? {
      code: discount.code || "",
      type: discount.type || "percentage",
      value: discount.value?.toString() || "",
      is_active: discount.is_active ?? true,
    } : undefined);
  }, [discount, reset]);

  const submit = async (vals) => {
    await onSave({ ...vals, value: Number(vals.value) });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{discount?.id ? "Edit Discount" : "New Discount"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Code (e.g. WELCOME10)" {...register("code")} />
          {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}

          <div className="grid grid-cols-2 gap-3">
            <Controller name="type" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed amount</SelectItem>
                </SelectContent>
              </Select>
            )} />
            <Input placeholder="Value" {...register("value")} />
          </div>
          {errors.value && <p className="text-red-500 text-sm">{errors.value.message}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{discount?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
