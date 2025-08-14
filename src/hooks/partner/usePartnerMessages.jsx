// hooks/usePartnerMessages.js
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import * as svc from "@/services/partnerService";
import { toast } from "sonner";

export default function usePartnerMessages(partnerId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef(null);

  const load = async () => {
    if (!partnerId) return;
    setLoading(true);
    try {
      // fetch the partner's shipments to get shipment ids
      const supabase = createClient();
      const { data: shipments } = await supabase
        .from("shipments")
        .select("id")
        .eq("partner_id", partnerId);

      const shipmentIds = (shipments || []).map(s => s.id).filter(Boolean);
      const msgs = await svc.fetchMessagesForShipments(shipmentIds);
      setMessages(msgs);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load messages");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [partnerId]);

  useEffect(() => {
    if (!partnerId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`partner-messages-${partnerId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
        // if the message is for a shipment owned by this partner, reload
        load();
      })
      .subscribe();
    channelRef.current = channel;
    return () => {
      try { supabase.removeChannel(channel); } catch (e) {}
    };
  }, [partnerId]);

  return { messages, loading, reload: load };
}
