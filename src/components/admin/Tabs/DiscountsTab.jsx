"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useDiscounts from "@/hooks/admin/useDiscounts";
import DiscountModal from "@/components/admin/Modals/DiscountModal";

export default function DiscountsTab() {
  const { discounts, loading, editing, setEditing, addOrUpdate, remove } = useDiscounts({ pageSize: 50 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Discounts</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />New Discount
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Code</th><th>Type</th><th>Value</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && discounts.map(d => (
                <tr key={d.id} className="border-t">
                  <td className="py-2 font-mono">{d.code}</td>
                  <td className="capitalize">{d.type}</td>
                  <td>{d.type === "percentage" ? `${d.value}%` : d.value}</td>
                  <td>{d.is_active ? <span className="text-emerald-600">Active</span> : <span className="text-text-3">Inactive</span>}</td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(d); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(d.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={5}>Loading…</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {open && (
        <DiscountModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate} discount={editing} />
      )}
    </>
  );
}
