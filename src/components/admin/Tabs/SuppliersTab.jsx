"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useSuppliers from "@/hooks/admin/useSuppliers";
import SupplierModal from "@/components/admin/Modals/SupplierModal";
import Pagination from "@/components/admin/Pagination";

export default function SuppliersTab() {
  const { suppliers, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useSuppliers({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Suppliers</CardTitle>
          <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Supplier</Button>
        </CardHeader>

        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Name</th><th>Location</th><th>Contact</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && suppliers.map(s => (
                <tr key={s.id} className="border-t">
                  <td>{s.name}</td>
                  <td>{s.location || "-"}</td>
                  <td>{s.contact_email || "-"}</td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={4}>Loading…</td></tr>}
            </tbody>
          </table>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="rounded shadow max-w-md w-full">
            <SupplierModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={(vals) => addOrUpdate(vals)} supplier={editing} />
          </div>
      </div>)}
    </>
  );
}
