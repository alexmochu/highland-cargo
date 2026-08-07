"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Truck, Warehouse, Factory } from "lucide-react";
import useAnalytics from "@/hooks/admin/useAnalytics";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a4de6c"];

export default function AnalyticsTab() {
  const { usersCount, shipmentsCount, partnersCount, suppliersCount, trending, byStatus, byCategory, categoriesMap, loading } = useAnalytics();

  const statusData = (byStatus || []).map(s => ({ name: s.status, value: Number(s.count) }));
  const categoryData = (byCategory || []).map(c => ({ name: categoriesMap?.[c.category_id] || "Uncategorized", value: Number(c.count) }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card><CardHeader><CardTitle>Total Users</CardTitle></CardHeader><CardContent className="flex items-center gap-3"><Users className="w-7 h-7 text-blue-600"/><span className="text-3xl font-bold">{loading ? "…" : usersCount}</span></CardContent></Card>

      <Card><CardHeader><CardTitle>Total Shipments</CardTitle></CardHeader><CardContent className="flex items-center gap-3"><Truck className="w-7 h-7 text-orange-600"/><span className="text-3xl font-bold">{loading ? "…" : shipmentsCount}</span></CardContent></Card>

      <Card><CardHeader><CardTitle>Partners</CardTitle></CardHeader><CardContent className="flex items-center gap-3"><Warehouse className="w-7 h-7 text-green-600"/><span className="text-3xl font-bold">{loading ? "…" : partnersCount}</span></CardContent></Card>

      <Card><CardHeader><CardTitle>Suppliers</CardTitle></CardHeader><CardContent className="flex items-center gap-3"><Factory className="w-7 h-7 text-blue-600"/><span className="text-3xl font-bold">{loading ? "…" : suppliersCount}</span></CardContent></Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Trending Products</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {(trending || []).map(t => <li key={t.id}>{t.products?.name || "Unknown"} — score {(Number(t.trend_score) || 0).toFixed(2)}</li>)}
            {(!trending || trending.length === 0) && <li>No trending products</li>}
          </ul>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Shipments by Status</CardTitle></CardHeader>
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
        <CardHeader><CardTitle>Products by Category</CardTitle></CardHeader>
        <CardContent style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} height={60} />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {categoryData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
