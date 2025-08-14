"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import usePartners from "@/hooks/usePartners";
import PartnerModal from "@/components/Modals/PartnerModal";
import Pagination from "@/components/Pagination";

export default function PartnersTab() {
  const { partners, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = usePartners({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Partners</CardTitle>
          <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2"/>Add Partner</Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left"><th>Name</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {!loading && partners.map(p => (
                <tr key={p.id} className="border-t">
                  <td>{p.name}</td>
                  <td>{p.created_at ? new Date(p.created_at).toLocaleString() : "-"}</td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={3}>Loading…</td></tr>}
            </tbody>
          </table>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      <PartnerModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={(vals) => addOrUpdate(vals)} partner={editing} />
    </>
  );
}
