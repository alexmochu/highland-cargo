// services/hrmService.js -- Phase 8 HRM (departments, designations,
// employees, attendance, leave, holidays, payroll).
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

function crud(table, defaultOrder = "created_at") {
  return {
    fetchAll: async (select = "*") => {
      const { data, error } = await supabase.from(table).select(select).order(defaultOrder);
      if (error) throw error;
      return data || [];
    },
    save: async (vals, id) => {
      if (id) {
        const { error } = await supabase.from(table).update(vals).eq("id", id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from(table).insert([vals]);
      if (error) throw error;
    },
    remove: async (id) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
  };
}

export const departments = crud("hrm_departments", "name");
export const designations = crud("hrm_designations", "name");
export const holidays = crud("hrm_holidays", "date");
export const leaveTypes = crud("hrm_leave_types", "name");

export async function fetchEmployees() {
  const { data, error } = await supabase
    .from("hrm_employees")
    .select("*, hrm_departments(name), hrm_designations(name)")
    .order("full_name");
  if (error) throw error;
  return data || [];
}
export const employees = { ...crud("hrm_employees", "full_name"), fetchAll: fetchEmployees };

export async function fetchAttendance() {
  const { data, error } = await supabase
    .from("hrm_attendance")
    .select("*, hrm_employees(full_name)")
    .order("attendance_date", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data || [];
}
export async function checkIn(employeeId) {
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from("hrm_attendance").upsert(
    [{ employee_id: employeeId, attendance_date: today, check_in: new Date().toISOString(), status: "present" }],
    { onConflict: "employee_id,attendance_date" }
  );
  if (error) throw error;
}
export async function checkOut(attendanceId) {
  const { error } = await supabase.from("hrm_attendance").update({ check_out: new Date().toISOString() }).eq("id", attendanceId);
  if (error) throw error;
}

export async function fetchLeaves() {
  const { data, error } = await supabase
    .from("hrm_leaves")
    .select("*, hrm_employees(full_name), hrm_leave_types(name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
export const leaves = { ...crud("hrm_leaves"), fetchAll: fetchLeaves };
export async function setLeaveStatus(id, status) {
  const { error } = await supabase.from("hrm_leaves").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function fetchPayroll() {
  const { data, error } = await supabase
    .from("hrm_payroll")
    .select("*, hrm_employees(full_name)")
    .order("period_month", { ascending: false });
  if (error) throw error;
  return data || [];
}
export const payroll = { ...crud("hrm_payroll"), fetchAll: fetchPayroll };
export async function markPayrollPaid(id) {
  const { error } = await supabase.from("hrm_payroll").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}
