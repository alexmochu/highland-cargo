"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Warehouse, Truck } from "lucide-react";
import { useShipments, useProducts } from "@/hooks/supplier/useSupplierData";

export default function OverviewTab({ supplierId }) {
  const { shipments } = useShipments(supplierId);
  const { products } = useProducts(supplierId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Products</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Warehouse className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-3xl font-bold">{products?.length ?? 0}</div>
              <div className="text-sm text-muted-foreground">Products listed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Shipments</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-orange-600" />
            <div>
              <div className="text-3xl font-bold">{shipments?.length ?? 0}</div>
              <div className="text-sm text-muted-foreground">Recent shipments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
