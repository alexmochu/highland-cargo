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
  type: z.enum(["customs_broker", "freight_agent", "trucking_partner", "other"]),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  country: z.string().optional(),
});

export default function AgentModal({ isOpen, onClose, onSave, agent }) {
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "customs_broker", contact_email: "", phone: "", country: "" },
  });

  useEffect(() => {
    reset(agent ? {
      name: agent.name || "",
      type: agent.type || "customs_broker",
      contact_email: agent.contact_email || "",
      phone: agent.phone || "",
      country: agent.country || "",
    } : undefined);
  }, [agent, reset]);

  const submit = async (vals) => {
    await onSave(vals);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{agent?.id ? "Edit Agent" : "Add Agent"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input placeholder="Agent / company name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Controller name="type" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="customs_broker">Customs Broker</SelectItem>
                <SelectItem value="freight_agent">Freight Agent</SelectItem>
                <SelectItem value="trucking_partner">Trucking Partner</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )} />

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Email" {...register("contact_email")} />
            <Input placeholder="Phone" {...register("phone")} />
          </div>
          {errors.contact_email && <p className="text-red-500 text-sm">{errors.contact_email.message}</p>}

          <Input placeholder="Country" {...register("country")} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{agent?.id ? "Save" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
