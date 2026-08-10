"use client";
import React from "react";
import { Warehouse, Truck } from "lucide-react";
import { useShipments, useProducts } from "@/hooks/supplier/useSupplierData";

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

export default function OverviewTab({ supplierId }) {
  const { shipments } = useShipments(supplierId);
  const { products } = useProducts(supplierId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Stat icon={Warehouse} value={products?.length ?? 0} label="Products listed" />
      <Stat icon={Truck} value={shipments?.length ?? 0} label="Recent shipments" />
    </div>
  );
}
