import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/salesService";
import { toast } from "sonner";

export default function useQuotations({ pageSize = 10 } = {}) {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [cList, wList, qRes] = await Promise.all([
        svc.fetchAllCustomersLite(),
        svc.fetchWarehousesLite(),
        svc.fetchQuotations({ page: p, pageSize }),
      ]);
      setCustomers(cList);
      setWarehouses(wList);
      setQuotations(qRes.data);
      setTotal(qRes.count);
    } catch (e) {
      toast.error("Unable to load quotations.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveQuotation(vals, editing?.id);
      toast.success(editing ? "Quotation updated" : "Quotation created");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save quotation: " + e.message); }
  };

  const remove = async (id) => {
    try {
      await svc.deleteQuotation(id);
      toast.success("Quotation deleted");
      load(page);
    } catch (e) { toast.error("Failed to delete quotation"); }
  };

  const convertToOrder = async (quotation) => {
    try {
      await svc.convertQuotationToOrder(quotation);
      toast.success("Converted to order");
      load(page);
    } catch (e) { toast.error("Failed to convert quotation: " + e.message); }
  };

  return { quotations, customers, warehouses, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove, convertToOrder };
}
