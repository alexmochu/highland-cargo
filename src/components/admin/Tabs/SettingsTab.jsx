"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import useSettings from "@/hooks/admin/useSettings";

export default function SettingsTab() {
  const { business, invoice, taxRates, loading, saveBusiness, saveInvoice, addTaxRate, removeTaxRate } = useSettings();
  const [businessForm, setBusinessForm] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState(null);
  const [newTax, setNewTax] = useState({ name: "", rate_percent: "" });

  useEffect(() => { if (business) setBusinessForm(business); }, [business]);
  useEffect(() => { if (invoice) setInvoiceForm(invoice); }, [invoice]);

  if (loading || !businessForm || !invoiceForm) return <div className="text-center py-12 text-text-3">Loading settings…</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Business Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Company name" value={businessForm.company_name || ""} onChange={e => setBusinessForm({ ...businessForm, company_name: e.target.value })} />
          <Input placeholder="Address" value={businessForm.address || ""} onChange={e => setBusinessForm({ ...businessForm, address: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Phone" value={businessForm.phone || ""} onChange={e => setBusinessForm({ ...businessForm, phone: e.target.value })} />
            <Input placeholder="Email" value={businessForm.email || ""} onChange={e => setBusinessForm({ ...businessForm, email: e.target.value })} />
          </div>
          <Input placeholder="Currency (e.g. KES)" value={businessForm.currency || ""} onChange={e => setBusinessForm({ ...businessForm, currency: e.target.value })} />
          <Button className="bg-ink text-white" onClick={() => saveBusiness(businessForm)}>Save Business Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Invoice Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Invoice prefix" value={invoiceForm.invoice_prefix || ""} onChange={e => setInvoiceForm({ ...invoiceForm, invoice_prefix: e.target.value })} />
            <Input placeholder="Default due days" value={invoiceForm.due_days_default ?? ""} onChange={e => setInvoiceForm({ ...invoiceForm, due_days_default: Number(e.target.value) || 0 })} />
          </div>
          <Input placeholder="Footer note (printed on invoices/receipts)" value={invoiceForm.footer_note || ""} onChange={e => setInvoiceForm({ ...invoiceForm, footer_note: e.target.value })} />
          <Button className="bg-ink text-white" onClick={() => saveInvoice(invoiceForm)}>Save Invoice Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tax Rates</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Name</th><th>Rate</th><th>Actions</th></tr></thead>
            <tbody>
              {taxRates.map(t => (
                <tr key={t.id} className="border-t">
                  <td className="py-2">{t.name}</td>
                  <td>{t.rate_percent}%</td>
                  <td><Button size="sm" variant="destructive" onClick={() => removeTaxRate(t.id)}><Trash2 className="w-4 h-4" /></Button></td>
                </tr>
              ))}
              {taxRates.length === 0 && <tr><td colSpan={3} className="text-text-3 py-4">No tax rates configured.</td></tr>}
            </tbody>
          </table>
          <div className="flex gap-2">
            <Input placeholder="Name (e.g. VAT)" value={newTax.name} onChange={e => setNewTax({ ...newTax, name: e.target.value })} />
            <Input placeholder="Rate %" value={newTax.rate_percent} onChange={e => setNewTax({ ...newTax, rate_percent: e.target.value })} />
            <Button
              variant="outline"
              onClick={() => { if (newTax.name && newTax.rate_percent) { addTaxRate({ name: newTax.name, rate_percent: Number(newTax.rate_percent) }); setNewTax({ name: "", rate_percent: "" }); } }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
