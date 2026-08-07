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
  full_name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  department_id: z.string().uuid().nullable().optional(),
  designation_id: z.string().uuid().nullable().optional(),
  employment_type: z.enum(["full_time", "part_time", "contract"]),
  salary: z.string().optional(),
  hire_date: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export default function EmployeeModal({ isOpen, onClose, onSave, employee, departments, designations }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", phone: "", department_id: null, designation_id: null, employment_type: "full_time", salary: "", hire_date: "", status: "active" },
  });

  useEffect(() => {
    reset(employee ? {
      full_name: employee.full_name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department_id: employee.department_id || null,
      designation_id: employee.designation_id || null,
      employment_type: employee.employment_type || "full_time",
      salary: employee.salary?.toString() || "",
      hire_date: employee.hire_date || "",
      status: employee.status || "active",
    } : undefined);
  }, [employee, reset]);

  const submit = async (vals) => {
    await onSave({ ...vals, salary: vals.salary ? Number(vals.salary) : null });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{employee?.id ? "Edit Employee" : "Add Employee"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Full name" {...register("full_name")} />
          {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Email" {...register("email")} />
            <Input placeholder="Phone" {...register("phone")} />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <div className="grid grid-cols-2 gap-3">
            <Controller name="department_id" control={control} render={({ field }) => (
              <Select onValueChange={(v) => field.onChange(v === "none" ? null : v)} value={field.value || "none"}>
                <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="none">None</SelectItem>
                  {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
            <Controller name="designation_id" control={control} render={({ field }) => (
              <Select onValueChange={(v) => field.onChange(v === "none" ? null : v)} value={field.value || "none"}>
                <SelectTrigger><SelectValue placeholder="Designation" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="none">None</SelectItem>
                  {designations.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Controller name="employment_type" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Employment type" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="full_time">Full time</SelectItem>
                  <SelectItem value="part_time">Part time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            )} />
            <Controller name="status" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Monthly salary" {...register("salary")} />
            <Input type="date" {...register("hire_date")} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{employee?.id ? "Save" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
