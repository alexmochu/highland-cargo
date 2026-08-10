"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PERMISSION_MODULES } from "@/lib/permissions";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  description: z.string().optional(),
});

export default function RoleModal({ isOpen, onClose, onSave, role }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    reset({ name: role?.name || "", description: role?.description || "" });
    setPermissions(role?.permissions || {});
  }, [role, reset]);

  const toggle = (moduleId, action) => {
    setPermissions(prev => {
      const current = prev[moduleId] || [];
      const next = current.includes(action) ? current.filter(a => a !== action) : [...current, action];
      const copy = { ...prev };
      if (next.length) copy[moduleId] = next; else delete copy[moduleId];
      return copy;
    });
  };

  const submit = async (vals) => {
    await onSave({ ...vals, permissions });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{role?.id ? "Edit Role" : "Create Role"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Role name (e.g. Warehouse Supervisor)" {...register("name")} disabled={role?.is_system} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Input placeholder="Description" {...register("description")} />

          <div className="space-y-3">
            <p className="text-sm font-semibold text-text-2">Permissions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERMISSION_MODULES.map(mod => (
                <div key={mod.id} className="border border-line rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium">{mod.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {mod.actions.map(action => {
                      const active = permissions[mod.id]?.includes(action);
                      return (
                        <button
                          type="button"
                          key={action}
                          onClick={() => toggle(mod.id, action)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            active ? "bg-ink text-paper border-ink" : "bg-white text-text-3 border-line hover:border-line-strong"
                          }`}
                        >
                          {action}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{role?.id ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
