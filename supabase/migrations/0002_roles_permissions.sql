-- Roles & permissions for the Highland Cargo ERP buildout.
--
-- Keeps the existing `profiles.role` / `profiles.is_admin` columns as the
-- enforcement mechanism (no breaking change for current supplier/partner
-- logic) and adds a `roles` table that maps a role *name* to a permissions
-- matrix (module -> [actions]), mirroring the "everland" admin roles model.
-- `has_permission()` is additive to the existing `is_admin()` /
-- `current_supplier_id()` / `current_partner_id()` helpers from
-- 0001_baseline_rls.sql -- same security-definer pattern, not a replacement.
--
-- Like 0001, this has NOT been applied to a live project. Verify the
-- `profiles.role` check-constraint discovery block below against the real
-- schema before running.

-- ---------------------------------------------------------------------------
-- roles: name -> permissions jsonb, e.g. {"quotations": ["view","create"]}
-- ---------------------------------------------------------------------------
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  permissions jsonb not null default '{}'::jsonb,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.roles enable row level security;

create policy "roles_read_own_or_admin" on public.roles
  for select using (
    public.is_admin()
    or name = (select role from public.profiles where user_id = auth.uid())
  );

create policy "roles_admin_write" on public.roles
  for insert with check (public.is_admin());

create policy "roles_admin_update" on public.roles
  for update using (public.is_admin()) with check (public.is_admin());

create policy "roles_admin_delete_non_system" on public.roles
  for delete using (public.is_admin() and not is_system);

-- ---------------------------------------------------------------------------
-- has_permission(): true for admins, or if the caller's role has the given
-- action enabled for the given module.
-- ---------------------------------------------------------------------------
create or replace function public.has_permission(p_module text, p_action text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or coalesce(
    (
      select (r.permissions -> p_module) ? p_action
      from public.profiles pr
      join public.roles r on r.name = pr.role
      where pr.user_id = auth.uid()
    ),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- Widen profiles.role to admit the new operational roles. The exact
-- constraint name in production is unknown, so this discovers and drops any
-- existing check constraint on profiles.role before adding the new one.
-- ---------------------------------------------------------------------------
do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%role%'
  loop
    execute format('alter table public.profiles drop constraint %I', con.conname);
  end loop;
end $$;

alter table public.profiles
  add constraint profiles_role_check
  check (role is null or role in (
    'admin', 'manager', 'accountant', 'warehouse_staff', 'sales_agent', 'cashier',
    'supplier', 'partner'
  ));

-- ---------------------------------------------------------------------------
-- Seed system roles. `admin` keeps relying on profiles.is_admin for full
-- access (has_permission() short-circuits true for admins regardless of this
-- row's permissions), the row exists mainly so it appears in role pickers.
-- ---------------------------------------------------------------------------
insert into public.roles (name, description, permissions, is_system) values
  ('admin', 'Full system access', '{}'::jsonb, true),
  ('manager', 'Operations manager -- most modules, no user/role management', '{
    "products": ["view","create","edit","delete"],
    "shipments": ["view","create","edit","delete"],
    "quotations": ["view","create","edit","delete"],
    "orders": ["view","create","edit","delete"],
    "invoices": ["view","create","edit"],
    "payments": ["view","create"],
    "purchases": ["view","create","edit","delete"],
    "expenses": ["view","create","edit"],
    "inventory": ["view","create","edit"],
    "warehouses": ["view","create","edit"],
    "contacts": ["view","create","edit"],
    "hrm": ["view","create","edit"],
    "reports": ["view"],
    "pos": ["view","create"]
  }'::jsonb, true),
  ('accountant', 'Invoicing, payments, expenses and financial reports', '{
    "quotations": ["view"],
    "orders": ["view"],
    "invoices": ["view","create","edit"],
    "payments": ["view","create"],
    "purchases": ["view"],
    "expenses": ["view","create","edit"],
    "reports": ["view"]
  }'::jsonb, true),
  ('warehouse_staff', 'Products, inventory, stock transfers/adjustments and warehouses', '{
    "products": ["view","create","edit"],
    "shipments": ["view","edit"],
    "orders": ["view"],
    "inventory": ["view","create","edit"],
    "warehouses": ["view","edit"],
    "purchases": ["view"],
    "reports": ["view"]
  }'::jsonb, true),
  ('sales_agent', 'Quotations, orders, shipments and customer contacts', '{
    "shipments": ["view","edit"],
    "quotations": ["view","create","edit"],
    "orders": ["view","create","edit"],
    "contacts": ["view","create","edit"],
    "invoices": ["view"],
    "reports": ["view"]
  }'::jsonb, true),
  ('cashier', 'POS terminal, payments and delivery notes', '{
    "pos": ["view","create"],
    "payments": ["view","create"],
    "orders": ["view","create"],
    "invoices": ["view","create"]
  }'::jsonb, true),
  ('supplier', 'Supplier portal (own shipments, products, team)', '{}'::jsonb, true),
  ('partner', 'Partner portal (own shipments, messages)', '{}'::jsonb, true)
on conflict (name) do nothing;
