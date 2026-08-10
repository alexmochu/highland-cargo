"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import useInvoices from "@/hooks/admin/useInvoices";
import InvoiceModal from "@/components/admin/Modals/InvoiceModal";
import Pagination from "@/components/ui/pagination";

const STATUS_COLORS = {
  draft: "bg-paper-dim text-text-2",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-paper-dim text-text-3",
};

export default function InvoicesTab() {
  const { invoices, customers, orders, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useInvoices({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  const payWithPaystack = async (invoice) => {
    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start payment");

      if (!window.PaystackPop) throw new Error("Paystack is still loading, try again in a moment");
      const paystack = new window.PaystackPop();
      paystack.resumeTransaction(data.accessCode);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />New Invoice
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
              <thead><tr><th>Invoice #</th><th>Customer</th><th>Order</th><th>Amount</th><th>Paid</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {!loading && invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="py-2">{inv.invoice_number}</td>
                    <td>{inv.customers?.name || "-"}</td>
                    <td>{inv.orders?.order_number || "-"}</td>
                    <td>{inv.currency} {Number(inv.amount).toLocaleString()}</td>
                    <td>{inv.currency} {Number(inv.amount_paid || 0).toLocaleString()}</td>
                    <td><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[inv.status]}`}>{inv.status}</span></td>
                    <td className="flex gap-2 py-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(inv); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(inv.id)}><Trash2 className="w-4 h-4" /></Button>
                      {(inv.status === "sent" || inv.status === "overdue") && (
                        <Button size="sm" className="bg-emerald-600 text-white" onClick={() => payWithPaystack(inv)} title="Pay with Paystack">
                          <CreditCard className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {loading && <tr><td colSpan={7}>Loading…</td></tr>}
              </tbody>
            </table></div>
          </div>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <InvoiceModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate} invoice={editing} customers={customers} orders={orders} />
      )}
    </>
  );
}
