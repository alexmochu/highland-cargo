import { useState, useEffect } from "react";
import * as svc from "@/services/reportsService";
import { toast } from "sonner";

export default function useReports() {
  const [sales, setSales] = useState(null);
  const [purchases, setPurchases] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [profitLoss, setProfitLoss] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      svc.fetchSalesReport(),
      svc.fetchPurchasesReport(),
      svc.fetchExpensesReport(),
      svc.fetchProfitLossReport(),
    ]).then(([s, p, e, pl]) => {
      setSales(s);
      setPurchases(p);
      setExpenses(e);
      setProfitLoss(pl);
    }).catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoading(false));
  }, []);

  return { sales, purchases, expenses, profitLoss, loading };
}
