// hooks/usePartners.js
import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/adminService";
import { toast } from "sonner";

export default function usePartners({ pageSize = 10 } = {}) {
  const [partners, setPartners] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const { data, count } = await svc.fetchPartners({ page: p, pageSize });
      setPartners(data);
      setTotal(count);
    } catch (e) {
      toast.error("Unable to load partners.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    // optimistic UI: if adding, push to top with temporary id
    if (!editing) {
      const temp = { ...vals, id: `temp-${Date.now()}` };
      setPartners(prev => [temp, ...prev]);
      toast.promise(
        svc.savePartner(vals),
        {
          loading: "Adding partner...",
          success: "Partner added",
          error: "Failed to add partner"
        }
      ).then(() => load(1)).catch(() => load());
    } else {
      const backup = partners;
      setPartners(prev => prev.map(p => p.id === editing.id ? { ...p, ...vals } : p));
      try {
        await svc.savePartner(vals, editing.id);
        toast.success("Partner updated");
        setEditing(null);
        load(page);
      } catch (e) {
        toast.error("Failed to update partner");
        setPartners(backup);
      }
    }
  };

  const remove = async (id) => {
    const backup = partners;
    setPartners(prev => prev.filter(p => p.id !== id)); // optimistic remove
    try {
      await svc.deletePartner(id);
      toast.success("Partner removed");
      // optionally reload if data changed server-side
      load(page);
    } catch (e) {
      toast.error("Failed to delete partner");
      setPartners(backup);
    }
  };

  return { partners, total, page, setPage, pageSize, loading, editing, setEditing, load, addOrUpdate, remove };
}
