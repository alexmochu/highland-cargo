// hooks/useSuppliers.js
import { useState, useEffect } from "react";
import * as svc from "@/services/adminService";
import { toast } from "sonner";

export default function useSuppliers({ pageSize = 10 } = {}) {
  const [suppliers, setSuppliers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const { data, count } = await svc.fetchSuppliers({ page: p, pageSize });
      setSuppliers(data);
      setTotal(count);
    } catch (e) {
      toast.error("Unable to load suppliers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const addOrUpdate = async (vals) => {
    if (!editing) {
      const temp = { ...vals, id: `temp-${Date.now()}` };
      setSuppliers(prev => [temp, ...prev]);
      toast.promise(
        svc.saveSupplier(vals),
        {
          loading: "Adding supplier...",
          success: "Supplier added",
          error: "Failed to add supplier"
        }
      ).then(() => load(1)).catch(() => load());
    } else {
      const backup = suppliers;
      setSuppliers(prev => prev.map(s => s.id === editing.id ? { ...s, ...vals } : s));
      try {
        await svc.saveSupplier(vals, editing.id);
        toast.success("Supplier updated");
        setEditing(null);
        load(page);
      } catch (e) {
        toast.error("Failed to update supplier");
        setSuppliers(backup);
      }
    }
  };

  const remove = async (id) => {
    const backup = suppliers;
    setSuppliers(prev => prev.filter(s => s.id !== id));
    try {
      await svc.deleteSupplier(id);
      toast.success("Supplier removed");
      load(page);
    } catch (e) {
      toast.error("Failed to delete supplier");
      setSuppliers(backup);
    }
  };

  async function verifySupplier(id, status) {
    try {
      await toast.promise(
        fetch(`/api/admin/suppliers/${id}/verify`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }),
        {
          loading: "Updating supplier...",
          success: "Supplier status updated",
          error: "Failed to update supplier"
        }
      );
      load(page);
    } catch (e) {
      console.error("Verify supplier error:", e);
    }
  }

  return { suppliers, total, page, verifySupplier, setPage, pageSize, loading, editing, setEditing, load, addOrUpdate, remove };
}
