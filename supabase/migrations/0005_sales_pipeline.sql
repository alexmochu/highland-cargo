-- Phase 2: sales-to-cash pipeline. Formalizes the `orders` entity that
-- `shipments.order_id` already referenced with nothing behind it, plus the
-- quotation -> order -> invoice -> payment -> delivery flow.
--
-- RLS follows the has_permission(module, action) helper from
-- 0002_roles_permissions.sql, with an added self-read policy for customers
-- who have a linked profiles.user_id (so a logged-in buyer can see their own
-- quotations/orders/invoices without a staff role).
--
-- Not yet applied to a live project -- same caveat as prior migrations.

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address text,
  customer_group text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  origin_warehouse_id uuid references public.warehouses(id) on delete set null,
  destination text,
  cargo_description text,
  weight_kg numeric,
  volume_cbm numeric,
  mode text check (mode in ('air', 'sea')),
  status text not null default 'pending' check (status in ('pending', 'quoted', 'accepted', 'rejected', 'expired')),
  quoted_amount numeric,
  currency text not null default 'KES',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  quotation_id uuid references public.quotations(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'completed', 'cancelled')),
  subtotal numeric not null default 0,
  discount_amount numeric not null default 0,
  total numeric not null default 0,
  currency text not null default 'KES',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text not null,
  quantity numeric not null default 1,
  unit_price numeric not null default 0,
  line_total numeric not null default 0
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  order_id uuid references public.orders(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  amount numeric not null default 0,
  amount_paid numeric not null default 0,
  currency text not null default 'KES',
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  amount numeric not null,
  currency text not null default 'KES',
  method text not null check (method in ('paystack', 'cash', 'bank_transfer')),
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  paystack_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  shipment_id uuid references public.shipments(id) on delete set null,
  delivered_to text,
  delivered_at timestamptz,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric not null,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_returns (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  reason text,
  amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- shipments.order_id already exists as a bare column referenced by the
-- admin ShipmentModal with nothing to point to; add the FK now that
-- `orders` exists, if it isn't already constrained.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'shipments' and column_name = 'order_id' and data_type = 'uuid'
  ) and not exists (
    select 1 from pg_constraint where conname = 'shipments_order_id_fkey'
  ) then
    alter table public.shipments
      add constraint shipments_order_id_fkey foreign key (order_id) references public.orders(id) on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- RLS: staff via has_permission(), customers can read their own rows.
-- ---------------------------------------------------------------------------
alter table public.customers enable row level security;
create policy "customers_read" on public.customers for select
  using (public.is_admin() or public.has_permission('contacts', 'view') or user_id = auth.uid());
create policy "customers_write" on public.customers for insert
  with check (public.is_admin() or public.has_permission('contacts', 'create'));
create policy "customers_update" on public.customers for update
  using (public.is_admin() or public.has_permission('contacts', 'edit'))
  with check (public.is_admin() or public.has_permission('contacts', 'edit'));
create policy "customers_delete" on public.customers for delete
  using (public.is_admin() or public.has_permission('contacts', 'delete'));

alter table public.quotations enable row level security;
create policy "quotations_read" on public.quotations for select
  using (public.is_admin() or public.has_permission('quotations', 'view')
    or exists (select 1 from public.customers c where c.id = quotations.customer_id and c.user_id = auth.uid()));
create policy "quotations_write" on public.quotations for insert
  with check (public.is_admin() or public.has_permission('quotations', 'create'));
create policy "quotations_update" on public.quotations for update
  using (public.is_admin() or public.has_permission('quotations', 'edit'))
  with check (public.is_admin() or public.has_permission('quotations', 'edit'));
create policy "quotations_delete" on public.quotations for delete
  using (public.is_admin() or public.has_permission('quotations', 'delete'));

alter table public.orders enable row level security;
create policy "orders_read" on public.orders for select
  using (public.is_admin() or public.has_permission('orders', 'view')
    or exists (select 1 from public.customers c where c.id = orders.customer_id and c.user_id = auth.uid()));
create policy "orders_write" on public.orders for insert
  with check (public.is_admin() or public.has_permission('orders', 'create'));
create policy "orders_update" on public.orders for update
  using (public.is_admin() or public.has_permission('orders', 'edit'))
  with check (public.is_admin() or public.has_permission('orders', 'edit'));
create policy "orders_delete" on public.orders for delete
  using (public.is_admin() or public.has_permission('orders', 'delete'));

alter table public.order_items enable row level security;
create policy "order_items_read" on public.order_items for select
  using (public.is_admin() or public.has_permission('orders', 'view')
    or exists (select 1 from public.orders o join public.customers c on c.id = o.customer_id where o.id = order_items.order_id and c.user_id = auth.uid()));
create policy "order_items_write" on public.order_items for all
  using (public.is_admin() or public.has_permission('orders', 'edit'))
  with check (public.is_admin() or public.has_permission('orders', 'edit'));

alter table public.invoices enable row level security;
create policy "invoices_read" on public.invoices for select
  using (public.is_admin() or public.has_permission('invoices', 'view')
    or exists (select 1 from public.customers c where c.id = invoices.customer_id and c.user_id = auth.uid()));
create policy "invoices_write" on public.invoices for insert
  with check (public.is_admin() or public.has_permission('invoices', 'create'));
create policy "invoices_update" on public.invoices for update
  using (public.is_admin() or public.has_permission('invoices', 'edit'))
  with check (public.is_admin() or public.has_permission('invoices', 'edit'));
create policy "invoices_delete" on public.invoices for delete
  using (public.is_admin() or public.has_permission('invoices', 'delete'));

alter table public.payments enable row level security;
create policy "payments_read" on public.payments for select
  using (public.is_admin() or public.has_permission('payments', 'view')
    or exists (select 1 from public.invoices i join public.customers c on c.id = i.customer_id where i.id = payments.invoice_id and c.user_id = auth.uid()));
create policy "payments_write" on public.payments for insert
  with check (public.is_admin() or public.has_permission('payments', 'create'));
create policy "payments_update" on public.payments for update
  using (public.is_admin() or public.has_permission('payments', 'create'))
  with check (public.is_admin() or public.has_permission('payments', 'create'));

alter table public.delivery_notes enable row level security;
create policy "delivery_notes_read" on public.delivery_notes for select
  using (public.is_admin() or public.has_permission('orders', 'view'));
create policy "delivery_notes_write" on public.delivery_notes for all
  using (public.is_admin() or public.has_permission('orders', 'edit'))
  with check (public.is_admin() or public.has_permission('orders', 'edit'));

alter table public.discounts enable row level security;
create policy "discounts_read" on public.discounts for select using (true);
create policy "discounts_write" on public.discounts for all
  using (public.is_admin() or public.has_permission('orders', 'edit'))
  with check (public.is_admin() or public.has_permission('orders', 'edit'));

alter table public.sales_returns enable row level security;
create policy "sales_returns_read" on public.sales_returns for select
  using (public.is_admin() or public.has_permission('orders', 'view'));
create policy "sales_returns_write" on public.sales_returns for all
  using (public.is_admin() or public.has_permission('orders', 'edit'))
  with check (public.is_admin() or public.has_permission('orders', 'edit'));
