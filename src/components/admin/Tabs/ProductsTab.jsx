"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useProducts from "@/hooks/admin/useProductsPaginated";
import ProductModal from "@/components/admin/Modals/ProductModal";
import Pagination from "@/components/ui/pagination";
import Image from 'next/image';

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
              <SelectTrigger className="bg-orange-500 text-white w-56"><SelectValue placeholder="Filter by Category" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button className="bg-ink text-paper" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2"/>Add Product</Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th><th>Category</th><th>Region</th><th>Price</th><th>Partner</th><th>Supplier</th>
            <th>Actions</th>
            </tr></thead>
            <tbody>
              {!loading && products.map(p => {
                const hasImage = p.product_images && p.product_images.length > 0 && p.product_images[0].image_url;
                const imageSrc = hasImage ? p.product_images[0].image_url : '/highland-cargo.png';
                return (
                  <tr key={p.id}>
                    <td className="flex overflow-x-auto snap-x snap-mandatory h-16 w-16">
                      <Image 
                        key={p.id} 
                        src={imageSrc} 
                        alt={hasImage ? p.description + ' image' : p.name + ' logo'} 
                        width={300} 
                        height={200} 
                        className="snap-center object-cover w-full" 
                      />
                    </td>
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
                );
              })}
              {loading && <tr><td colSpan={8}>Loading…</td></tr>}
            </tbody>
          </table></div>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="rounded shadow max-w-md w-full">
            <ProductModal
              isOpen={open}
              onClose={() => { setOpen(false); setEditing(null); }}
              onSave={(vals) => addOrUpdate(vals)}
              product={editing}
              categories={categories}
              partners={partners}
              suppliers={suppliers}
            />
          </div>
        </div>
      )}
    </>
  );
}
