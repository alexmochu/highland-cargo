// services/reportsService.js -- Phase 6 reports. Client-side aggregation
// over bounded fetches, matching the existing AnalyticsTab/adminService
// convention rather than introducing a separate reporting backend.
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export async function fetchSalesReport() {
  const { data: orders, error } = await supabase.from("orders").select("id, status, total, currency, created_at").limit(1000);
  if (error) throw error;
  const { data: invoices, error: invError } = await supabase.from("invoices").select("amount, amount_paid, status").limit(1000);
  if (invError) throw invError;

  const revenue = (invoices || []).reduce((sum, i) => sum + Number(i.amount_paid || 0), 0);
  const ordersCount = (orders || []).length;
  const avgOrderValue = ordersCount ? (orders.reduce((s, o) => s + Number(o.total || 0), 0) / ordersCount) : 0;

  const byStatus = {};
  (orders || []).forEach(o => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });

  return {
    revenue,
    ordersCount,
    avgOrderValue,
    byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
    currency: orders?.[0]?.currency || "KES",
  };
}

export async function fetchPurchasesReport() {
  const { data, error } = await supabase.from("purchases").select("total, currency, status, suppliers(name)").limit(1000);
  if (error) throw error;

  const totalSpend = (data || []).reduce((sum, p) => sum + Number(p.total || 0), 0);
  const bySupplier = {};
  (data || []).forEach(p => {
    const name = p.suppliers?.name || "Unknown";
    bySupplier[name] = (bySupplier[name] || 0) + Number(p.total || 0);
  });

  return {
    totalSpend,
    currency: data?.[0]?.currency || "KES",
    bySupplier: Object.entries(bySupplier).map(([supplier, amount]) => ({ supplier, amount })).sort((a, b) => b.amount - a.amount).slice(0, 10),
  };
}

export async function fetchExpensesReport() {
  const { data, error } = await supabase.from("expenses").select("amount, currency, expense_categories(name)").limit(1000);
  if (error) throw error;

  const total = (data || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const byCategory = {};
  (data || []).forEach(e => {
    const name = e.expense_categories?.name || "Uncategorized";
    byCategory[name] = (byCategory[name] || 0) + Number(e.amount || 0);
  });

  return {
    total,
    currency: data?.[0]?.currency || "KES",
    byCategory: Object.entries(byCategory).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount),
  };
}

export async function fetchProfitLossReport() {
  const [sales, purchases, expenses] = await Promise.all([
    fetchSalesReport(),
    fetchPurchasesReport(),
    fetchExpensesReport(),
  ]);
  const netProfit = sales.revenue - purchases.totalSpend - expenses.total;
  return { revenue: sales.revenue, costOfGoods: purchases.totalSpend, expenses: expenses.total, netProfit, currency: sales.currency };
}

export async function fetchSupplierCustomerReport() {
  const [{ data: suppliers }, { data: customers }] = await Promise.all([
    supabase.from("suppliers").select("id, name, onboarding_status"),
    supabase.from("customers").select("id, name, customer_group"),
  ]);
  return { suppliers: suppliers || [], customers: customers || [] };
}
