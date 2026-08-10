"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import usePurchases from "@/hooks/admin/usePurchases";
import PurchaseModal from "@/components/admin/Modals/PurchaseModal";
import Pagination from "@/components/ui/pagination";

const STATUS_COLORS = {
  pending: "bg-paper-dim text-text-2",
  received: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function PurchasesTab() {
  const { purchases, suppliers, warehouses, products, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = usePurchases({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Purchases</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />New Purchase
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left"><th>PO #</th><th>Supplier</th><th>Warehouse</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {!loading && purchases.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2">{p.purchase_number}</td>
                    <td>{p.suppliers?.name || "-"}</td>
                    <td>{p.warehouses?.name || "-"}</td>
                    <td>{p.currency} {Number(p.total || 0).toLocaleString()}</td>
                    <td><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                    <td className="flex gap-2 py-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
                {loading && <tr><td colSpan={6}>Loading…</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <PurchaseModal
          isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate}
          purchase={editing} suppliers={suppliers} warehouses={warehouses} products={products}
        />
      )}
    </>
  );
}
