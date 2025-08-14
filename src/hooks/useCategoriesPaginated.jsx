import { useEffect, useState } from "react";
import * as svc from "@/services/supabaseService";
import { toast } from "sonner";

export default function useCategories({ pageSize = 10 } = {}) {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async (p = page) => {
    setLoading(true);
    try {
      // categories endpoint earlier wasn't paginated; use fetchCategories for full list
      const data = await svc.fetchCategories();
      setCategories(data);
      setTotal(data.length);
    } catch (e) {
      toast.error("Failed to load categories");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const addOrUpdate = async (vals) => {
    if (!editing) {
      // optimistic push
      const temp = { ...vals, id: `temp-${Date.now()}`, created_at: new Date().toISOString() };
      setCategories(prev => [temp, ...prev]);
      toast.promise(svc.saveCategory(vals), {
        loading: "Adding category...",
        success: "Category added",
        error: "Failed to add category"
      }).then(load).catch(load);
    } else {
      const backup = categories;
      setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...vals } : c));
      try {
        await svc.saveCategory(vals, editing.id);
        toast.success("Category updated");
        setEditing(null);
        load();
      } catch (e) {
        toast.error("Failed to update category");
        setCategories(backup);
      }
    }
  };

  const remove = async (id) => {
    const backup = categories;
    setCategories(prev => prev.filter(c => c.id !== id));
    try {
      await svc.deleteCategory(id);
      toast.success("Category deleted");
      load();
    } catch (e) {
      toast.error("Failed to delete category");
      setCategories(backup);
    }
  };

  return { categories, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove, reload: load };
}
