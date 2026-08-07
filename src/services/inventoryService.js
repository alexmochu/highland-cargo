// services/inventoryService.js -- Phase 3 purchasing & warehouse inventory
// (purchases, stock transfers, stock adjustments, the movements ledger).
import { createClient } from "@/lib/supabase/client";
import { fetchWarehousesLite } from "@/services/salesService";
const supabase = createClient();

async function paginatedSelect({ table, select = "*", page = 1, pageSize = 10, orderBy = "created_at", ascending = false }) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const res = await supabase.from(table).select(select, { count: "exact" }).range(from, to).order(orderBy, { ascending });
  if (res.error) throw res.error;
  return res;
}

function genNumber(prefix) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${Date.now().toString().slice(-6)}${rand}`;
}

export { fetchWarehousesLite };
export async function fetchAllProductsLite() {
  const { data, error } = await supabase.from("products").select("id, name").order("name").limit(500);
  if (error) throw error;
  return data || [];
}
export async function fetchAllSuppliersLite() {
  const { data, error } = await supabase.from("suppliers").select("id, name").order("name");
  if (error) throw error;
  return data || [];
}

/* -------------------- Purchases -------------------- */
export async function fetchPurchases({ page = 1, pageSize = 10 } = {}) {
  const select = `*, suppliers(name), warehouses(name), purchase_items(*)`;
  const { data, error, count } = await paginatedSelect({ table: "purchases", select, page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function savePurchase(vals, id) {
  const { items = [], ...header } = vals;
  const subtotal = items.reduce((sum, it) => sum + Number(it.quantity || 0) * Number(it.unit_cost || 0), 0);

  let purchaseId = id;
  let previousStatus = null;
  if (id) {
    const { data: existing } = await supabase.from("purchases").select("status").eq("id", id).single();
    previousStatus = existing?.status;
    const { error } = await supabase.from("purchases").update({ ...header, subtotal, total: subtotal }).eq("id", id);
    if (error) throw error;
    await supabase.from("purchase_items").delete().eq("purchase_id", id);
  } else {
    const { data: purchase, error } = await supabase
      .from("purchases")
      .insert([{ ...header, purchase_number: genNumber("PO"), subtotal, total: subtotal }])
      .select()
      .single();
    if (error) throw error;
    purchaseId = purchase.id;
  }

  if (items.length) {
    const rows = items.map(it => ({
      purchase_id: purchaseId,
      product_id: it.product_id || null,
      description: it.description,
      quantity: it.quantity,
      unit_cost: it.unit_cost,
      line_total: Number(it.quantity || 0) * Number(it.unit_cost || 0),
    }));
    const { error: itemsError } = await supabase.from("purchase_items").insert(rows);
    if (itemsError) throw itemsError;
  }

  // Receiving a purchase (status transitions to "received") posts stock-in
  // movements for each line item with a product_id, once only.
  if (header.status === "received" && previousStatus !== "received" && header.warehouse_id) {
    const movementRows = items.filter(it => it.product_id).map(it => ({
      warehouse_id: header.warehouse_id,
      product_id: it.product_id,
      movement_type: "in",
      quantity: Number(it.quantity),
      reference_type: "purchase",
      reference_id: purchaseId,
    }));
    if (movementRows.length) {
      const { error: moveError } = await supabase.from("inventory_movements").insert(movementRows);
      if (moveError) throw moveError;
    }
  }

  return purchaseId;
}
export async function deletePurchase(id) {
  const { error } = await supabase.from("purchases").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Stock Transfers -------------------- */
export async function fetchStockTransfers({ page = 1, pageSize = 10 } = {}) {
  const select = `*, from:from_warehouse_id(name), to:to_warehouse_id(name), stock_transfer_items(*)`;
  const { data, error, count } = await paginatedSelect({ table: "stock_transfers", select, page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveStockTransfer(vals, id) {
  const { items = [], ...header } = vals;

  let transferId = id;
  let previousStatus = null;
  if (id) {
    const { data: existing } = await supabase.from("stock_transfers").select("status").eq("id", id).single();
    previousStatus = existing?.status;
    const { error } = await supabase.from("stock_transfers").update(header).eq("id", id);
    if (error) throw error;
    await supabase.from("stock_transfer_items").delete().eq("stock_transfer_id", id);
  } else {
    const { data: transfer, error } = await supabase
      .from("stock_transfers")
      .insert([{ ...header, transfer_number: genNumber("ST") }])
      .select()
      .single();
    if (error) throw error;
    transferId = transfer.id;
  }

  if (items.length) {
    const rows = items.map(it => ({ stock_transfer_id: transferId, product_id: it.product_id, quantity: Number(it.quantity) }));
    const { error: itemsError } = await supabase.from("stock_transfer_items").insert(rows);
    if (itemsError) throw itemsError;
  }

  // Completing a transfer posts a transfer_out at the source and a
  // transfer_in at the destination, once only.
  if (header.status === "completed" && previousStatus !== "completed") {
    const outRows = items.map(it => ({
      warehouse_id: header.from_warehouse_id, product_id: it.product_id, movement_type: "transfer_out",
      quantity: -Math.abs(Number(it.quantity)), reference_type: "stock_transfer", reference_id: transferId,
    }));
    const inRows = items.map(it => ({
      warehouse_id: header.to_warehouse_id, product_id: it.product_id, movement_type: "transfer_in",
      quantity: Math.abs(Number(it.quantity)), reference_type: "stock_transfer", reference_id: transferId,
    }));
    if (outRows.length) {
      const { error: moveError } = await supabase.from("inventory_movements").insert([...outRows, ...inRows]);
      if (moveError) throw moveError;
    }
  }

  return transferId;
}
export async function deleteStockTransfer(id) {
  const { error } = await supabase.from("stock_transfers").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Stock Adjustments -------------------- */
export async function fetchStockAdjustments({ page = 1, pageSize = 10 } = {}) {
  const select = `*, warehouses(name), stock_adjustment_items(*)`;
  const { data, error, count } = await paginatedSelect({ table: "stock_adjustments", select, page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveStockAdjustment(vals, id) {
  const { items = [], ...header } = vals;

  let adjustmentId = id;
  let previousStatus = null;
  if (id) {
    const { data: existing } = await supabase.from("stock_adjustments").select("status").eq("id", id).single();
    previousStatus = existing?.status;
    const { error } = await supabase.from("stock_adjustments").update(header).eq("id", id);
    if (error) throw error;
    await supabase.from("stock_adjustment_items").delete().eq("stock_adjustment_id", id);
  } else {
    const { data: adjustment, error } = await supabase
      .from("stock_adjustments")
      .insert([{ ...header, adjustment_number: genNumber("ADJ") }])
      .select()
      .single();
    if (error) throw error;
    adjustmentId = adjustment.id;
  }

  if (items.length) {
    const rows = items.map(it => ({ stock_adjustment_id: adjustmentId, product_id: it.product_id, quantity_change: Number(it.quantity_change), notes: it.notes || null }));
    const { error: itemsError } = await supabase.from("stock_adjustment_items").insert(rows);
    if (itemsError) throw itemsError;
  }

  // Approving an adjustment posts the signed quantity_change directly, once only.
  if (header.status === "approved" && previousStatus !== "approved" && header.warehouse_id) {
    const movementRows = items.map(it => ({
      warehouse_id: header.warehouse_id, product_id: it.product_id, movement_type: "adjustment",
      quantity: Number(it.quantity_change), reference_type: "stock_adjustment", reference_id: adjustmentId, notes: it.notes || null,
    }));
    if (movementRows.length) {
      const { error: moveError } = await supabase.from("inventory_movements").insert(movementRows);
      if (moveError) throw moveError;
    }
  }

  return adjustmentId;
}
export async function deleteStockAdjustment(id) {
  const { error } = await supabase.from("stock_adjustments").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Stock levels -------------------- */
export async function fetchStockLevels() {
  const { data, error } = await supabase
    .from("stock_levels")
    .select(`quantity_on_hand, products(name), warehouses(name)`)
    .order("quantity_on_hand", { ascending: false });
  if (error) throw error;
  return data || [];
}
