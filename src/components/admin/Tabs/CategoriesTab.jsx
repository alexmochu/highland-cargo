"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, ChevronLeft } from "lucide-react";
import useCategories from "@/hooks/admin/useCategoriesPaginated";
import CategoryModal from "@/components/admin/Modals/CategoryModal";
import Pagination from "@/components/ui/pagination";
import { fetchProducts } from "@/services/adminService";
import { createClient } from "@/lib/supabase/client";

export default function CategoriesTab() {
  const { categories, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useCategories({ pageSize: 50 });
  const [open, setOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoryProductCounts, setCategoryProductCounts] = useState({});
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchProductCounts = async () => {
      if (categories.length > 0) {
        const { data: products } = await supabase.from("products").select("category_id");
        const counts = {};
        products?.forEach(p => {
          if (p.category_id) {
            counts[p.category_id] = (counts[p.category_id] || 0) + 1;
          }
        });
        setCategoryProductCounts(counts);
      }
    };
    fetchProductCounts();
  }, [categories, supabase]);

  const viewProducts = async (category) => {
    setViewingCategory(category);
    setProductsLoading(true);
    try {
      const { data } = await fetchProducts({ category_id: category.id, pageSize: 100 });
      setCategoryProducts(data);
    } catch (e) {
      console.error("Failed to load category products:", e);
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <>
      {viewingCategory ? (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setViewingCategory(null)}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <CardTitle>Products in &quot;{viewingCategory.name}&quot;</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <p>Loading products...</p>
            ) : categoryProducts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryProducts.map(product => (
                  <Card key={product.id} className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600">
                      <p>Price: ${product.price}</p>
                      <p>Region: {product.region}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No products in this category yet.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Product Categories</CardTitle>
            <Button className="bg-blue-600 text-white" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add Category</Button>
          </CardHeader>

          <CardContent>
            <table className="min-w-full text-sm">
              <thead><tr className="text-left"><th>Name</th><th>Description</th><th>Products</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {!loading && categories.map(c => (
                  <tr key={c.id} className="border-t">
                    <td>{c.name}</td>
                    <td>{c.description || "-"}</td>
                    <td className="font-medium">{categoryProductCounts[c.id] || 0}</td>
                    <td>{c.created_at ? new Date(c.created_at).toLocaleString() : "-"}</td>
                    <td className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => viewProducts(c)}><Eye className="w-4 h-4" /></Button>
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
      )}

      {open && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="rounded shadow max-w-md w-full">
            <CategoryModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={(vals)=>addOrUpdate(vals)} category={editing} />
          </div>
        </div>)}
    </>
  );
}
