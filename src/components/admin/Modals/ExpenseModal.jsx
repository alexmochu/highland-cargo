"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const schema = z.object({
  category_id: z.string().uuid().nullable().optional(),
  warehouse_id: z.string().uuid().nullable().optional(),
  description: z.string().min(2, "Description required"),
  amount: z.string().min(1, "Amount required"),
  expense_date: z.string().min(1, "Date required"),
});

export default function ExpenseModal({ isOpen, onClose, onSave, expense, categories, warehouses, onAddCategory }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { category_id: null, warehouse_id: null, description: "", amount: "", expense_date: new Date().toISOString().slice(0, 10) },
  });
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    reset(expense ? {
      category_id: expense.category_id || null,
      warehouse_id: expense.warehouse_id || null,
      description: expense.description || "",
      amount: expense.amount?.toString() || "",
      expense_date: expense.expense_date || new Date().toISOString().slice(0, 10),
    } : undefined);
  }, [expense, reset]);

  const submit = async (vals) => {
    await onSave({ ...vals, amount: Number(vals.amount) });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{expense?.id ? "Edit Expense" : "Record Expense"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Description" {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Amount" {...register("amount")} />
            <Input type="date" {...register("expense_date")} />
          </div>
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

          <div className="flex gap-2 items-start">
            <Controller name="category_id" control={control} render={({ field }) => (
              <Select onValueChange={(v) => field.onChange(v === "none" ? null : v)} value={field.value || "none"}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>
          <div className="flex gap-2">
            <Input placeholder="New category name" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
            <Button type="button" size="sm" variant="outline" onClick={() => { if (newCategory) { onAddCategory(newCategory); setNewCategory(""); } }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Controller name="warehouse_id" control={control} render={({ field }) => (
            <Select onValueChange={(v) => field.onChange(v === "none" ? null : v)} value={field.value || "none"}>
              <SelectTrigger><SelectValue placeholder="Warehouse (optional)" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="none">None</SelectItem>
                {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{expense?.id ? "Save" : "Record"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
