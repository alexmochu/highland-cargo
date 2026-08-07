"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useShipments from "@/hooks/admin/useShipmentsPaginated";
import ShipmentModal from "@/components/admin/Modals/ShipmentModal";
import Pagination from "@/components/ui/pagination";

export default function ShipmentsTab() {
  const { shipments, partners, suppliers, products, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useShipments({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Shipments</CardTitle>
          <Button className="bg-blue-600 text-white" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Shipment</Button>
        </CardHeader>

        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>ID</th><th>Product</th><th>Partner</th><th>Supplier</th><th>Source</th><th>Dest</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && shipments.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="font-mono text-xs">{s.id?.slice(0,8)}</td>
                  <td>{s.products?.name || "-"}</td>
                  <td>{s.partners?.name || "-"}</td>
                  <td>{s.suppliers?.name || "-"}</td>
                  <td>{s.source_location || "-"}</td>
                  <td>{s.destination_location || "-"}</td>
                  <td>{s.status}</td>
                  <td>{s.updated_at ? new Date(s.updated_at).toLocaleString() : "-"}</td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={9}>Loading…</td></tr>}
            </tbody>
          </table>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>
      
      {open && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="rounded shadow max-w-md w-full">
            <ShipmentModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={(vals) => addOrUpdate(vals)} shipment={editing} partners={partners} suppliers={suppliers} products={products} />
          </div>
      </div>)}    
    </>
  );
}

