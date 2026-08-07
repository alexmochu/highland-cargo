import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/salesService";
import { toast } from "sonner";

export default function useCustomers({ pageSize = 10 } = {}) {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const { data, count } = await svc.fetchCustomers({ page: p, pageSize });
      setCustomers(data);
      setTotal(count);
    } catch (e) {
      toast.error("Unable to load customers.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveCustomer(vals, editing?.id);
      toast.success(editing ? "Customer updated" : "Customer added");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save customer: " + e.message); }
  };

  const remove = async (id) => {
    const backup = customers;
    setCustomers(prev => prev.filter(c => c.id !== id));
    try {
      await svc.deleteCustomer(id);
      toast.success("Customer removed");
    } catch (e) {
      toast.error("Failed to delete customer");
      setCustomers(backup);
    }
  };

  return { customers, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove };
}
