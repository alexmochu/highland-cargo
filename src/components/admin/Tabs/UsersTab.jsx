"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useUsers from "@/hooks/admin/useUsersPaginated";
import UserModal from "@/components/admin/Modals/UserModal";
import Pagination from "@/components/ui/pagination";

export default function UsersTab() {
  const { users, partners, suppliers, roles, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useUsers({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Users & Roles</CardTitle>
          <Button className="bg-ink text-paper" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Invite User</Button>
        </CardHeader>

        <CardContent>
          <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
            <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Partner</th><th>Supplier</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && users.map(u => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.full_name || "-"}</td>
                  <td className="capitalize">{u.role || "-"}</td>
                  <td>{u.partners?.name || "-"}</td>
                  <td>{u.suppliers?.name || "-"}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleString() : "-"}</td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(u); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(u.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={7}>Loading…</td></tr>}
            </tbody>
          </table></div>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="rounded shadow max-w-md w-full">
            <UserModal
              isOpen={open}
              onClose={() => { setOpen(false); setEditing(null); }}
              onSave={(vals) => addOrUpdate(vals)}
              user={editing}
              partners={partners}
              suppliers={suppliers}
              roles={roles}
            />
          </div>
      </div>)}
    </>
  );
}

