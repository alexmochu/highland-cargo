"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useCustomers from "@/hooks/admin/useCustomers";
import CustomerModal from "@/components/admin/Modals/CustomerModal";
import Pagination from "@/components/ui/pagination";

export default function CustomersTab() {
  const { customers, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useCustomers({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Customers</CardTitle>
          <Button className="bg-slate-800 text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />Add Customer
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Name</th><th>Email</th><th>Phone</th><th>Group</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && customers.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="py-2">{c.name}</td>
                  <td>{c.email || "-"}</td>
                  <td>{c.phone || "-"}</td>
                  <td>{c.customer_group || "-"}</td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4" /></Button>
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
        <CustomerModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate} customer={editing} />
      )}
    </>
  );
}
