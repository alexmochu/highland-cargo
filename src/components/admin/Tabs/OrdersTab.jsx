"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useOrders from "@/hooks/admin/useOrders";
import OrderModal from "@/components/admin/Modals/OrderModal";
import Pagination from "@/components/ui/pagination";

const STATUS_COLORS = {
  pending: "bg-paper-dim text-text-2",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersTab() {
  const { orders, customers, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useOrders({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Orders</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />New Order
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
              <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {!loading && orders.map(o => (
                  <tr key={o.id}>
                    <td className="py-2">{o.order_number}</td>
                    <td>{o.customers?.name || "-"}</td>
                    <td>{o.order_items?.length || 0}</td>
                    <td>{o.currency} {Number(o.total || 0).toLocaleString()}</td>
                    <td><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                    <td className="flex gap-2 py-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(o); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(o.id)}><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
                {loading && <tr><td colSpan={6}>Loading…</td></tr>}
              </tbody>
            </table></div>
          </div>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <OrderModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate} order={editing} customers={customers} />
      )}
    </>
  );
}
