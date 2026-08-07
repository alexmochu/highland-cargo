-- Phase 3: purchasing (buying goods from suppliers to fulfil orders) and
-- warehouse inventory (movements, transfers between warehouses, adjustments).
--
-- Not yet applied to a live project -- same caveat as prior migrations.

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  purchase_number text not null unique,
  supplier_id uuid references public.suppliers(id) on delete set null,
  warehouse_id uuid references public.warehouses(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'received', 'cancelled')),
  subtotal numeric not null default 0,
  total numeric not null default 0,
  currency text not null default 'KES',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text not null,
  quantity numeric not null default 1,
  unit_cost numeric not null default 0,
  line_total numeric not null default 0
);

create table if not exists public.purchase_returns (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  reason text,
  amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Append-only ledger. `quantity` is always the *signed* effect on stock at
-- that warehouse (positive for in/transfer_in, negative for
-- out/transfer_out, either sign for a manual adjustment), so stock on hand
-- is simply sum(quantity) grouped by warehouse/product -- see the
-- `stock_levels` view below. `reference_type`/`reference_id` point at the
-- purchase, stock_transfer or stock_adjustment row that caused the movement.
create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  movement_type text not null check (movement_type in ('in', 'out', 'transfer_in', 'transfer_out', 'adjustment')),
  quantity numeric not null,
  reference_type text,
  reference_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_transfers (
  id uuid primary key default gen_random_uuid(),
  transfer_number text not null unique,
  from_warehouse_id uuid references public.warehouses(id) on delete set null,
  to_warehouse_id uuid references public.warehouses(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'in_transit', 'completed', 'cancelled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_transfer_items (
  id uuid primary key default gen_random_uuid(),
  stock_transfer_id uuid not null references public.stock_transfers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity numeric not null
);

create table if not exists public.stock_adjustments (
  id uuid primary key default gen_random_uuid(),
  adjustment_number text not null unique,
  warehouse_id uuid references public.warehouses(id) on delete set null,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_adjustment_items (
  id uuid primary key default gen_random_uuid(),
  stock_adjustment_id uuid not null references public.stock_adjustments(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity_change numeric not null,
  notes text
);

-- Stock on hand per warehouse/product, derived from the movements ledger.
-- security_invoker so the view is subject to the querying role's RLS on
-- inventory_movements rather than the view owner's.
create or replace view public.stock_levels
with (security_invoker = true) as
select
  warehouse_id,
  product_id,
  sum(quantity) as quantity_on_hand
from public.inventory_movements
group by warehouse_id, product_id;

-- ---------------------------------------------------------------------------
-- RLS: staff via has_permission('purchases'|'inventory', action).
-- ---------------------------------------------------------------------------
alter table public.purchases enable row level security;
create policy "purchases_read" on public.purchases for select using (public.is_admin() or public.has_permission('purchases', 'view'));
create policy "purchases_insert" on public.purchases for insert with check (public.is_admin() or public.has_permission('purchases', 'create'));
create policy "purchases_update" on public.purchases for update using (public.is_admin() or public.has_permission('purchases', 'edit')) with check (public.is_admin() or public.has_permission('purchases', 'edit'));
create policy "purchases_delete" on public.purchases for delete using (public.is_admin() or public.has_permission('purchases', 'delete'));

alter table public.purchase_items enable row level security;
create policy "purchase_items_read" on public.purchase_items for select using (public.is_admin() or public.has_permission('purchases', 'view'));
create policy "purchase_items_write" on public.purchase_items for all
  using (public.is_admin() or public.has_permission('purchases', 'edit'))
  with check (public.is_admin() or public.has_permission('purchases', 'edit'));

alter table public.purchase_returns enable row level security;
create policy "purchase_returns_read" on public.purchase_returns for select using (public.is_admin() or public.has_permission('purchases', 'view'));
create policy "purchase_returns_write" on public.purchase_returns for all
  using (public.is_admin() or public.has_permission('purchases', 'edit'))
  with check (public.is_admin() or public.has_permission('purchases', 'edit'));

alter table public.inventory_movements enable row level security;
create policy "inventory_movements_read" on public.inventory_movements for select using (public.is_admin() or public.has_permission('inventory', 'view'));
create policy "inventory_movements_insert" on public.inventory_movements for insert with check (public.is_admin() or public.has_permission('inventory', 'create'));

alter table public.stock_transfers enable row level security;
create policy "stock_transfers_read" on public.stock_transfers for select using (public.is_admin() or public.has_permission('inventory', 'view'));
create policy "stock_transfers_write" on public.stock_transfers for all
  using (public.is_admin() or public.has_permission('inventory', 'edit'))
  with check (public.is_admin() or public.has_permission('inventory', 'edit'));

alter table public.stock_transfer_items enable row level security;
create policy "stock_transfer_items_read" on public.stock_transfer_items for select using (public.is_admin() or public.has_permission('inventory', 'view'));
create policy "stock_transfer_items_write" on public.stock_transfer_items for all
  using (public.is_admin() or public.has_permission('inventory', 'edit'))
  with check (public.is_admin() or public.has_permission('inventory', 'edit'));

alter table public.stock_adjustments enable row level security;
create policy "stock_adjustments_read" on public.stock_adjustments for select using (public.is_admin() or public.has_permission('inventory', 'view'));
create policy "stock_adjustments_write" on public.stock_adjustments for all
  using (public.is_admin() or public.has_permission('inventory', 'edit'))
  with check (public.is_admin() or public.has_permission('inventory', 'edit'));

alter table public.stock_adjustment_items enable row level security;
create policy "stock_adjustment_items_read" on public.stock_adjustment_items for select using (public.is_admin() or public.has_permission('inventory', 'view'));
create policy "stock_adjustment_items_write" on public.stock_adjustment_items for all
  using (public.is_admin() or public.has_permission('inventory', 'edit'))
  with check (public.is_admin() or public.has_permission('inventory', 'edit'));
