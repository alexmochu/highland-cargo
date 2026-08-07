-- Baseline Row Level Security policies for Highland Cargo.
--
-- WHY THIS FILE EXISTS
-- The application code (adminService.js, supplierService.js, partnerService.js,
-- and every admin/supplier/partner dashboard hook) queries Postgres directly
-- from the browser using the anon key. That is a legitimate pattern *only* if
-- RLS enforces who can read/write which rows -- and this repo had no
-- migrations directory, so those policies weren't version-controlled,
-- reviewable, or (from a code audit) verifiable at all.
--
-- This migration is a best-effort baseline reconstructed from how the
-- application code actually queries each table. It has NOT been run against
-- the live project and the exact column set/types are inferred, not
-- confirmed from a live schema dump.
--
-- BEFORE APPLYING: run `supabase db diff` / compare against the live schema,
-- adjust any column names that don't match, and apply via the Supabase CLI
-- or SQL editor -- do not assume this is a drop-in replacement for whatever
-- policies (if any) already exist in production.

-- ---------------------------------------------------------------------------
-- Helper: is the current JWT's user an admin?
-- security definer so it can read `profiles` even though profiles itself
-- is locked down below (avoids recursive policy evaluation).
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where user_id = auth.uid()),
    false
  );
$$;

create or replace function public.current_supplier_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select supplier_id from public.profiles where user_id = auth.uid();
$$;

create or replace function public.current_partner_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select partner_id from public.profiles where user_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- Each user can read/update their own row. Admins can do anything.
-- Self-insert is allowed so the sync-profile flow / choose-role page can
-- create and update the caller's own row; role escalation (is_admin) should
-- ultimately be locked down via a trigger or column-level grant if
-- self-update of `is_admin`/`role` needs to be prevented client-side.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (user_id = auth.uid() or public.is_admin());

create policy "profiles_insert_own" on public.profiles
  for insert with check (user_id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin" on public.profiles
  for update using (user_id = auth.uid() or public.is_admin());

create policy "profiles_delete_admin_only" on public.profiles
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Public catalog: product_categories, products, product_images, product_pricing
-- Readable by anyone (this is a public storefront). Writes are limited to
-- admins and the supplier team that owns the product.
-- ---------------------------------------------------------------------------
alter table public.product_categories enable row level security;
create policy "categories_public_read" on public.product_categories for select using (true);
create policy "categories_admin_write" on public.product_categories for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.products enable row level security;
create policy "products_public_read" on public.products for select using (true);
create policy "products_owner_or_admin_write" on public.products for all
  using (public.is_admin() or supplier_id = public.current_supplier_id())
  with check (public.is_admin() or supplier_id = public.current_supplier_id());

alter table public.product_images enable row level security;
create policy "product_images_public_read" on public.product_images for select using (true);
create policy "product_images_owner_or_admin_write" on public.product_images for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.supplier_id = public.current_supplier_id()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.supplier_id = public.current_supplier_id()
    )
  );

alter table public.product_pricing enable row level security;
create policy "product_pricing_public_read" on public.product_pricing for select using (true);
create policy "product_pricing_owner_or_admin_write" on public.product_pricing for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_pricing.product_id and p.supplier_id = public.current_supplier_id()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_pricing.product_id and p.supplier_id = public.current_supplier_id()
    )
  );

-- ---------------------------------------------------------------------------
-- suppliers: name is shown publicly on product cards, so allow public read
-- of the row (tighten to a public view exposing only `name` if onboarding
-- fields like bank details end up on this table). Writes: admin only, plus
-- a supplier's own team can update their own row.
-- ---------------------------------------------------------------------------
alter table public.suppliers enable row level security;
create policy "suppliers_public_read" on public.suppliers for select using (true);
create policy "suppliers_admin_write" on public.suppliers for all
  using (public.is_admin()) with check (public.is_admin());
create policy "suppliers_self_update" on public.suppliers for update
  using (id = public.current_supplier_id())
  with check (id = public.current_supplier_id());

-- ---------------------------------------------------------------------------
-- partners: not shown publicly -- only admins and the partner's own linked
-- users can see their row.
-- ---------------------------------------------------------------------------
alter table public.partners enable row level security;
create policy "partners_self_or_admin_read" on public.partners for select
  using (public.is_admin() or id = public.current_partner_id());
create policy "partners_admin_write" on public.partners for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- shipments: visible only to the supplier/partner involved, or admin.
-- ---------------------------------------------------------------------------
alter table public.shipments enable row level security;
create policy "shipments_participant_or_admin_read" on public.shipments for select
  using (
    public.is_admin()
    or supplier_id = public.current_supplier_id()
    or partner_id = public.current_partner_id()
  );
create policy "shipments_admin_write" on public.shipments for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- messages: visible only to the sender or the supplier/partner counterpart.
-- ---------------------------------------------------------------------------
alter table public.messages enable row level security;
create policy "messages_participant_or_admin_read" on public.messages for select
  using (
    public.is_admin()
    or sender_id = auth.uid()
    or supplier_id = public.current_supplier_id()
  );
create policy "messages_participant_insert" on public.messages for insert
  with check (sender_id = auth.uid());

-- ---------------------------------------------------------------------------
-- team membership tables: admin only, plus a user can see their own row.
-- ---------------------------------------------------------------------------
alter table public.supplier_team_members enable row level security;
create policy "supplier_team_self_or_admin_read" on public.supplier_team_members for select
  using (public.is_admin() or user_id = auth.uid() or supplier_id = public.current_supplier_id());
create policy "supplier_team_admin_write" on public.supplier_team_members for all
  using (public.is_admin()) with check (public.is_admin());

alter table public.admin_team_members enable row level security;
create policy "admin_team_admin_only" on public.admin_team_members for all
  using (public.is_admin()) with check (public.is_admin());
