"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useProducts from "@/hooks/useProductsPaginated";
import ProductModal from "@/components/Modals/ProductModal";
import Pagination from "@/components/Pagination";

export default function ProductsTab() {
  const {
    products, categories, partners, suppliers, total, page, setPage, pageSize, loading,
    editing, setEditing, filterCategory, setFilterCategory, addOrUpdate, remove
  } = useProducts({ pageSize: 10 });

  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Products</CardTitle>
          <div className="flex gap-2">
            <Select onValueChange={(v)=>setFilterCategory(v)} value={filterCategory || ""}>
              <SelectTrigger className="w-56"><SelectValue placeholder="Filter by Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2"/>Add Product</Button>
          </div>
        </CardHeader>

        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Name</th><th>Category</th><th>Region</th><th>Price</th><th>Partner</th><th>Supplier</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && products.map(p => (
                <tr key={p.id} className="border-t">
                  <td>{p.name}</td>
                  <td>{p.product_categories?.name || "-"}</td>
                  <td className="uppercase">{p.region}</td>
                  <td>{p.price}</td>
                  <td>{p.partners?.name || "-"}</td>
                  <td>{p.suppliers?.name || "-"}</td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={7}>Loading…</td></tr>}
            </tbody>
          </table>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      <ProductModal
        isOpen={open}
        onClose={() => { setOpen(false); setEditing(null); }}
        onSave={(vals) => addOrUpdate(vals)}
        product={editing}
        categories={categories}
        partners={partners}
        suppliers={suppliers}
      />
    </>
  );
}
