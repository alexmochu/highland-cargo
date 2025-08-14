// services/partnerService.js
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// fetch paginated shipments for a partner
export async function fetchShipmentsForPartner(partnerId, { page = 1, pageSize = 10 } = {}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("shipments")
    .select(
      `id, order_id, product_id, supplier_id, partner_id, source_location, destination_location, tracking_number, status, created_at, updated_at,
       products:products (id, name, price, description),
       suppliers (id, name)`
    , { count: "exact" })
    .eq("partner_id", partnerId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

export async function fetchRecentShipmentsForPartner(partnerId, limit = 5) {
  const { data, error } = await supabase
    .from("shipments")
    .select(`id, tracking_number, product_id, status, created_at, products:products(name)`)
    .eq("partner_id", partnerId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// fetch messages by shipment ids
export async function fetchMessagesForShipments(shipmentIds = []) {
  if (!shipmentIds || shipmentIds.length === 0) return [];
  const { data, error } = await supabase
    .from("messages")
    .select("id, supplier_id, shipment_id, product_id, sender_id, content, created_at")
    .in("shipment_id", shipmentIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function postMessage(payload) {
  // payload: { supplier_id?, shipment_id?, product_id?, sender_id, content }
  const { data, error } = await supabase.from("messages").insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updatePartnerProfile(partnerProfileId, updates) {
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", partnerProfileId).select().single();
  if (error) throw error;
  return data;
}
