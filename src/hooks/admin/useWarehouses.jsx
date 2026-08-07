import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/adminService";
import { toast } from "sonner";

export default function useWarehouses({ pageSize = 10 } = {}) {
  const [warehouses, setWarehouses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const { data, count } = await svc.fetchWarehouses({ page: p, pageSize });
      setWarehouses(data);
      setTotal(count);
    } catch (e) {
      toast.error("Unable to load warehouses.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveWarehouse(vals, editing?.id);
      toast.success(editing ? "Warehouse updated" : "Warehouse added");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) {
      toast.error("Failed to save warehouse: " + e.message);
    }
  };

  const remove = async (id) => {
    const backup = warehouses;
    setWarehouses(prev => prev.filter(w => w.id !== id));
    try {
      await svc.deleteWarehouse(id);
      toast.success("Warehouse removed");
      load(page);
    } catch (e) {
      toast.error("Failed to delete warehouse");
      setWarehouses(backup);
    }
  };

  return { warehouses, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove };
}
