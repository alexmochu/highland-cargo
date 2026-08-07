// services/settingsService.js -- Phase 7 settings (business, invoicing, tax rates).
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export async function fetchBusinessSettings() {
  const { data, error } = await supabase.from("business_settings").select("*").eq("id", true).single();
  if (error) throw error;
  return data;
}
export async function saveBusinessSettings(vals) {
  const { error } = await supabase.from("business_settings").update({ ...vals, updated_at: new Date().toISOString() }).eq("id", true);
  if (error) throw error;
}

export async function fetchInvoiceSettings() {
  const { data, error } = await supabase.from("invoice_settings").select("*").eq("id", true).single();
  if (error) throw error;
  return data;
}
export async function saveInvoiceSettings(vals) {
  const { error } = await supabase.from("invoice_settings").update({ ...vals, updated_at: new Date().toISOString() }).eq("id", true);
  if (error) throw error;
}

export async function fetchTaxRates() {
  const { data, error } = await supabase.from("tax_rates").select("*").order("created_at");
  if (error) throw error;
  return data || [];
}
export async function saveTaxRate(vals, id) {
  if (id) {
    const { error } = await supabase.from("tax_rates").update(vals).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("tax_rates").insert([vals]);
  if (error) throw error;
}
export async function deleteTaxRate(id) {
  const { error } = await supabase.from("tax_rates").delete().eq("id", id);
  if (error) throw error;
}
