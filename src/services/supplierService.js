// services/supplierService.js
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
const supabase = createClient();

// Shipments for a supplier
export async function fetchShipmentsForSupplier(supplierId) {
  const { data, error } = await supabase
    .from("shipments")
    .select(`*, products(name, price, description), partners(name), suppliers(name)`)
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// Products for a supplier
export async function fetchProductsForSupplier(supplierId) {
  const { data, error } = await supabase
    .from("products")
    .select(`*, product_categories(name)`)
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchCategories(setCategories) {
  const { data, error } = await supabase
    .from("product_categories")
    .select("id, name")
    .order("name");
  if (error) {
    console.error(error);
    toast.error("Failed to load categories");
  } else {
    setCategories(data || []);
  }
}

export async function saveProductForSupplier(product, id) {
  if (id) {
    const { error } = await supabase.from("products").update(product).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("products").insert([product]);
  if (error) throw error;
}
export async function deleteProductById(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// Supplier team members
export async function fetchSupplierTeam(supplierId) {
  const { data, error } = await supabase
    .from("supplier_team_members")
    .select(`*, profiles(full_name, email, profile_id:id)`)
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addSupplierTeamMember(supplierId, userId, perms = {}) {
  const payload = {
    supplier_id: supplierId,
    user_id: userId,
    can_manage_products: perms.can_manage_products ?? true,
    can_manage_team: perms.can_manage_team ?? false,
  };
  const { error } = await supabase.from("supplier_team_members").insert([payload]);
  if (error) throw error;
}

export async function removeSupplierTeamMember(id) {
  const { error } = await supabase.from("supplier_team_members").delete().eq("id", id);
  if (error) throw error;
}

export async function updateTeamMemberPermissions(id, updates) {
  const { error } = await supabase.from("supplier_team_members").update(updates).eq("id", id);
  if (error) throw error;
}

// Messages
export async function fetchMessagesForSupplier(supplierId) {
  const { data: messages, error } = await supabase
    .from("messages")
    .select(`*, products(name), shipments(tracking_number, id)`)
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!messages || messages.length === 0) return [];

  // messages.sender_id references auth.users, not profiles directly, so
  // there's no FK PostgREST can embed on — fetch sender profiles separately
  // and merge them in.
  const senderIds = [...new Set(messages.map(m => m.sender_id).filter(Boolean))];
  let profilesById = {};
  if (senderIds.length > 0) {
    const { data: senderProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", senderIds);
    if (profilesError) throw profilesError;
    profilesById = Object.fromEntries((senderProfiles || []).map(p => [p.user_id, p]));
  }

  return messages.map(m => ({ ...m, sender: profilesById[m.sender_id] || null }));
}

export async function postMessageForSupplier(payload) {
  // payload: { supplier_id, shipment_id?, product_id?, sender_id, content }
  const { data, error } = await supabase.from("messages").insert([payload]).select().single();
  if (error) throw error;
  return data;
}
