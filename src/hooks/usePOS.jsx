import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/posService";
import { toast } from "sonner";

export default function usePOS(userId) {
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseId, setWarehouseId] = useState(null);
  const [register, setRegister] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    svc.fetchWarehousesLite().then(list => {
      setWarehouses(list);
      if (list.length) setWarehouseId(prev => prev || list[0].id);
    });
  }, []);

  useEffect(() => {
    if (!warehouseId || !userId) return;
    setLoading(true);
    svc.fetchOpenRegister(warehouseId, userId).then(setRegister).finally(() => setLoading(false));
  }, [warehouseId, userId]);

  useEffect(() => {
    svc.fetchPOSProducts(search).then(setProducts).catch(() => toast.error("Failed to load products"));
  }, [search]);

  const openRegister = async (name, openingFloat) => {
    try {
      const reg = await svc.openRegister({ warehouseId, name, openingFloat, userId });
      setRegister(reg);
      toast.success("Register opened");
    } catch (e) { toast.error("Failed to open register: " + e.message); }
  };

  const closeRegister = async (closingAmount) => {
    try {
      await svc.closeRegister(register.id, closingAmount, userId);
      setRegister(null);
      setCart([]);
      toast.success("Register closed");
    } catch (e) { toast.error("Failed to close register: " + e.message); }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      const unitPrice = Number(product.numeric_price ?? product.price ?? 0);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: product.id, name: product.name, unit_price: unitPrice, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart(prev => quantity <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const total = cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  const checkout = async () => {
    if (!cart.length || !register) return;
    setCheckingOut(true);
    try {
      await svc.ringUpSale({ items: cart, registerId: register.id, warehouseId });
      toast.success("Sale completed");
      setCart([]);
    } catch (e) {
      toast.error("Checkout failed: " + e.message);
    } finally {
      setCheckingOut(false);
    }
  };

  return {
    warehouses, warehouseId, setWarehouseId, register, products, search, setSearch,
    cart, addToCart, updateQuantity, removeFromCart, total, loading, checkingOut,
    openRegister, closeRegister, checkout,
  };
}
