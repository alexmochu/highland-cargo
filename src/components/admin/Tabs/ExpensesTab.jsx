"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useExpenses from "@/hooks/admin/useExpenses";
import ExpenseModal from "@/components/admin/Modals/ExpenseModal";
import Pagination from "@/components/ui/pagination";

export default function ExpensesTab() {
  const { expenses, categories, warehouses, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove, addCategory } = useExpenses({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Expenses</CardTitle>
          <Button className="bg-ink text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />Record Expense
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Date</th><th>Description</th><th>Category</th><th>Warehouse</th><th>Amount</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && expenses.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="py-2">{e.expense_date}</td>
                  <td>{e.description}</td>
                  <td>{e.expense_categories?.name || "Uncategorized"}</td>
                  <td>{e.warehouses?.name || "-"}</td>
                  <td>{e.currency} {Number(e.amount).toLocaleString()}</td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(e); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(e.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={6}>Loading…</td></tr>}
            </tbody>
          </table>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <ExpenseModal
          isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate}
          expense={editing} categories={categories} warehouses={warehouses} onAddCategory={addCategory}
        />
      )}
    </>
  );
}
