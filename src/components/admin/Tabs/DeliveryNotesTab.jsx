"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useDeliveryNotes from "@/hooks/admin/useDeliveryNotes";
import DeliveryNoteModal from "@/components/admin/Modals/DeliveryNoteModal";
import Pagination from "@/components/ui/pagination";

export default function DeliveryNotesTab() {
  const { notes, orders, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useDeliveryNotes({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Delivery Notes</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />New Delivery Note
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Order</th><th>Delivered To</th><th>Delivered At</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && notes.map(n => (
                <tr key={n.id} className="border-t">
                  <td className="py-2">{n.orders?.order_number || "-"}</td>
                  <td>{n.delivered_to || "-"}</td>
                  <td>{n.delivered_at ? new Date(n.delivered_at).toLocaleString() : "-"}</td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(n); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(n.id)}><Trash2 className="w-4 h-4" /></Button>
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
        <DeliveryNoteModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate} note={editing} orders={orders} />
      )}
    </>
  );
}
