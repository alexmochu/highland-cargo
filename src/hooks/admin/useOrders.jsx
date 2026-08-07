import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/salesService";
import { toast } from "sonner";

export default function useOrders({ pageSize = 10 } = {}) {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [cList, oRes] = await Promise.all([
        svc.fetchAllCustomersLite(),
        svc.fetchOrders({ page: p, pageSize }),
      ]);
      setCustomers(cList);
      setOrders(oRes.data);
      setTotal(oRes.count);
    } catch (e) {
      toast.error("Unable to load orders.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveOrder(vals, editing?.id);
      toast.success(editing ? "Order updated" : "Order created");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save order: " + e.message); }
  };

  const remove = async (id) => {
    try {
      await svc.deleteOrder(id);
      toast.success("Order deleted");
      load(page);
    } catch (e) { toast.error("Failed to delete order"); }
  };

  return { orders, customers, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove };
}
