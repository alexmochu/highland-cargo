"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Truck, Warehouse, Factory } from "lucide-react";
import useAnalytics from "@/hooks/admin/useAnalytics";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["#1b3a63", "#3d8bfd", "#767e88", "#2c4e7c", "#a8b3c2", "#0e1116"];

function StatCard({ label, value, icon: Icon, loading }) {
  return (
    <div className="relative bg-surface border border-line px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center border border-line-strong shrink-0">
        <Icon className="w-4.5 h-4.5 text-freight" strokeWidth={1.75} />
      </div>
      <div>
        <div className="font-display font-extrabold text-2xl leading-none">{loading ? "…" : value}</div>
        <div className="text-[12.5px] text-text-3 mt-1.5">{label}</div>
      </div>
    </div>
  );
}

export default function AnalyticsTab() {
  const { usersCount, shipmentsCount, partnersCount, suppliersCount, trending, byStatus, byCategory, categoriesMap, loading } = useAnalytics();

  const statusData = (byStatus || []).map(s => ({ name: s.status, value: Number(s.count) }));
  const categoryData = (byCategory || []).map(c => ({ name: categoriesMap?.[c.category_id] || "Uncategorized", value: Number(c.count) }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <StatCard label="Total users" value={usersCount} icon={Users} loading={loading} />
      <StatCard label="Total shipments" value={shipmentsCount} icon={Truck} loading={loading} />
      <StatCard label="Partners" value={partnersCount} icon={Warehouse} loading={loading} />
      <StatCard label="Suppliers" value={suppliersCount} icon={Factory} loading={loading} />

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Trending products</CardTitle></CardHeader>
        <CardContent>
          {(trending && trending.length > 0) ? (
            <ul className="divide-y divide-line -my-5">
              {trending.map(t => (
                <li key={t.id} className="flex items-center justify-between py-3">
                  <span className="text-sm">{t.products?.name || "Unknown"}</span>
                  <span className="font-manifest text-xs text-text-3">score {(Number(t.trend_score) || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-3">No trending products yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Shipments by status</CardTitle></CardHeader>
        <CardContent style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={statusData} outerRadius={100} label>
                {statusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Products by category</CardTitle></CardHeader>
        <CardContent style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} height={60} stroke="var(--color-text-3)" />
              <YAxis allowDecimals={false} stroke="var(--color-text-3)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#1b3a63">
                {categoryData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
