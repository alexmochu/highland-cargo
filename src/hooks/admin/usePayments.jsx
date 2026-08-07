import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/salesService";
import { toast } from "sonner";

export default function usePayments({ pageSize = 10 } = {}) {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [iList, pRes] = await Promise.all([
        svc.fetchAllInvoicesLite(),
        svc.fetchPayments({ page: p, pageSize }),
      ]);
      setInvoices(iList);
      setPayments(pRes.data);
      setTotal(pRes.count);
    } catch (e) {
      toast.error("Unable to load payments.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const record = async (vals) => {
    try {
      await svc.recordManualPayment(vals);
      toast.success("Payment recorded");
      load(1);
    } catch (e) { toast.error("Failed to record payment: " + e.message); }
  };

  return { payments, invoices, total, page, setPage, pageSize, loading, record };
}
