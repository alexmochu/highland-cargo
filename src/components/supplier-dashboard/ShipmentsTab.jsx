"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useShipments } from "@/hooks/supplier/useSupplierData";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";

export default function ShipmentsTab({ supplierId }) {
  const { shipments, reload, loading } = useShipments(supplierId);
  const [selected, setSelected] = useState(null);
  const { profile } = useAuth();

  const changeStatus = async (shipmentId, newStatus) => {
    // use supabase directly for update or create a service API
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { error } = await supabase.from("shipments").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", shipmentId);
      if (error) throw error;
      toast.success("Status updated");
      reload();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Shipments</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th>ID</th><th>Product</th><th>Partner</th><th>Source</th><th>Destination</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && shipments.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="font-mono text-xs">{s.id?.slice(0,8)}</td>
                  <td>{s.products?.name || "-"}</td>
                  <td>{s.partners?.name || "-"}</td>
                  <td>{s.source_location || "-"}</td>
                  <td>{s.destination_location || "-"}</td>
                  <td>{s.status}</td>
                  <td className="flex gap-2">
                    <Button size="sm" onClick={() => setSelected(s)}>View</Button>
                    {/* quick status actions for suppliers */}
                    <Button size="sm" variant="outline" onClick={() => changeStatus(s.id, "Sourcing from Supplier")}>Sourcing</Button>
                    <Button size="sm" variant="ghost" onClick={() => changeStatus(s.id, "In Transit to Kenya")}>In Transit</Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={7}>Loading…</td></tr>}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Shipment {selected.id}</h3>
            <p>Product: {selected.products?.name}</p>
            <p>Partner: {selected.partners?.name}</p>
            <p>Status: {selected.status}</p>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => setSelected(null)} variant="outline">Close</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
