// Permission modules mirror the `roles.permissions` jsonb shape seeded in
// supabase/migrations/0002_roles_permissions.sql: { [moduleId]: [actions] }.
export const PERMISSION_MODULES = [
  { id: "products", label: "Products & Categories", actions: ["view", "create", "edit", "delete"] },
  { id: "shipments", label: "Shipments", actions: ["view", "create", "edit", "delete"] },
  { id: "quotations", label: "Quotations", actions: ["view", "create", "edit", "delete"] },
  { id: "orders", label: "Orders", actions: ["view", "create", "edit", "delete"] },
  { id: "invoices", label: "Invoices", actions: ["view", "create", "edit", "delete"] },
  { id: "payments", label: "Payments", actions: ["view", "create"] },
  { id: "purchases", label: "Purchases", actions: ["view", "create", "edit", "delete"] },
  { id: "expenses", label: "Expenses", actions: ["view", "create", "edit", "delete"] },
  { id: "inventory", label: "Inventory", actions: ["view", "create", "edit"] },
  { id: "warehouses", label: "Warehouses", actions: ["view", "create", "edit", "delete"] },
  { id: "contacts", label: "Contacts", actions: ["view", "create", "edit", "delete"] },
  { id: "hrm", label: "HRM", actions: ["view", "create", "edit", "delete"] },
  { id: "reports", label: "Reports", actions: ["view"] },
  { id: "settings", label: "Settings", actions: ["view", "edit"] },
  { id: "users", label: "User Management", actions: ["view", "edit"] },
  { id: "pos", label: "POS Terminal", actions: ["view", "create"] },
];

// `profile`: the caller's own profiles row ({ is_admin, role }).
// `rolesByName`: Map/object of role name -> roles row (with .permissions).
export function hasPermission(profile, rolesByName, moduleId, action) {
  if (!profile) return false;
  if (profile.is_admin) return true;
  const role = rolesByName?.[profile.role];
  return Boolean(role?.permissions?.[moduleId]?.includes(action));
}

export function canViewModule(profile, rolesByName, moduleId) {
  return hasPermission(profile, rolesByName, moduleId, "view");
}
