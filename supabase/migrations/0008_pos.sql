-- Phase 5: POS terminal for the physical shop counter. Reuses the Phase 2
-- sales-to-cash primitives (orders/order_items/invoices/payments) rather
-- than a parallel schema -- a POS sale is just an order created through a
-- faster UI, tagged with the register it was rung up on.
--
-- Not yet applied to a live project -- same caveat as prior migrations.

create table if not exists public.registers (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid references public.warehouses(id) on delete set null,
  name text not null,
  opening_float numeric not null default 0,
  opened_by uuid references auth.users(id) on delete set null,
  opened_at timestamptz not null default now(),
  closing_amount numeric,
  closed_by uuid references auth.users(id) on delete set null,
  closed_at timestamptz,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists register_id uuid references public.registers(id) on delete set null;

alter table public.registers enable row level security;
create policy "registers_read" on public.registers for select using (public.is_admin() or public.has_permission('pos', 'view'));
create policy "registers_insert" on public.registers for insert with check (public.is_admin() or public.has_permission('pos', 'create'));
create policy "registers_update" on public.registers for update
  using (public.is_admin() or public.has_permission('pos', 'create'))
  with check (public.is_admin() or public.has_permission('pos', 'create'));
