import { useCallback, useEffect, useState } from "react";
import * as svc from "@/services/adminService";
import { toast } from "sonner";

export default function useShipments({ pageSize = 10 } = {}) {
  const [shipments, setShipments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [sRes, pList, sList, prList] = await Promise.all([
        svc.fetchShipments({ page: p, pageSize }),
        svc.fetchPartners({ page: 1, pageSize: 200 }).then(r => r.data),
        svc.fetchSuppliers({ page: 1, pageSize: 200 }).then(r => r.data),
        svc.fetchProducts({ page: 1, pageSize: 200 }).then(r => r.data),
      ]);
      setShipments(sRes.data);
      setTotal(sRes.count);
      setPartners(pList);
      setSuppliers(sList);
      setProducts(prList);
    } catch (e) {
      toast.error("Failed to load shipments");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    if (!editing) {
      const temp = { ...vals, id: `temp-${Date.now()}`, created_at: new Date().toISOString() };
      setShipments(prev => [temp, ...prev]);
      toast.promise(svc.saveShipment(vals), {
        loading: "Adding shipment...",
        success: "Shipment added",
        error: "Failed to add shipment"
      }).then(() => load(1)).catch(() => load(1));
    } else {
      const backup = shipments;
      setShipments(prev => prev.map(s => s.id === editing.id ? { ...s, ...vals } : s));
      try {
        await svc.saveShipment(vals, editing.id);
        toast.success("Shipment updated");
        setEditing(null);
        load(page);
      } catch (e) {
        toast.error("Failed to update shipment");
        setShipments(backup);
      }
    }
  };

  const remove = async (id) => {
    const backup = shipments;
    setShipments(prev => prev.filter(s => s.id !== id));
    try {
      await svc.deleteShipment(id);
      toast.success("Shipment deleted");
      load(page);
    } catch (e) {
      toast.error("Failed to delete shipment");
      setShipments(backup);
    }
  };

  return { shipments, partners, suppliers, products, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove, reload: load };
}
