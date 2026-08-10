"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Lock } from "lucide-react";
import useRoles from "@/hooks/admin/useRoles";
import RoleModal from "@/components/admin/Modals/RoleModal";

export default function RolesTab() {
  const { roles, loading, editing, setEditing, addOrUpdate, remove } = useRoles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Roles & Permissions</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />Create Role
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
            <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && roles.map(r => (
                <tr key={r.id}>
                  <td className="py-2 flex items-center gap-2 capitalize">{r.name} {r.is_system && <Lock className="w-3 h-3 text-text-3" />}</td>
                  <td>{r.description || "-"}</td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    {!r.is_system && (
                      <Button size="sm" variant="destructive" onClick={() => remove(r)}><Trash2 className="w-4 h-4" /></Button>
                    )}
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={3}>Loading…</td></tr>}
            </tbody>
          </table></div>
        </CardContent>
      </Card>

      {open && (
        <RoleModal
          isOpen={open}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={addOrUpdate}
          role={editing}
        />
      )}
    </>
  );
}
