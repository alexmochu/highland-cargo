"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useTeam } from "@/hooks/supplier/useSupplierData";
import * as svc from "@/services/supplierService";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({ user_email: z.string().email() });

export default function TeamTab({ supplierId }) {
  const { team, reload, loading } = useTeam(supplierId);
  const [adding, setAdding] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onAdd = async ({ user_email }) => {
    try {
      // find user by email (profiles table)
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data: found } = await supabase.from("profiles").select("*").eq("email", user_email).limit(1).single();
      if (!found) {
        toast.error("User not found. Invite users from admin panel first.");
        return;
      }
      await svc.addSupplierTeamMember(supplierId, found.user_id);
      toast.success("Team member added");
      setAdding(false);
      reset();
      reload();
    } catch (e) {
      toast.error("Failed to add member");
    }
  };

  const onRemove = async (id) => {
    if (!confirm("Remove member?")) return;
    try {
      await svc.removeSupplierTeamMember(id);
      toast.success("Removed");
      reload();
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          {/* <Button onClick={() => setAdding(true)}><Plus className="w-4 h-4 mr-2"/>Add Member</Button> */}
        </CardHeader>
        <CardContent>
          <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
            <thead><tr><th>Email</th><th>Can manage products</th><th>Can manage team</th>
            {/* <th>Actions</th> */}
            </tr></thead>
            <tbody>
              {!loading && team.map(m => (
                <tr key={m.id}>
                  <td>{m.profiles?.email || "-"}</td>
                  <td>{m.can_manage_products ? "Yes" : "No"}</td>
                  <td>{m.can_manage_team ? "Yes" : "No"}</td>
                  {/* <td className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => onRemove(m.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td> */}
                </tr>
              ))}
              {loading && <tr><td colSpan={4}>Loading…</td></tr>}
            </tbody>
          </table></div>
        </CardContent>
      </Card>

      {adding && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3">Add Team Member</h3>
            <form onSubmit={handleSubmit(onAdd)} className="space-y-3">
              <input className="input w-full" placeholder="Member email (must exist in profiles)" {...register("user_email")} />
              {errors.user_email && <div className="text-red-500 text-sm">{errors.user_email.message}</div>}
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setAdding(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
