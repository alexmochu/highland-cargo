"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, LogIn, LogOut } from "lucide-react";
import useHRM from "@/hooks/admin/useHRM";
import EmployeeModal from "@/components/admin/Modals/EmployeeModal";

function SimpleList({ title, items, fields, onAdd, onRemove, renderRow }) {
  const [form, setForm] = useState({});
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td className="py-2">{renderRow(item)}</td>
                <td className="text-right"><Button size="sm" variant="destructive" onClick={() => onRemove(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td className="text-text-3 py-3">None yet.</td></tr>}
          </tbody>
        </table></div>
        <div className="flex gap-2">
          {fields.map(f => (
            <Input key={f.key} placeholder={f.placeholder} type={f.type || "text"} value={form[f.key] || ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
          ))}
          <Button size="sm" variant="outline" onClick={() => { onAdd(form); setForm({}); }}><Plus className="w-4 h-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HRMTab() {
  const hrm = useHRM();
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [leaveForm, setLeaveForm] = useState({ employee_id: "", leave_type_id: "", start_date: "", end_date: "", reason: "" });
  const [payrollForm, setPayrollForm] = useState({ employee_id: "", period_month: "", basic_salary: "", deductions: "0" });

  if (hrm.loading) return <div className="text-center py-12 text-text-3">Loading HRM…</div>;

  const todayStr = new Date().toISOString().slice(0, 10);
  const attendanceToday = (employeeId) => hrm.attendance.find(a => a.employee_id === employeeId && a.attendance_date === todayStr);

  return (
    <Tabs defaultValue="employees">
      <TabsList className="mb-6 flex flex-wrap gap-3 bg-paper-dim p-2 rounded-xl">
        <TabsTrigger value="employees" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Employees</TabsTrigger>
        <TabsTrigger value="attendance" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Attendance</TabsTrigger>
        <TabsTrigger value="leave" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Leave</TabsTrigger>
        <TabsTrigger value="payroll" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Payroll</TabsTrigger>
        <TabsTrigger value="setup" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Setup</TabsTrigger>
      </TabsList>

      <TabsContent value="employees">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Employees</CardTitle>
            <Button className="bg-ink text-white" onClick={() => { setEditingEmployee(null); setEmployeeModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />Add Employee
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
              <thead><tr><th>Name</th><th>Department</th><th>Designation</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {hrm.employeeList.map(e => (
                  <tr key={e.id}>
                    <td className="py-2">{e.full_name}</td>
                    <td>{e.hrm_departments?.name || "-"}</td>
                    <td>{e.hrm_designations?.name || "-"}</td>
                    <td className="capitalize">{e.employment_type.replace("_", " ")}</td>
                    <td>{e.status === "active" ? <span className="text-emerald-600">Active</span> : <span className="text-text-3">Inactive</span>}</td>
                    <td className="flex gap-2 py-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingEmployee(e); setEmployeeModalOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => hrm.removeEmployee(e.id)}><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
                {hrm.employeeList.length === 0 && <tr><td colSpan={6} className="text-text-3 py-4">No employees yet.</td></tr>}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attendance">
        <Card>
          <CardHeader><CardTitle>Today's Attendance</CardTitle></CardHeader>
          <CardContent>
            <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
              <thead><tr><th>Employee</th><th>Check In</th><th>Check Out</th><th>Action</th></tr></thead>
              <tbody>
                {hrm.employeeList.filter(e => e.status === "active").map(e => {
                  const rec = attendanceToday(e.id);
                  return (
                    <tr key={e.id}>
                      <td className="py-2">{e.full_name}</td>
                      <td>{rec?.check_in ? new Date(rec.check_in).toLocaleTimeString() : "-"}</td>
                      <td>{rec?.check_out ? new Date(rec.check_out).toLocaleTimeString() : "-"}</td>
                      <td>
                        {!rec ? (
                          <Button size="sm" className="bg-emerald-600 text-white" onClick={() => hrm.doCheckIn(e.id)}><LogIn className="w-3.5 h-3.5 mr-1" />Check In</Button>
                        ) : !rec.check_out ? (
                          <Button size="sm" variant="outline" onClick={() => hrm.doCheckOut(rec.id)}><LogOut className="w-3.5 h-3.5 mr-1" />Check Out</Button>
                        ) : (
                          <span className="text-text-3 text-xs">Complete</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="leave">
        <Card>
          <CardHeader><CardTitle>Leave Requests</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Select onValueChange={v => setLeaveForm({ ...leaveForm, employee_id: v })} value={leaveForm.employee_id}>
                <SelectTrigger><SelectValue placeholder="Employee" /></SelectTrigger>
                <SelectContent className="bg-white">{hrm.employeeList.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}</SelectContent>
              </Select>
              <Select onValueChange={v => setLeaveForm({ ...leaveForm, leave_type_id: v })} value={leaveForm.leave_type_id}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent className="bg-white">{hrm.leaveTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="date" value={leaveForm.start_date} onChange={e => setLeaveForm({ ...leaveForm, start_date: e.target.value })} />
              <Input type="date" value={leaveForm.end_date} onChange={e => setLeaveForm({ ...leaveForm, end_date: e.target.value })} />
              <Button
                variant="outline"
                onClick={() => { if (leaveForm.employee_id && leaveForm.start_date && leaveForm.end_date) { hrm.requestLeave(leaveForm); setLeaveForm({ employee_id: "", leave_type_id: "", start_date: "", end_date: "", reason: "" }); } }}
              >
                <Plus className="w-4 h-4 mr-1" />Request
              </Button>
            </div>
            <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
              <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {hrm.leaveRequests.map(l => (
                  <tr key={l.id}>
                    <td className="py-2">{l.hrm_employees?.full_name || "-"}</td>
                    <td>{l.hrm_leave_types?.name || "-"}</td>
                    <td>{l.start_date} → {l.end_date}</td>
                    <td className="capitalize">{l.status}</td>
                    <td className="flex gap-2 py-2">
                      {l.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-emerald-600 text-white" onClick={() => hrm.decideLeave(l.id, "approved")}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => hrm.decideLeave(l.id, "rejected")}>Reject</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {hrm.leaveRequests.length === 0 && <tr><td colSpan={5} className="text-text-3 py-4">No leave requests.</td></tr>}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payroll">
        <Card>
          <CardHeader><CardTitle>Payroll</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Select onValueChange={v => setPayrollForm({ ...payrollForm, employee_id: v })} value={payrollForm.employee_id}>
                <SelectTrigger><SelectValue placeholder="Employee" /></SelectTrigger>
                <SelectContent className="bg-white">{hrm.employeeList.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="month" value={payrollForm.period_month} onChange={e => setPayrollForm({ ...payrollForm, period_month: e.target.value })} />
              <Input placeholder="Basic salary" value={payrollForm.basic_salary} onChange={e => setPayrollForm({ ...payrollForm, basic_salary: e.target.value })} />
              <Input placeholder="Deductions" value={payrollForm.deductions} onChange={e => setPayrollForm({ ...payrollForm, deductions: e.target.value })} />
              <Button
                variant="outline"
                onClick={() => {
                  if (!payrollForm.employee_id || !payrollForm.period_month || !payrollForm.basic_salary) return;
                  const basic = Number(payrollForm.basic_salary) || 0;
                  const deductions = Number(payrollForm.deductions) || 0;
                  hrm.addPayroll({
                    employee_id: payrollForm.employee_id,
                    period_month: `${payrollForm.period_month}-01`,
                    basic_salary: basic,
                    deductions,
                    net_pay: basic - deductions,
                  });
                  setPayrollForm({ employee_id: "", period_month: "", basic_salary: "", deductions: "0" });
                }}
              >
                <Plus className="w-4 h-4 mr-1" />Add
              </Button>
            </div>
            <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
              <thead><tr><th>Employee</th><th>Period</th><th>Net Pay</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {hrm.payrollRows.map(p => (
                  <tr key={p.id}>
                    <td className="py-2">{p.hrm_employees?.full_name || "-"}</td>
                    <td>{p.period_month?.slice(0, 7)}</td>
                    <td>{Number(p.net_pay).toLocaleString()}</td>
                    <td className="capitalize">{p.status}</td>
                    <td>{p.status === "pending" && <Button size="sm" className="bg-emerald-600 text-white" onClick={() => hrm.payPayroll(p.id)}>Mark Paid</Button>}</td>
                  </tr>
                ))}
                {hrm.payrollRows.length === 0 && <tr><td colSpan={5} className="text-text-3 py-4">No payroll entries.</td></tr>}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="setup">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SimpleList
            title="Departments" items={hrm.departments}
            fields={[{ key: "name", placeholder: "Department name" }]}
            onAdd={f => f.name && hrm.addDepartment(f.name)}
            onRemove={hrm.removeDepartment}
            renderRow={d => d.name}
          />
          <SimpleList
            title="Designations" items={hrm.designations}
            fields={[{ key: "name", placeholder: "Designation name" }]}
            onAdd={f => f.name && hrm.addDesignation({ name: f.name })}
            onRemove={hrm.removeDesignation}
            renderRow={d => `${d.name}${d.hrm_departments?.name ? ` (${d.hrm_departments.name})` : ""}`}
          />
          <SimpleList
            title="Holidays" items={hrm.holidays}
            fields={[{ key: "name", placeholder: "Holiday name" }, { key: "date", placeholder: "", type: "date" }]}
            onAdd={f => f.name && f.date && hrm.addHoliday(f)}
            onRemove={hrm.removeHoliday}
            renderRow={h => `${h.name} — ${h.date}`}
          />
          <SimpleList
            title="Leave Types" items={hrm.leaveTypes}
            fields={[{ key: "name", placeholder: "Leave type" }, { key: "days_allowed", placeholder: "Days/yr" }]}
            onAdd={f => f.name && hrm.addLeaveType({ name: f.name, days_allowed: Number(f.days_allowed) || 0 })}
            onRemove={hrm.removeLeaveType}
            renderRow={t => `${t.name} (${t.days_allowed} days/yr)`}
          />
        </div>
      </TabsContent>

      {employeeModalOpen && (
        <EmployeeModal
          isOpen={employeeModalOpen}
          onClose={() => { setEmployeeModalOpen(false); setEditingEmployee(null); }}
          onSave={(vals) => hrm.saveEmployee(vals, editingEmployee?.id)}
          employee={editingEmployee}
          departments={hrm.departments}
          designations={hrm.designations}
        />
      )}
    </Tabs>
  );
}
