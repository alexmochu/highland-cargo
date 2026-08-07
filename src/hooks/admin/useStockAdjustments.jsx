import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/inventoryService";
import { toast } from "sonner";

export default function useStockAdjustments({ pageSize = 10 } = {}) {
  const [adjustments, setAdjustments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [wList, pList, res] = await Promise.all([
        svc.fetchWarehousesLite(),
        svc.fetchAllProductsLite(),
        svc.fetchStockAdjustments({ page: p, pageSize }),
      ]);
      setWarehouses(wList);
      setProducts(pList);
      setAdjustments(res.data);
      setTotal(res.count);
    } catch (e) {
      toast.error("Unable to load stock adjustments.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveStockAdjustment(vals, editing?.id);
      toast.success(editing ? "Adjustment updated" : "Adjustment created");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save adjustment: " + e.message); }
  };

  const remove = async (id) => {
    try {
      await svc.deleteStockAdjustment(id);
      toast.success("Adjustment deleted");
      load(page);
    } catch (e) { toast.error("Failed to delete adjustment"); }
  };

  return { adjustments, warehouses, products, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove };
}
