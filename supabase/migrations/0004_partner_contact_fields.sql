-- The existing `partners` table only carried `name` (per PartnerModal.jsx
-- before this change). The new partner-onboarding flow (replacing the
-- "Coming Soon" stub at /partner-onboarding) collects country/contact
-- details, so add the columns it writes to, mirroring the equivalent
-- columns already in use on `suppliers` (location/contact_email/phone).
--
-- Not yet applied to a live project -- same caveat as prior migrations.

alter table public.partners add column if not exists country text;
alter table public.partners add column if not exists contact_email text;
alter table public.partners add column if not exists phone text;
alter table public.partners add column if not exists preferred_region text;
