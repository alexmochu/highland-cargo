import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/salesService";
import { toast } from "sonner";

export default function useInvoices({ pageSize = 10 } = {}) {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [cList, oList, iRes] = await Promise.all([
        svc.fetchAllCustomersLite(),
        svc.fetchAllOrdersLite(),
        svc.fetchInvoices({ page: p, pageSize }),
      ]);
      setCustomers(cList);
      setOrders(oList);
      setInvoices(iRes.data);
      setTotal(iRes.count);
    } catch (e) {
      toast.error("Unable to load invoices.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveInvoice(vals, editing?.id);
      toast.success(editing ? "Invoice updated" : "Invoice created");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save invoice: " + e.message); }
  };

  const remove = async (id) => {
    try {
      await svc.deleteInvoice(id);
      toast.success("Invoice deleted");
      load(page);
    } catch (e) { toast.error("Failed to delete invoice"); }
  };

  return { invoices, customers, orders, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove, reload: load };
}
