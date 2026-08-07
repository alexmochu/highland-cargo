"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowRightCircle } from "lucide-react";
import useQuotations from "@/hooks/admin/useQuotations";
import QuotationModal from "@/components/admin/Modals/QuotationModal";
import Pagination from "@/components/ui/pagination";

const STATUS_COLORS = {
  pending: "bg-slate-100 text-slate-600",
  quoted: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-amber-100 text-amber-700",
};

export default function QuotationsTab() {
  const { quotations, customers, warehouses, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove, convertToOrder } = useQuotations({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Quotations</CardTitle>
          <Button className="bg-slate-800 text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />New Quotation
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left"><th>Number</th><th>Customer</th><th>Route</th><th>Mode</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {!loading && quotations.map(q => (
                  <tr key={q.id} className="border-t">
                    <td className="py-2">{q.quotation_number}</td>
                    <td>{q.customers?.name || "-"}</td>
                    <td>{[q.warehouses?.name, q.destination].filter(Boolean).join(" → ") || "-"}</td>
                    <td className="uppercase">{q.mode}</td>
                    <td>{q.quoted_amount ? `${q.currency} ${Number(q.quoted_amount).toLocaleString()}` : "-"}</td>
                    <td><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[q.status]}`}>{q.status}</span></td>
                    <td className="flex gap-2 py-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(q); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(q.id)}><Trash2 className="w-4 h-4" /></Button>
                      {q.status === "quoted" && (
                        <Button size="sm" className="bg-emerald-600 text-white" onClick={() => convertToOrder(q)} title="Convert to order">
                          <ArrowRightCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {loading && <tr><td colSpan={7}>Loading…</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <QuotationModal
          isOpen={open}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={addOrUpdate}
          quotation={editing}
          customers={customers}
          warehouses={warehouses}
        />
      )}
    </>
  );
}
