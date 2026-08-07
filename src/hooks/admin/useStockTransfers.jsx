import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/inventoryService";
import { toast } from "sonner";

export default function useStockTransfers({ pageSize = 10 } = {}) {
  const [transfers, setTransfers] = useState([]);
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
        svc.fetchStockTransfers({ page: p, pageSize }),
      ]);
      setWarehouses(wList);
      setProducts(pList);
      setTransfers(res.data);
      setTotal(res.count);
    } catch (e) {
      toast.error("Unable to load stock transfers.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveStockTransfer(vals, editing?.id);
      toast.success(editing ? "Transfer updated" : "Transfer created");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save transfer: " + e.message); }
  };

  const remove = async (id) => {
    try {
      await svc.deleteStockTransfer(id);
      toast.success("Transfer deleted");
      load(page);
    } catch (e) { toast.error("Failed to delete transfer"); }
  };

  return { transfers, warehouses, products, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove };
}
