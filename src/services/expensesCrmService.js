// services/expensesCrmService.js -- Phase 4 expenses & CRM polish
// (expense categories, expenses, agents, contact groups).
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

async function paginatedSelect({ table, select = "*", page = 1, pageSize = 10, orderBy = "created_at", ascending = false }) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const res = await supabase.from(table).select(select, { count: "exact" }).range(from, to).order(orderBy, { ascending });
  if (res.error) throw res.error;
  return res;
}

/* -------------------- Expense Categories -------------------- */
export async function fetchExpenseCategories() {
  const { data, error } = await supabase.from("expense_categories").select("*").order("name");
  if (error) throw error;
  return data || [];
}
export async function saveExpenseCategory(vals, id) {
  if (id) {
    const { error } = await supabase.from("expense_categories").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("expense_categories").insert([vals]);
  if (error) throw error;
}
export async function deleteExpenseCategory(id) {
  const { error } = await supabase.from("expense_categories").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Expenses -------------------- */
export async function fetchExpenses({ page = 1, pageSize = 10 } = {}) {
  const select = `*, expense_categories(name), warehouses(name)`;
  const { data, error, count } = await paginatedSelect({ table: "expenses", select, page, pageSize, orderBy: "expense_date" });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveExpense(vals, id) {
  if (id) {
    const { error } = await supabase.from("expenses").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("expenses").insert([vals]);
  if (error) throw error;
}
export async function deleteExpense(id) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Agents -------------------- */
export async function fetchAgents({ page = 1, pageSize = 10 } = {}) {
  const { data, error, count } = await paginatedSelect({ table: "agents", page, pageSize, orderBy: "name", ascending: true });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveAgent(vals, id) {
  if (id) {
    const { error } = await supabase.from("agents").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("agents").insert([vals]);
  if (error) throw error;
}
export async function deleteAgent(id) {
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Contact Groups -------------------- */
export async function fetchContactGroups() {
  const { data, error } = await supabase.from("contact_groups").select("*").order("name");
  if (error) throw error;
  return data || [];
}
export async function saveContactGroup(vals, id) {
  if (id) {
    const { error } = await supabase.from("contact_groups").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("contact_groups").insert([vals]);
  if (error) throw error;
}
export async function deleteContactGroup(id) {
  const { error } = await supabase.from("contact_groups").delete().eq("id", id);
  if (error) throw error;
}
