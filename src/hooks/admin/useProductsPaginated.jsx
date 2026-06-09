import { useEffect, useState } from "react";
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
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async (p = page, cat = filterCategory) => {
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
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { load(1); }, [filterCategory]);
  useEffect(() => { load(page); }, [page]);

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
        await svc.saveProduct(vals, editing.id);
        toast.success("Product updated");
        setEditing(null);
        load(page);
      } catch (e) {
        toast.error("Failed to update product");
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
