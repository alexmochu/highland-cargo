"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import usePayments from "@/hooks/admin/usePayments";
import PaymentModal from "@/components/admin/Modals/PaymentModal";
import Pagination from "@/components/ui/pagination";

const STATUS_COLORS = {
  pending: "bg-slate-100 text-slate-600",
  success: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

export default function PaymentsTab() {
  const { payments, invoices, total, page, setPage, pageSize, loading, record } = usePayments({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Payments</CardTitle>
          <Button className="bg-slate-800 text-white" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />Record Payment
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Invoice</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {!loading && payments.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.invoices?.invoice_number || "-"}</td>
                  <td>{p.currency} {Number(p.amount).toLocaleString()}</td>
                  <td className="capitalize">{p.method.replace("_", " ")}</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                  <td>{p.paid_at ? new Date(p.paid_at).toLocaleString() : "-"}</td>
                </tr>
              ))}
              {loading && <tr><td colSpan={5}>Loading…</td></tr>}
            </tbody>
          </table>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <PaymentModal isOpen={open} onClose={() => setOpen(false)} onSave={record} invoices={invoices} />
      )}
    </>
  );
}
