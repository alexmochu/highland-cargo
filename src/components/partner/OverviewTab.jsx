// components/partner/OverviewTab.jsx
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as svc from "@/services/partnerService";
import { Warehouse, Truck } from "lucide-react";
import { toast } from "sonner";

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="bg-surface border border-line px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center border border-line-strong shrink-0">
        <Icon className="w-4.5 h-4.5 text-freight" strokeWidth={1.75} />
      </div>
      <div>
        <div className="font-display font-extrabold text-2xl leading-none">{value}</div>
        <div className="text-[12.5px] text-text-3 mt-1.5">{label}</div>
      </div>
    </div>
  );
}

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Stat icon={Truck} value={counts.total} label="Total shipments" />
      <Stat icon={Warehouse} value={counts.delivered} label="Delivered" />

      <Card className="sm:col-span-2">
        <CardHeader><CardTitle>Recent shipments</CardTitle></CardHeader>
        <CardContent>
          {recent.length > 0 ? (
            <ul className="divide-y divide-line -my-5">
              {recent.map(s => (
                <li key={s.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">{s.products?.name || s.product_id}</div>
                    <div className="text-xs text-text-3 mt-0.5">{s.status}</div>
                  </div>
                  <div className="font-manifest text-xs text-text-3 shrink-0">{new Date(s.created_at).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-3">No recent shipments.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
