// components/partner/OverviewTab.jsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as svc from "@/services/partnerService";
import { Warehouse, Truck } from "lucide-react";
import { toast } from "sonner";

export default function OverviewTab({ partnerId }) {
  const [recent, setRecent] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, delivered: 0 });

  useEffect(() => {
    if (!partnerId) return;
    (async () => {
      try {
        const rec = await svc.fetchRecentShipmentsForPartner(partnerId, 5);
        setRecent(rec);
        // quick counts
        const all = await svc.fetchShipmentsForPartner(partnerId, { page: 1, pageSize: 1000 });
        const total = all.count || all.data?.length || 0;
        const pending = (all.data || []).filter(s => s.status && s.status !== "Delivered").length;
        const delivered = (all.data || []).filter(s => s.status === "Delivered").length;
        setCounts({ total, pending, delivered });
      } catch (e) {
        console.error(e);
        toast.error("Failed to load overview");
      }
    })();
  }, [partnerId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Total Shipments</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-3xl font-bold">{counts.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Delivered</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Warehouse className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-3xl font-bold">{counts.delivered}</div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2">
        <CardHeader><CardTitle>Recent Shipments</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recent.map(s => (
              <li key={s.id} className="border rounded p-2">
                <div className="flex justify-between">
                  <div className="font-medium">{s.products?.name || s.product_id}</div>
                  <div className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-muted-foreground">Status: {s.status}</div>
              </li>
            ))}
            {recent.length === 0 && <li className="text-sm text-muted-foreground">No recent shipments</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
