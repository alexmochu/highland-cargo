"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useContactGroups from "@/hooks/admin/useContactGroups";
import ContactGroupModal from "@/components/admin/Modals/ContactGroupModal";

export default function ContactGroupsTab() {
  const { groups, loading, editing, setEditing, addOrUpdate, remove } = useContactGroups();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Contact Groups</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />New Group
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && groups.map(g => (
                <tr key={g.id} className="border-t">
                  <td className="py-2">{g.name}</td>
                  <td>{g.description || "-"}</td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(g); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(g.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={3}>Loading…</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {open && (
        <ContactGroupModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate} group={editing} />
      )}
    </>
  );
}
