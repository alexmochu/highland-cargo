// hooks/useSupplierData.js
import { useEffect, useState } from "react";
import * as svc from "@/services/supplierService";
import { toast } from "sonner";

export function useShipments(supplierId) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const data = await svc.fetchShipmentsForSupplier(supplierId);
      setShipments(data);
    } catch (e) {
      toast.error("Failed to load shipments");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { if (supplierId) load(); }, [supplierId]);
  return { shipments, loading, reload: load };
}

export function useProducts(supplierId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const data = await svc.fetchProductsForSupplier(supplierId);
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { if (supplierId) load(); }, [supplierId]);
  return { products, loading, reload: load };
}

export function useTeam(supplierId) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const data = await svc.fetchSupplierTeam(supplierId);
      setTeam(data);
    } catch {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { if (supplierId) load(); }, [supplierId]);
  return { team, loading, reload: load };
}

export function useMessages(supplierId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const data = await svc.fetchMessagesForSupplier(supplierId);
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { if (supplierId) load(); }, [supplierId]);
  return { messages, loading, reload: load };
}
