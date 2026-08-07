import { useState, useEffect, useCallback } from "react";
import * as hrm from "@/services/hrmService";
import { toast } from "sonner";

export default function useHRM() {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payrollRows, setPayrollRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, des, h, lt, emp, att, lv, pay] = await Promise.all([
        hrm.departments.fetchAll(),
        hrm.designations.fetchAll("*, hrm_departments(name)"),
        hrm.holidays.fetchAll(),
        hrm.leaveTypes.fetchAll(),
        hrm.fetchEmployees(),
        hrm.fetchAttendance(),
        hrm.fetchLeaves(),
        hrm.fetchPayroll(),
      ]);
      setDepartments(d);
      setDesignations(des);
      setHolidays(h);
      setLeaveTypes(lt);
      setEmployeeList(emp);
      setAttendance(att);
      setLeaveRequests(lv);
      setPayrollRows(pay);
    } catch (e) {
      toast.error("Unable to load HRM data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addDepartment = async (name) => { try { await hrm.departments.save({ name }); load(); } catch (e) { toast.error(e.message); } };
  const removeDepartment = async (id) => { try { await hrm.departments.remove(id); load(); } catch (e) { toast.error("Failed to delete"); } };

  const addDesignation = async (vals) => { try { await hrm.designations.save(vals); load(); } catch (e) { toast.error(e.message); } };
  const removeDesignation = async (id) => { try { await hrm.designations.remove(id); load(); } catch (e) { toast.error("Failed to delete"); } };

  const addHoliday = async (vals) => { try { await hrm.holidays.save(vals); load(); } catch (e) { toast.error(e.message); } };
  const removeHoliday = async (id) => { try { await hrm.holidays.remove(id); load(); } catch (e) { toast.error("Failed to delete"); } };

  const addLeaveType = async (vals) => { try { await hrm.leaveTypes.save(vals); load(); } catch (e) { toast.error(e.message); } };
  const removeLeaveType = async (id) => { try { await hrm.leaveTypes.remove(id); load(); } catch (e) { toast.error("Failed to delete"); } };

  const saveEmployee = async (vals, id) => {
    try {
      await hrm.employees.save(vals, id);
      toast.success(id ? "Employee updated" : "Employee added");
      load();
    } catch (e) { toast.error("Failed to save employee: " + e.message); }
  };
  const removeEmployee = async (id) => { try { await hrm.employees.remove(id); toast.success("Employee removed"); load(); } catch (e) { toast.error("Failed to delete"); } };

  const doCheckIn = async (employeeId) => { try { await hrm.checkIn(employeeId); toast.success("Checked in"); load(); } catch (e) { toast.error(e.message); } };
  const doCheckOut = async (attendanceId) => { try { await hrm.checkOut(attendanceId); toast.success("Checked out"); load(); } catch (e) { toast.error(e.message); } };

  const requestLeave = async (vals) => { try { await hrm.leaves.save(vals); toast.success("Leave request created"); load(); } catch (e) { toast.error(e.message); } };
  const decideLeave = async (id, status) => { try { await hrm.setLeaveStatus(id, status); load(); } catch (e) { toast.error(e.message); } };

  const addPayroll = async (vals) => { try { await hrm.payroll.save(vals); toast.success("Payroll entry added"); load(); } catch (e) { toast.error(e.message); } };
  const payPayroll = async (id) => { try { await hrm.markPayrollPaid(id); toast.success("Marked as paid"); load(); } catch (e) { toast.error(e.message); } };

  return {
    departments, designations, holidays, leaveTypes, employeeList, attendance, leaveRequests, payrollRows, loading,
    addDepartment, removeDepartment, addDesignation, removeDesignation, addHoliday, removeHoliday, addLeaveType, removeLeaveType,
    saveEmployee, removeEmployee, doCheckIn, doCheckOut, requestLeave, decideLeave, addPayroll, payPayroll,
  };
}
