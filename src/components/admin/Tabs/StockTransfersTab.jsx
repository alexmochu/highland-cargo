"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useStockTransfers from "@/hooks/admin/useStockTransfers";
import StockTransferModal from "@/components/admin/Modals/StockTransferModal";
import Pagination from "@/components/ui/pagination";

const STATUS_COLORS = {
  pending: "bg-paper-dim text-text-2",
  in_transit: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function StockTransfersTab() {
  const { transfers, warehouses, products, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useStockTransfers({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Stock Transfers</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />New Transfer
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
            <thead><tr><th>Transfer #</th><th>From</th><th>To</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && transfers.map(t => (
                <tr key={t.id}>
                  <td className="py-2">{t.transfer_number}</td>
                  <td>{t.from?.name || "-"}</td>
                  <td>{t.to?.name || "-"}</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[t.status]}`}>{t.status.replace("_", " ")}</span></td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(t); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(t.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={5}>Loading…</td></tr>}
            </tbody>
          </table></div>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <StockTransferModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate} transfer={editing} warehouses={warehouses} products={products} />
      )}
    </>
  );
}
