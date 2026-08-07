import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/expensesCrmService";
import { fetchWarehousesLite } from "@/services/salesService";
import { toast } from "sonner";

export default function useExpenses({ pageSize = 10 } = {}) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [cList, wList, res] = await Promise.all([
        svc.fetchExpenseCategories(),
        fetchWarehousesLite(),
        svc.fetchExpenses({ page: p, pageSize }),
      ]);
      setCategories(cList);
      setWarehouses(wList);
      setExpenses(res.data);
      setTotal(res.count);
    } catch (e) {
      toast.error("Unable to load expenses.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveExpense(vals, editing?.id);
      toast.success(editing ? "Expense updated" : "Expense recorded");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save expense: " + e.message); }
  };

  const remove = async (id) => {
    try {
      await svc.deleteExpense(id);
      toast.success("Expense deleted");
      load(page);
    } catch (e) { toast.error("Failed to delete expense"); }
  };

  const addCategory = async (name) => {
    try {
      await svc.saveExpenseCategory({ name });
      load(page);
    } catch (e) { toast.error("Failed to add category"); }
  };

  return { expenses, categories, warehouses, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove, addCategory };
}
