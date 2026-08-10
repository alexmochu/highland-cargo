"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, Wallet, DollarSign } from "lucide-react";
import useReports from "@/hooks/admin/useReports";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a4de6c"];

function money(amount, currency = "KES") {
  return `${currency} ${Number(amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function ReportsTab() {
  const { sales, purchases, expenses, profitLoss, loading } = useReports();

  if (loading) return <div className="text-center py-12 text-text-3">Loading reports…</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm text-text-3">Revenue Collected</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span className="text-2xl font-bold">{money(sales?.revenue, sales?.currency)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-text-3">Purchase Spend</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold">{money(purchases?.totalSpend, purchases?.currency)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-text-3">Expenses</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-freight" />
            <span className="text-2xl font-bold">{money(expenses?.total, expenses?.currency)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-text-3">Net Profit</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-3">
            <DollarSign className={`w-6 h-6 ${profitLoss?.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`} />
            <span className={`text-2xl font-bold ${profitLoss?.netProfit >= 0 ? "" : "text-red-600"}`}>{money(profitLoss?.netProfit, profitLoss?.currency)}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Orders by Status</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Top Suppliers by Spend</CardTitle></CardHeader>
          <CardContent style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={purchases?.bySupplier || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="supplier" angle={-15} textAnchor="end" interval={0} height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            <table className="min-w-full text-sm">
              <thead><tr className="text-left"><th>Category</th><th>Amount</th></tr></thead>
              <tbody>
                {(expenses?.byCategory || []).map(c => (
                  <tr key={c.category} className="border-t">
                    <td className="py-2">{c.category}</td>
                    <td>{money(c.amount, expenses.currency)}</td>
                  </tr>
                ))}
                {(!expenses?.byCategory || expenses.byCategory.length === 0) && (
                  <tr><td colSpan={2} className="text-text-3 py-4">No expenses recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
