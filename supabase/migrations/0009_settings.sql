-- Phase 7: settings. `business_settings` and `invoice_settings` are
-- singleton tables (a single row holding the whole app's config, upserted
-- in place) -- simpler than a key/value settings table for the handful of
-- fields actually needed here. `tax_rates` is a normal list.
--
-- Not yet applied to a live project -- same caveat as prior migrations.

create table if not exists public.business_settings (
  id boolean primary key default true,
  company_name text not null default 'Highland Cargo Africa',
  address text,
  phone text,
  email text,
  currency text not null default 'KES',
  logo_url text,
  updated_at timestamptz not null default now(),
  constraint business_settings_singleton check (id)
);
insert into public.business_settings (id) values (true) on conflict (id) do nothing;

create table if not exists public.invoice_settings (
  id boolean primary key default true,
  invoice_prefix text not null default 'INV',
  due_days_default integer not null default 14,
  footer_note text,
  updated_at timestamptz not null default now(),
  constraint invoice_settings_singleton check (id)
);
insert into public.invoice_settings (id) values (true) on conflict (id) do nothing;

create table if not exists public.tax_rates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rate_percent numeric not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.business_settings enable row level security;
create policy "business_settings_read" on public.business_settings for select using (public.is_admin() or public.has_permission('settings', 'view'));
create policy "business_settings_write" on public.business_settings for update
  using (public.is_admin() or public.has_permission('settings', 'edit'))
  with check (public.is_admin() or public.has_permission('settings', 'edit'));

alter table public.invoice_settings enable row level security;
create policy "invoice_settings_read" on public.invoice_settings for select using (public.is_admin() or public.has_permission('settings', 'view'));
create policy "invoice_settings_write" on public.invoice_settings for update
  using (public.is_admin() or public.has_permission('settings', 'edit'))
  with check (public.is_admin() or public.has_permission('settings', 'edit'));

alter table public.tax_rates enable row level security;
create policy "tax_rates_read" on public.tax_rates for select using (public.is_admin() or public.has_permission('settings', 'view'));
create policy "tax_rates_write" on public.tax_rates for all
  using (public.is_admin() or public.has_permission('settings', 'edit'))
  with check (public.is_admin() or public.has_permission('settings', 'edit'));
