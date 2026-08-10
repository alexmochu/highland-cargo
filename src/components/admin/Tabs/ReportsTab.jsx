"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, Wallet, DollarSign } from "lucide-react";
import useReports from "@/hooks/admin/useReports";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#1b3a63", "#3d8bfd", "#767e88", "#2c4e7c", "#a8b3c2", "#0e1116"];

function money(amount, currency = "KES") {
  return `${currency} ${Number(amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function ReportStat({ label, value, icon: Icon, negative }) {
  return (
    <div className="bg-surface border border-line px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center border border-line-strong shrink-0">
        <Icon className={`w-4.5 h-4.5 ${negative ? "text-red-600" : "text-freight"}`} strokeWidth={1.75} />
      </div>
      <div>
        <div className={`font-display font-extrabold text-2xl leading-none ${negative ? "text-red-600" : ""}`}>{value}</div>
        <div className="text-[12.5px] text-text-3 mt-1.5">{label}</div>
      </div>
    </div>
  );
}

export default function ReportsTab() {
  const { sales, purchases, expenses, profitLoss, loading } = useReports();

  if (loading) return <div className="text-center py-12 text-text-3">Loading reports…</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportStat label="Revenue collected" value={money(sales?.revenue, sales?.currency)} icon={TrendingUp} />
        <ReportStat label="Purchase spend" value={money(purchases?.totalSpend, purchases?.currency)} icon={ShoppingBag} />
        <ReportStat label="Expenses" value={money(expenses?.total, expenses?.currency)} icon={Wallet} />
        <ReportStat label="Net profit" value={money(profitLoss?.netProfit, profitLoss?.currency)} icon={DollarSign} negative={profitLoss?.netProfit < 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Orders by status</CardTitle></CardHeader>
          <CardContent style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="count" data={sales?.byStatus || []} nameKey="status" outerRadius={90} label>
                  {(sales?.byStatus || []).map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top suppliers by spend</CardTitle></CardHeader>
          <CardContent style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={purchases?.bySupplier || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
                <XAxis dataKey="supplier" angle={-15} textAnchor="end" interval={0} height={60} stroke="var(--color-text-3)" />
                <YAxis allowDecimals={false} stroke="var(--color-text-3)" />
                <Tooltip />
                <Bar dataKey="amount" fill="#1b3a63" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Expenses by category</CardTitle></CardHeader>
          <CardContent>
            <div className="border border-line overflow-x-auto"><table className="hc-table w-full">
              <thead><tr><th>Category</th><th>Amount</th></tr></thead>
              <tbody>
                {(expenses?.byCategory || []).map(c => (
                  <tr key={c.category}>
                    <td className="py-2">{c.category}</td>
                    <td>{money(c.amount, expenses.currency)}</td>
                  </tr>
                ))}
                {(!expenses?.byCategory || expenses.byCategory.length === 0) && (
                  <tr><td colSpan={2} className="text-text-3 py-4">No expenses recorded yet.</td></tr>
                )}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
