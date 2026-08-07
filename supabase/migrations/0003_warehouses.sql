-- Warehouses: formalizes the China/Dubai/UK overseas hubs and the Kenya
-- local warehouse that today only exist implicitly as `products.region`
-- strings. RLS uses has_permission() from 0002_roles_permissions.sql.
--
-- Not yet applied to a live project -- same caveat as 0001/0002.

create table if not exists public.warehouses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  city text,
  type text not null check (type in ('overseas', 'local')),
  address text,
  contact text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.warehouses enable row level security;

create policy "warehouses_read" on public.warehouses
  for select using (public.is_admin() or public.has_permission('warehouses', 'view'));

create policy "warehouses_insert" on public.warehouses
  for insert with check (public.is_admin() or public.has_permission('warehouses', 'create'));

create policy "warehouses_update" on public.warehouses
  for update using (public.is_admin() or public.has_permission('warehouses', 'edit'))
  with check (public.is_admin() or public.has_permission('warehouses', 'edit'));

create policy "warehouses_delete" on public.warehouses
  for delete using (public.is_admin() or public.has_permission('warehouses', 'delete'));

insert into public.warehouses (name, country, city, type) values
  ('China Sourcing Hub', 'China', 'Guangzhou', 'overseas'),
  ('Dubai Sourcing Hub', 'UAE', 'Dubai', 'overseas'),
  ('UK Sourcing Hub', 'United Kingdom', 'London', 'overseas'),
  ('Nairobi Warehouse', 'Kenya', 'Nairobi', 'local')
on conflict do nothing;
