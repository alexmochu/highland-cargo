"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useCategories from "@/hooks/useCategoriesPaginated";
import CategoryModal from "@/components/admin/Modals/CategoryModal";
import Pagination from "@/components/admin/Pagination";

export default function CategoriesTab() {
  const { categories, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useCategories({ pageSize: 50 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Product Categories</CardTitle>
          <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Category</Button>
        </CardHeader>

        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Name</th><th>Description</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && categories.map(c => (
                <tr key={c.id} className="border-t">
                  <td>{c.name}</td>
                  <td>{c.description || "-"}</td>
                  <td>{c.created_at ? new Date(c.created_at).toLocaleString() : "-"}</td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={4}>Loading…</td></tr>}
            </tbody>
          </table>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      <CategoryModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={(vals)=>addOrUpdate(vals)} category={editing} />
    </>
  );
}
