// services/salesService.js -- Phase 2 sales-to-cash pipeline (customers,
// quotations, orders, invoices, payments, delivery notes, discounts).
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

async function paginatedSelect({ table, select = "*", page = 1, pageSize = 10, orderBy = "created_at", ascending = false, filters = {} }) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase.from(table).select(select, { count: "exact" }).range(from, to).order(orderBy, { ascending });
  Object.entries(filters || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query = query.eq(k, v);
  });
  const res = await query;
  if (res.error) throw res.error;
  return res;
}

function genNumber(prefix) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${Date.now().toString().slice(-6)}${rand}`;
}

/* -------------------- Customers -------------------- */
export async function fetchCustomers({ page = 1, pageSize = 10 } = {}) {
  const { data, error, count } = await paginatedSelect({ table: "customers", page, pageSize, orderBy: "name", ascending: true });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveCustomer(customer, id) {
  if (id) {
    const { error } = await supabase.from("customers").update(customer).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("customers").insert([customer]);
  if (error) throw error;
}
export async function deleteCustomer(id) {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
}
export async function fetchAllCustomersLite() {
  const { data, error } = await supabase.from("customers").select("id, name").order("name");
  if (error) throw error;
  return data || [];
}

export async function fetchWarehousesLite() {
  const { data, error } = await supabase.from("warehouses").select("id, name").order("name");
  if (error) throw error;
  return data || [];
}

/* -------------------- Quotations -------------------- */
export async function fetchQuotations({ page = 1, pageSize = 10 } = {}) {
  const select = `*, customers(name), warehouses:origin_warehouse_id(name)`;
  const { data, error, count } = await paginatedSelect({ table: "quotations", select, page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveQuotation(vals, id) {
  if (id) {
    const { error } = await supabase.from("quotations").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const payload = { ...vals, quotation_number: genNumber("QT") };
  const { error } = await supabase.from("quotations").insert([payload]);
  if (error) throw error;
}
export async function deleteQuotation(id) {
  const { error } = await supabase.from("quotations").delete().eq("id", id);
  if (error) throw error;
}
export async function convertQuotationToOrder(quotation) {
  const orderPayload = {
    order_number: genNumber("ORD"),
    customer_id: quotation.customer_id,
    quotation_id: quotation.id,
    status: "pending",
    subtotal: quotation.quoted_amount || 0,
    total: quotation.quoted_amount || 0,
    currency: quotation.currency || "KES",
  };
  const { data: order, error } = await supabase.from("orders").insert([orderPayload]).select().single();
  if (error) throw error;
  await supabase.from("quotations").update({ status: "accepted" }).eq("id", quotation.id);
  return order;
}

/* -------------------- Orders -------------------- */
export async function fetchOrders({ page = 1, pageSize = 10 } = {}) {
  const select = `*, customers(name), order_items(*)`;
  const { data, error, count } = await paginatedSelect({ table: "orders", select, page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveOrder(vals, id) {
  const { items = [], ...header } = vals;
  const subtotal = items.reduce((sum, it) => sum + Number(it.quantity || 0) * Number(it.unit_price || 0), 0);
  const total = Math.max(0, subtotal - Number(header.discount_amount || 0));

  let orderId = id;
  if (id) {
    const { error } = await supabase.from("orders").update({ ...header, subtotal, total }).eq("id", id);
    if (error) throw error;
    await supabase.from("order_items").delete().eq("order_id", id);
  } else {
    const { data: order, error } = await supabase
      .from("orders")
      .insert([{ ...header, order_number: genNumber("ORD"), subtotal, total }])
      .select()
      .single();
    if (error) throw error;
    orderId = order.id;
  }

  if (items.length) {
    const rows = items.map(it => ({
      order_id: orderId,
      product_id: it.product_id || null,
      description: it.description,
      quantity: it.quantity,
      unit_price: it.unit_price,
      line_total: Number(it.quantity || 0) * Number(it.unit_price || 0),
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(rows);
    if (itemsError) throw itemsError;
  }
  return orderId;
}
export async function deleteOrder(id) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}
export async function fetchAllOrdersLite() {
  const { data, error } = await supabase.from("orders").select("id, order_number, total, currency").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return data || [];
}

/* -------------------- Invoices -------------------- */
export async function fetchInvoices({ page = 1, pageSize = 10 } = {}) {
  const select = `*, customers(name), orders(order_number)`;
  const { data, error, count } = await paginatedSelect({ table: "invoices", select, page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveInvoice(vals, id) {
  if (id) {
    const { error } = await supabase.from("invoices").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const payload = { ...vals, invoice_number: genNumber("INV") };
  const { error } = await supabase.from("invoices").insert([payload]);
  if (error) throw error;
}
export async function deleteInvoice(id) {
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAllInvoicesLite() {
  const { data, error } = await supabase.from("invoices").select("id, invoice_number, amount, amount_paid, currency").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return data || [];
}

/* -------------------- Payments -------------------- */
export async function fetchPayments({ page = 1, pageSize = 10 } = {}) {
  const select = `*, invoices(invoice_number)`;
  const { data, error, count } = await paginatedSelect({ table: "payments", select, page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
// Records a manual payment (cash/bank_transfer) and marks the invoice paid.
// Paystack payments instead go through /api/payments/initiate + the webhook.
export async function recordManualPayment(vals) {
  const { error } = await supabase.from("payments").insert([{ ...vals, status: "success", paid_at: new Date().toISOString() }]);
  if (error) throw error;

  if (vals.invoice_id) {
    const { data: invoice } = await supabase.from("invoices").select("amount, amount_paid").eq("id", vals.invoice_id).single();
    if (invoice) {
      const amountPaid = Number(invoice.amount_paid || 0) + Number(vals.amount || 0);
      await supabase.from("invoices").update({
        amount_paid: amountPaid,
        status: amountPaid >= Number(invoice.amount) ? "paid" : "sent",
      }).eq("id", vals.invoice_id);
    }
  }
}

/* -------------------- Delivery Notes -------------------- */
export async function fetchDeliveryNotes({ page = 1, pageSize = 10 } = {}) {
  const select = `*, orders(order_number), shipments(tracking_number)`;
  const { data, error, count } = await paginatedSelect({ table: "delivery_notes", select, page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveDeliveryNote(vals, id) {
  if (id) {
    const { error } = await supabase.from("delivery_notes").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("delivery_notes").insert([vals]);
  if (error) throw error;
}
export async function deleteDeliveryNote(id) {
  const { error } = await supabase.from("delivery_notes").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Discounts -------------------- */
export async function fetchDiscounts({ page = 1, pageSize = 10 } = {}) {
  const { data, error, count } = await paginatedSelect({ table: "discounts", page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveDiscount(vals, id) {
  if (id) {
    const { error } = await supabase.from("discounts").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("discounts").insert([vals]);
  if (error) throw error;
}
export async function deleteDiscount(id) {
  const { error } = await supabase.from("discounts").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Sales Returns -------------------- */
export async function fetchSalesReturns({ page = 1, pageSize = 10 } = {}) {
  const select = `*, orders(order_number)`;
  const { data, error, count } = await paginatedSelect({ table: "sales_returns", select, page, pageSize });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveSalesReturn(vals, id) {
  if (id) {
    const { error } = await supabase.from("sales_returns").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("sales_returns").insert([vals]);
  if (error) throw error;
}
