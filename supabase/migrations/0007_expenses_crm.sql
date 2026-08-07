-- Phase 4: expenses (operational costs -- fuel, customs duty, warehouse
-- rent, agent commissions) and CRM polish (Agents for customs brokers /
-- freight / trucking partners, Contact Groups for tagging customers).
--
-- Not yet applied to a live project -- same caveat as prior migrations.

create table if not exists public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.expense_categories(id) on delete set null,
  warehouse_id uuid references public.warehouses(id) on delete set null,
  description text not null,
  amount numeric not null,
  currency text not null default 'KES',
  expense_date date not null default current_date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('customs_broker', 'freight_agent', 'trucking_partner', 'other')),
  contact_email text,
  phone text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

alter table public.expense_categories enable row level security;
create policy "expense_categories_read" on public.expense_categories for select using (public.is_admin() or public.has_permission('expenses', 'view'));
create policy "expense_categories_write" on public.expense_categories for all
  using (public.is_admin() or public.has_permission('expenses', 'edit'))
  with check (public.is_admin() or public.has_permission('expenses', 'edit'));

alter table public.expenses enable row level security;
create policy "expenses_read" on public.expenses for select using (public.is_admin() or public.has_permission('expenses', 'view'));
create policy "expenses_insert" on public.expenses for insert with check (public.is_admin() or public.has_permission('expenses', 'create'));
create policy "expenses_update" on public.expenses for update using (public.is_admin() or public.has_permission('expenses', 'edit')) with check (public.is_admin() or public.has_permission('expenses', 'edit'));
create policy "expenses_delete" on public.expenses for delete using (public.is_admin() or public.has_permission('expenses', 'delete'));

alter table public.agents enable row level security;
create policy "agents_read" on public.agents for select using (public.is_admin() or public.has_permission('contacts', 'view'));
create policy "agents_insert" on public.agents for insert with check (public.is_admin() or public.has_permission('contacts', 'create'));
create policy "agents_update" on public.agents for update using (public.is_admin() or public.has_permission('contacts', 'edit')) with check (public.is_admin() or public.has_permission('contacts', 'edit'));
create policy "agents_delete" on public.agents for delete using (public.is_admin() or public.has_permission('contacts', 'delete'));

alter table public.contact_groups enable row level security;
create policy "contact_groups_read" on public.contact_groups for select using (public.is_admin() or public.has_permission('contacts', 'view'));
create policy "contact_groups_write" on public.contact_groups for all
  using (public.is_admin() or public.has_permission('contacts', 'edit'))
  with check (public.is_admin() or public.has_permission('contacts', 'edit'));
