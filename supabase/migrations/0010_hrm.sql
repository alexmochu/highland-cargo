-- Phase 8: HRM for Highland Cargo's ops/warehouse/shop staff -- departments,
-- designations, an employee roster, attendance, leave, holidays and payroll.
-- Adapted from everland's hrm_* table set (attendance/departments/
-- designations/holidays/leaves/leave_types/payroll), dropping
-- hrm_sales_targets/hrm_settings as retail-POS-specific and not relevant
-- to a freight-forwarder.
--
-- Not yet applied to a live project -- same caveat as prior migrations.

create table if not exists public.hrm_departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.hrm_designations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department_id uuid references public.hrm_departments(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.hrm_employees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  department_id uuid references public.hrm_departments(id) on delete set null,
  designation_id uuid references public.hrm_designations(id) on delete set null,
  employment_type text not null default 'full_time' check (employment_type in ('full_time', 'part_time', 'contract')),
  salary numeric,
  hire_date date,
  status text not null default 'active' check (status in ('active', 'inactive')),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.hrm_holidays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.hrm_leave_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  days_allowed numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.hrm_leaves (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.hrm_employees(id) on delete cascade,
  leave_type_id uuid references public.hrm_leave_types(id) on delete set null,
  start_date date not null,
  end_date date not null,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.hrm_attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.hrm_employees(id) on delete cascade,
  attendance_date date not null default current_date,
  check_in timestamptz,
  check_out timestamptz,
  status text not null default 'present' check (status in ('present', 'absent', 'late')),
  created_at timestamptz not null default now(),
  unique (employee_id, attendance_date)
);

create table if not exists public.hrm_payroll (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.hrm_employees(id) on delete cascade,
  period_month date not null,
  basic_salary numeric not null default 0,
  deductions numeric not null default 0,
  net_pay numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS: staff via has_permission('hrm', action). No self-service employee
-- portal yet -- these tables are HR/management-only for now.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['hrm_departments', 'hrm_designations', 'hrm_employees', 'hrm_holidays', 'hrm_leave_types', 'hrm_leaves', 'hrm_attendance', 'hrm_payroll']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%s_read" on public.%I for select using (public.is_admin() or public.has_permission(''hrm'', ''view''))', t, t);
    execute format('create policy "%s_insert" on public.%I for insert with check (public.is_admin() or public.has_permission(''hrm'', ''create''))', t, t);
    execute format('create policy "%s_update" on public.%I for update using (public.is_admin() or public.has_permission(''hrm'', ''edit'')) with check (public.is_admin() or public.has_permission(''hrm'', ''edit''))', t, t);
    execute format('create policy "%s_delete" on public.%I for delete using (public.is_admin() or public.has_permission(''hrm'', ''delete''))', t, t);
  end loop;
end $$;
