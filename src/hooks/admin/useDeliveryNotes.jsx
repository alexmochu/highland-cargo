import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/salesService";
import { toast } from "sonner";

export default function useDeliveryNotes({ pageSize = 10 } = {}) {
  const [notes, setNotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [oList, nRes] = await Promise.all([
        svc.fetchAllOrdersLite(),
        svc.fetchDeliveryNotes({ page: p, pageSize }),
      ]);
      setOrders(oList);
      setNotes(nRes.data);
      setTotal(nRes.count);
    } catch (e) {
      toast.error("Unable to load delivery notes.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveDeliveryNote(vals, editing?.id);
      toast.success(editing ? "Delivery note updated" : "Delivery note created");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save delivery note: " + e.message); }
  };

  const remove = async (id) => {
    try {
      await svc.deleteDeliveryNote(id);
      toast.success("Delivery note deleted");
      load(page);
    } catch (e) { toast.error("Failed to delete delivery note"); }
  };

  return { notes, orders, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove };
}
