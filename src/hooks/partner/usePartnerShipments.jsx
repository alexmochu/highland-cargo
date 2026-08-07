// hooks/usePartnerShipments.js
import { useCallback, useEffect, useState, useRef } from "react";
import * as svc from "@/services/partnerService";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function usePartnerShipments(partnerId, { pageSize = 10 } = {}) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const channelRef = useRef(null);

  const load = useCallback(async (p = page) => {
    if (!partnerId) return;
    setLoading(true);
    try {
      const { data, count } = await svc.fetchShipmentsForPartner(partnerId, { page: p, pageSize });
      setShipments(data);
      setTotal(count);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load shipments");
    } finally { setLoading(false); }
  }, [partnerId, page, pageSize]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!partnerId) return;
    const supabase = createClient();
    // subscribe to changes on shipments for this partner
    const channel = supabase
      .channel(`partner-shipments-${partnerId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments', filter: `partner_id=eq.${partnerId}` }, () => load(page))
      .subscribe();
    channelRef.current = channel;
    return () => {
      try { supabase.removeChannel(channel); } catch (e) { /*ignore*/ }
    };
  }, [partnerId, page, load]);

  return { shipments, loading, page, setPage, total, pageSize, reload: () => load(1) };
}
