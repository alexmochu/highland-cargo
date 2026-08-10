"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useStockAdjustments from "@/hooks/admin/useStockAdjustments";
import StockAdjustmentModal from "@/components/admin/Modals/StockAdjustmentModal";
import Pagination from "@/components/ui/pagination";

const STATUS_COLORS = {
  pending: "bg-paper-dim text-text-2",
  approved: "bg-emerald-100 text-emerald-700",
};

export default function StockAdjustmentsTab() {
  const { adjustments, warehouses, products, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useStockAdjustments({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Stock Adjustments</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />New Adjustment
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Adjustment #</th><th>Warehouse</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && adjustments.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="py-2">{a.adjustment_number}</td>
                  <td>{a.warehouses?.name || "-"}</td>
                  <td>{a.reason || "-"}</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[a.status]}`}>{a.status}</span></td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(a.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={5}>Loading…</td></tr>}
            </tbody>
          </table>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <StockAdjustmentModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate} adjustment={editing} warehouses={warehouses} products={products} />
      )}
    </>
  );
}
