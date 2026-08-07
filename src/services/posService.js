// services/posService.js -- Phase 5 POS terminal. Builds on top of the
// Phase 2 sales-to-cash tables (orders/order_items/invoices/payments) and
// the Phase 3 inventory ledger, so a rung-up sale shows up everywhere those
// already do (Orders list, Invoices, stock on hand).
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

function genNumber(prefix) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${Date.now().toString().slice(-6)}${rand}`;
}

export async function fetchWarehousesLite() {
  const { data, error } = await supabase.from("warehouses").select("id, name").order("name");
  if (error) throw error;
  return data || [];
}

export async function fetchPOSProducts(search = "") {
  let query = supabase.from("products").select("id, name, price, numeric_price").order("name").limit(50);
  if (search) query = query.ilike("name", `%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchOpenRegister(warehouseId, userId) {
  const { data, error } = await supabase
    .from("registers")
    .select("*")
    .eq("warehouse_id", warehouseId)
    .eq("opened_by", userId)
    .eq("status", "open")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function openRegister({ warehouseId, name, openingFloat, userId }) {
  const { data, error } = await supabase
    .from("registers")
    .insert([{ warehouse_id: warehouseId, name, opening_float: Number(openingFloat) || 0, opened_by: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function closeRegister(id, closingAmount, userId) {
  const { error } = await supabase
    .from("registers")
    .update({ status: "closed", closing_amount: Number(closingAmount) || 0, closed_by: userId, closed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

// Rings up a cash sale: creates the order + items, a paid invoice, a
// success payment record, and posts stock-out movements for each item.
// Sequential inserts (no client-side multi-statement transaction support in
// supabase-js), matching the pattern already used by saveOrder().
export async function ringUpSale({ items, registerId, warehouseId, customerId = null }) {
  const total = items.reduce((sum, it) => sum + Number(it.quantity) * Number(it.unit_price), 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{
      order_number: genNumber("POS"),
      customer_id: customerId,
      status: "completed",
      subtotal: total,
      total,
      register_id: registerId,
    }])
    .select()
    .single();
  if (orderError) throw orderError;

  const itemRows = items.map(it => ({
    order_id: order.id,
    product_id: it.id,
    description: it.name,
    quantity: it.quantity,
    unit_price: it.unit_price,
    line_total: Number(it.quantity) * Number(it.unit_price),
  }));
  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
  if (itemsError) throw itemsError;

  const { error: invoiceError } = await supabase.from("invoices").insert([{
    invoice_number: genNumber("INV"),
    order_id: order.id,
    customer_id: customerId,
    status: "paid",
    amount: total,
    amount_paid: total,
  }]);
  if (invoiceError) throw invoiceError;

  const { error: paymentError } = await supabase.from("payments").insert([{
    order_id: order.id,
    amount: total,
    method: "cash",
    status: "success",
    paid_at: new Date().toISOString(),
  }]);
  if (paymentError) throw paymentError;

  if (warehouseId) {
    const movementRows = items.map(it => ({
      warehouse_id: warehouseId,
      product_id: it.id,
      movement_type: "out",
      quantity: -Math.abs(Number(it.quantity)),
      reference_type: "order",
      reference_id: order.id,
    }));
    const { error: moveError } = await supabase.from("inventory_movements").insert(movementRows);
    if (moveError) throw moveError;
  }

  return order;
}
