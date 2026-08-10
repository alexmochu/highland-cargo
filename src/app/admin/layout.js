"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { canViewModule } from "@/lib/permissions";
import {
  LayoutDashboard, Package, Truck, Warehouse, Contact, UserCog,
  ChevronDown, ChevronLeft, ChevronRight, LogOut, Loader2, ShieldAlert,
  ShoppingCart, FileText, ShoppingBag, Boxes, Wallet, Terminal, BarChart3, Settings, Briefcase,
} from "lucide-react";

// Roles that can reach /admin at all (module-level visibility is then
// filtered per nav item via has_permission()/roles.permissions).
const ADMIN_AREA_ROLES = ["admin", "manager", "accountant", "warehouse_staff", "sales_agent", "cashier"];

const NAV_ITEMS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard, exact: true, module: null },
  { name: "POS Terminal", href: "/pos", icon: Terminal, module: "pos" },
  {
    name: "Catalog", icon: Package, module: "products",
    subItems: [
      { name: "Categories", href: "/admin/categories" },
      { name: "Products", href: "/admin/products" },
    ],
  },
  { name: "Shipments", href: "/admin/shipments", icon: Truck, module: "shipments" },
  {
    name: "Sales", icon: ShoppingCart, module: "orders",
    subItems: [
      { name: "Quotations", href: "/admin/quotations" },
      { name: "Orders", href: "/admin/orders" },
      { name: "Discounts", href: "/admin/discounts" },
      { name: "Delivery Notes", href: "/admin/delivery-notes" },
    ],
  },
  {
    name: "Billing", icon: FileText, module: "invoices",
    subItems: [
      { name: "Invoices", href: "/admin/invoices" },
      { name: "Payments", href: "/admin/payments" },
    ],
  },
  {
    name: "Purchasing", icon: ShoppingBag, module: "purchases",
    subItems: [
      { name: "Purchases", href: "/admin/purchases" },
    ],
  },
  {
    name: "Inventory", icon: Boxes, module: "inventory",
    subItems: [
      { name: "Stock on Hand", href: "/admin/inventory" },
      { name: "Stock Transfers", href: "/admin/stock-transfers" },
      { name: "Stock Adjustments", href: "/admin/stock-adjustments" },
    ],
  },
  { name: "Warehouses", href: "/admin/warehouses", icon: Warehouse, module: "warehouses" },
  { name: "Expenses", href: "/admin/expenses", icon: Wallet, module: "expenses" },
  { name: "Reports", href: "/admin/reports", icon: BarChart3, module: "reports" },
  { name: "HRM", href: "/admin/hrm", icon: Briefcase, module: "hrm" },
  {
    name: "Contacts", icon: Contact, module: "contacts",
    subItems: [
      { name: "Customers", href: "/admin/customers" },
      { name: "Partners", href: "/admin/partners" },
      { name: "Suppliers", href: "/admin/suppliers" },
      { name: "Agents", href: "/admin/agents" },
      { name: "Contact Groups", href: "/admin/contact-groups" },
    ],
  },
  {
    name: "User Management", icon: UserCog, module: "users",
    subItems: [
      { name: "Users", href: "/admin/users" },
      { name: "Roles", href: "/admin/roles" },
    ],
  },
  { name: "Settings", href: "/admin/settings", icon: Settings, module: "settings" },
];

export default function AdminLayout({ children }) {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [rolesByName, setRolesByName] = useState({});
  const [rolesLoading, setRolesLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    if (profile && !profile.is_admin && !ADMIN_AREA_ROLES.includes(profile.role)) {
      router.push("/dashboard");
    }
  }, [authLoading, user, profile, router]);

  useEffect(() => {
    let active = true;
    supabase.from("roles").select("*").then(({ data }) => {
      if (!active) return;
      const map = {};
      (data || []).forEach(r => { map[r.name] = r; });
      setRolesByName(map);
      setRolesLoading(false);
    });
    return () => { active = false; };
  }, [supabase]);

  const visibleItems = useMemo(() => {
    if (!profile) return [];
    return NAV_ITEMS.filter(item => item.module === null || canViewModule(profile, rolesByName, item.module));
  }, [profile, rolesByName]);

  if (authLoading || rolesLoading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-paper-dim">
        <Loader2 className="w-10 h-10 text-ink animate-spin mb-3" />
        <p className="text-text-3 font-medium">Loading admin console...</p>
      </div>
    );
  }

  if (!profile.is_admin && !ADMIN_AREA_ROLES.includes(profile.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-paper-dim p-4">
        <ShieldAlert className="w-14 h-14 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-ink mb-2">Access Denied</h1>
        <p className="text-text-3 text-center max-w-md">You don&apos;t have permission to access the admin console.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-paper-dim">
      <aside className={`bg-surface border-r border-line flex flex-col shrink-0 transition-all ${collapsed ? "w-20" : "w-64"}`}>
        <div className={`h-16 flex items-center border-b border-line px-4 gap-2.5 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="bg-ink text-paper w-8 h-8 flex items-center justify-center font-display font-extrabold text-sm shrink-0">HC</div>
              <div>
                <p className="font-display font-extrabold text-sm leading-none">HIGHLAND <span className="text-freight">CARGO</span></p>
                <p className="text-[10px] text-text-3 font-manifest uppercase tracking-widest mt-1">Admin console</p>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} className="text-text-3 hover:text-text-2">
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {visibleItems.map(item => {
            const Icon = item.icon;
            const hasSubItems = Boolean(item.subItems?.length);
            const isActive = !hasSubItems && (item.exact ? pathname === item.href : pathname.startsWith(item.href));
            const isGroupActive = hasSubItems && item.subItems.some(s => pathname.startsWith(s.href));
            const isOpen = openGroups[item.name] ?? isGroupActive;

            if (hasSubItems) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setOpenGroups(prev => ({ ...prev, [item.name]: !isOpen }))}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors border-l-2 ${
                      isGroupActive ? "bg-beacon/10 text-ink border-beacon" : "text-text-3 hover:bg-paper-dim border-transparent"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="flex-1 text-left">{item.name}</span>}
                    {!collapsed && <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                  </button>
                  {!collapsed && isOpen && (
                    <div className="pl-10 py-1 space-y-1">
                      {item.subItems.map(sub => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                            pathname.startsWith(sub.href) ? "text-freight" : "text-text-3 hover:text-ink"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors border-l-2 ${
                  isActive ? "bg-beacon/10 text-ink border-beacon" : "text-text-3 hover:bg-paper-dim border-transparent"
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-line">
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && "Exit Dashboard"}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-line flex items-center justify-between px-6 shrink-0">
          <div className="font-manifest text-[12px] text-text-3 tracking-wide">
            {pathname.split("/").filter(Boolean).join(" / ").toUpperCase()}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text-2">{profile.full_name || profile.email}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide bg-ink text-paper px-2.5 py-1">
              {profile.role || (profile.is_admin ? "admin" : "")}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
