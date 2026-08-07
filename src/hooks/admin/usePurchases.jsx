import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/inventoryService";
import { toast } from "sonner";

export default function usePurchases({ pageSize = 10 } = {}) {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [sList, wList, pList, res] = await Promise.all([
        svc.fetchAllSuppliersLite(),
        svc.fetchWarehousesLite(),
        svc.fetchAllProductsLite(),
        svc.fetchPurchases({ page: p, pageSize }),
      ]);
      setSuppliers(sList);
      setWarehouses(wList);
      setProducts(pList);
      setPurchases(res.data);
      setTotal(res.count);
    } catch (e) {
      toast.error("Unable to load purchases.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.savePurchase(vals, editing?.id);
      toast.success(editing ? "Purchase updated" : "Purchase created");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save purchase: " + e.message); }
  };

  const remove = async (id) => {
    try {
      await svc.deletePurchase(id);
      toast.success("Purchase deleted");
      load(page);
    } catch (e) { toast.error("Failed to delete purchase"); }
  };

  return { purchases, suppliers, warehouses, products, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove };
}
