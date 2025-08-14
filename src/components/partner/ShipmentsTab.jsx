// components/partner/ShipmentsTab.jsx
"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import usePartnerShipments from "@/hooks/partner/usePartnerShipments";
import Pagination from "@/components/partner/Pagination";
import ShipmentDetailModal from "@/components/partner/ShipmentDetailModal";
import { Button } from "@/components/ui/button";

export default function ShipmentsTab({ partnerId, partnerProfile }) {
  const { shipments, loading, page, setPage, total, pageSize, reload } = usePartnerShipments(partnerId, { pageSize: 10 });
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Card>
        <CardHeader><CardTitle>Shipments</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left"><th>ID</th><th>Product</th><th>Status</th><th>Created</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {!loading && shipments.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="font-mono text-xs">{s.id?.slice(0,8)}</td>
                    <td>{s.products?.name || s.product_id}</td>
                    <td>{s.status}</td>
                    <td>{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="flex gap-2">
                      <Button size="sm" onClick={() => setSelected(s)}>View</Button>
                    </td>
                  </tr>
                ))}
                {loading && <tr><td colSpan={5}>Loading…</td></tr>}
              </tbody>
            </table>
          </div>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {selected && <ShipmentDetailModal shipment={selected} onClose={() => { setSelected(null); reload(); }} partnerProfile={partnerProfile} />}
    </>
  );
}
