import { useCallback, useEffect, useState } from "react";
import * as svc from "@/services/adminService";
import { toast } from "sonner";

export default function useProducts({ pageSize = 10 } = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [partners, setPartners] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [filterCategory, setFilterCategoryState] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p = page, cat = filterCategory) => {
    setLoading(true);
    try {
      const [cats, partnersList, suppliersList] = await Promise.all([
        svc.fetchCategories(),
        svc.fetchPartners({ page: 1, pageSize: 200 }).then(r => r.data),
        svc.fetchSuppliers({ page: 1, pageSize: 200 }).then(r => r.data),
      ]);
      const { data, count } = await svc.fetchProducts({ page: p, pageSize, category_id: cat || undefined });
      setProducts(data);
      setTotal(count);
      setCategories(cats);
      setPartners(partnersList);
      setSuppliers(suppliersList);
    } catch (e) {
      toast.error("Failed to load products");
    } finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  // Single source of truth for refetching: page or category filter changing.
  useEffect(() => { load(page, filterCategory); }, [page, filterCategory, load]);

  const setFilterCategory = useCallback((cat) => {
    setFilterCategoryState(cat);
    setPage(1);
  }, []);

  const addOrUpdate = async (vals) => {
    if (!editing) {
      const temp = { ...vals, id: `temp-${Date.now()}`, created_at: new Date().toISOString() };
      setProducts(prev => [temp, ...prev]);

      try {
        await toast.promise(
          svc.saveProduct(vals),
          {
            loading: "Adding product...",
            success: "Product added",
            error: "Failed to add product",
          }
        );
        await load(1);
      } catch (err) {
        await load(1);
      }

    } else {
      const backup = products;
      setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...vals } : p));
      try {
        await toast.promise(
          svc.saveProduct(vals, editing.id),
          {
            loading: "Updating product...",
            success: "Product updated",
            error: "Failed to update product"
          }
        );
        setEditing(null);
        load(page);
      } catch (e) {
        setProducts(backup);
      }
    }
  };

  const remove = async (id) => {
    const backup = products;
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await svc.deleteProduct(id);
      toast.success("Product deleted");
      load(page);
    } catch (e) {
      toast.error("Failed to delete product");
      setProducts(backup);
    }
  };

  return { products, categories, partners, suppliers, total, page, setPage, pageSize, loading, editing, setEditing, filterCategory, setFilterCategory, addOrUpdate, remove, reload: load };
}
