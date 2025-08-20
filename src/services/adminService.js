// services/supabaseService.js
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Generic paginated fetch helper for a table or view
async function paginatedSelect({ table, select = "*", page = 1, pageSize = 10, orderBy = "created_at", ascending = false, filters = {} }) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase.from(table).select(select, { count: "exact" }).range(from, to).order(orderBy, { ascending });
  // apply simple equals filters
  Object.entries(filters || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query = query.eq(k, v);
  });
  const res = await query;
  if (res.error) throw res.error;
  return res; // { data, error, count }
}

/* -------------------- Partners -------------------- */
export async function fetchPartners({ page = 1, pageSize = 10 } = {}) {
  const { data, error, count } = await paginatedSelect({ table: "partners", page, pageSize, select: "*", orderBy: "name", ascending: true });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function savePartner(partner, id) {
  if (id) {
    const { error } = await supabase.from("partners").update(partner).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("partners").insert([partner]);
  if (error) throw error;
}
export async function deletePartner(id) {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Suppliers -------------------- */
export async function fetchSuppliers({ page = 1, pageSize = 10 } = {}) {
  const { data, error, count } = await paginatedSelect({ table: "suppliers", page, pageSize, select: "*", orderBy: "name", ascending: true });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveSupplier(supplier, id) {
  if (id) {
    const { error } = await supabase.from("suppliers").update(supplier).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("suppliers").insert([supplier]);
  if (error) throw error;
}
export async function deleteSupplier(id) {
  const { error } = await supabase.from("suppliers").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Categories -------------------- */
export async function fetchCategories() {
  const { data, error } = await supabase.from("product_categories").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function saveCategory(category, id) {
  if (id) {
    const { error } = await supabase.from("product_categories").update(category).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("product_categories").insert([category]);
  if (error) throw error;
}
export async function deleteCategory(id) {
  const { error } = await supabase.from("product_categories").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Products (paginated) -------------------- */
export async function fetchProducts({ page = 1, pageSize = 10, category_id } = {}) {
  const select = `
    *,
    product_categories!products_category_id_fkey(name),
    partners!products_partner_id_fkey(name),
    suppliers!products_supplier_id_fkey(name),
    product_images(image_url)
  `;
  const { data, error, count } = await paginatedSelect({
    table: "products",
    select,
    page,
    pageSize,
    orderBy: "created_at",
    ascending: false,
    filters: category_id ? { category_id } : {}
  });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

export async function saveProduct(vals, id = null) {
  // --- 1. Insert/Update product ---
  const productPayload = {
    name: vals.name,
    price: vals.price,
    description: vals.description,
    info: vals.info,
    category_id: vals.category_id,
    partner_id: vals.partner_id,
    supplier_id: vals.supplier_id,
    region: vals.region,
    added_by_admin: vals.added_by_admin,
  };

  const { data: product, error } = id
    ? await supabase.from("products").update(productPayload).eq("id", id).select().single()
    : await supabase.from("products").insert([productPayload]).select().single();

  if (error) throw error;

  // --- 2. Handle images ---
  const existingUrls = (product.product_images || []).map(img => img.image_url);

  // Separate new uploads from old ones
  const newFiles = vals.images?.filter(i => i.file) || [];
  const keptUrls = vals.images?.filter(i => i.image_url)?.map(i => i.image_url) || [];

  // Find deleted ones
  const deleted = existingUrls.filter(url => !keptUrls.includes(url));

  // --- 2a. Upload new files ---
  for (const img of newFiles) {
    const file = img.file;
    const filePath = `products/${product.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase
      .storage.from("products")
      .getPublicUrl(filePath);

    await supabase.from("product_images").insert({
      product_id: product.id,
      image_url: publicUrl,
    });
  }

  // --- 2b. Remove deleted ones (DB + storage) ---
  for (const url of deleted) {
    await supabase.from("product_images").delete().eq("image_url", url);

    // delete from storage (optional if you want cleanup)
    const path = url.split("/products/")[1]; // extract path from public URL
    if (path) {
      await supabase.storage.from("products").remove([path]);
    }
  }

  return product;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Users / Profiles -------------------- */
export async function fetchUsers({ page = 1, pageSize = 10 } = {}) {
  const select = `*, partners!profiles_partner_id_fkey(name), suppliers!profiles_supplier_id_fkey(name)`;
  const { data, error, count } = await paginatedSelect({ table: "profiles", select, page, pageSize, orderBy: "created_at", ascending: false });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveUserProfile(profile, id) {
  if (id) {
    const { error } = await supabase.from("profiles").update(profile).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("profiles").insert([profile]);
  if (error) throw error;
}
export async function deleteUserProfile(id) {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Shipments (paginated) -------------------- */
export async function fetchShipments({ page = 1, pageSize = 10 } = {}) {
  const select = `*, partners(name), suppliers(name), products(name)`;
  const { data, error, count } = await paginatedSelect({ table: "shipments", select, page, pageSize, orderBy: "created_at", ascending: false });
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}
export async function saveShipment(shipment, id) {
  if (id) {
    const { error } = await supabase.from("shipments").update(shipment).eq("id", id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("shipments").insert([shipment]);
  if (error) throw error;
}
export async function deleteShipment(id) {
  const { error } = await supabase.from("shipments").delete().eq("id", id);
  if (error) throw error;
}

/* -------------------- Analytics -------------------- */
export async function fetchAnalytics() {
  const profilesCountPromise = supabase.from("profiles").select("*", { count: "exact", head: true });
  const shipmentsCountPromise = supabase.from("shipments").select("*", { count: "exact", head: true });
  const partnersCountPromise = supabase.from("partners").select("*", { count: "exact", head: true });
  const suppliersCountPromise = supabase.from("suppliers").select("*", { count: "exact", head: true });

  const { data: trending } = await supabase.from("trending_products").select("*, products(name)").order("trend_score", { ascending: false }).limit(5);

  const [profilesRes, shipmentsRes, partnersRes, suppliersRes] = await Promise.all([
    profilesCountPromise, shipmentsCountPromise, partnersCountPromise, suppliersCountPromise
  ]);

  // simple breakdowns
  // const { data: byStatus } = await supabase.from("shipments").select("status, count:id").group("status");
  // const { data: byCategory } = await supabase.from("products").select("category_id, count:id").group("category_id");

  const { data: byStatus } = await supabase.from("shipments_by_status").select("*");
  const { data: byCategory } = await supabase.from("products_by_category").select("*");
  
  return {
    usersCount: profilesRes.count || 0,
    shipmentsCount: shipmentsRes.count || 0,
    partnersCount: partnersRes.count || 0,
    suppliersCount: suppliersRes.count || 0,
    trending: trending || [],
    byStatus: byStatus || [],
    byCategory: byCategory || []
  };
}

