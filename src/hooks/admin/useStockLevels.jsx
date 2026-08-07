import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/inventoryService";
import { toast } from "sonner";

export default function useStockLevels() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLevels(await svc.fetchStockLevels());
    } catch (e) {
      toast.error("Unable to load stock levels.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { levels, loading, reload: load };
}
