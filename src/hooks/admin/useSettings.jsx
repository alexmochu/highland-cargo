import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/settingsService";
import { toast } from "sonner";

export default function useSettings() {
  const [business, setBusiness] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [taxRates, setTaxRates] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [b, i, t] = await Promise.all([svc.fetchBusinessSettings(), svc.fetchInvoiceSettings(), svc.fetchTaxRates()]);
      setBusiness(b);
      setInvoice(i);
      setTaxRates(t);
    } catch (e) {
      toast.error("Unable to load settings.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveBusiness = async (vals) => {
    try {
      await svc.saveBusinessSettings(vals);
      toast.success("Business settings saved");
      load();
    } catch (e) { toast.error("Failed to save: " + e.message); }
  };

  const saveInvoice = async (vals) => {
    try {
      await svc.saveInvoiceSettings(vals);
      toast.success("Invoice settings saved");
      load();
    } catch (e) { toast.error("Failed to save: " + e.message); }
  };

  const addTaxRate = async (vals) => {
    try {
      await svc.saveTaxRate(vals);
      toast.success("Tax rate added");
      load();
    } catch (e) { toast.error("Failed to add tax rate: " + e.message); }
  };

  const removeTaxRate = async (id) => {
    try {
      await svc.deleteTaxRate(id);
      toast.success("Tax rate removed");
      load();
    } catch (e) { toast.error("Failed to delete tax rate"); }
  };

  return { business, invoice, taxRates, loading, saveBusiness, saveInvoice, addTaxRate, removeTaxRate };
}
