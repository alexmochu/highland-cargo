import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/salesService";
import { toast } from "sonner";

export default function useDiscounts({ pageSize = 10 } = {}) {
  const [discounts, setDiscounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const { data, count } = await svc.fetchDiscounts({ page: p, pageSize });
      setDiscounts(data);
      setTotal(count);
    } catch (e) {
      toast.error("Unable to load discounts.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveDiscount(vals, editing?.id);
      toast.success(editing ? "Discount updated" : "Discount created");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save discount: " + e.message); }
  };

  const remove = async (id) => {
    const backup = discounts;
    setDiscounts(prev => prev.filter(d => d.id !== id));
    try {
      await svc.deleteDiscount(id);
      toast.success("Discount removed");
    } catch (e) {
      toast.error("Failed to delete discount");
      setDiscounts(backup);
    }
  };

  return { discounts, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove };
}
