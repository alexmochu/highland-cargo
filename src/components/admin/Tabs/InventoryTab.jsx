"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useStockLevels from "@/hooks/admin/useStockLevels";

export default function InventoryTab() {
  const { levels, loading } = useStockLevels();

  return (
    <Card>
      <CardHeader><CardTitle>Stock on Hand</CardTitle></CardHeader>
      <CardContent>
        <table className="min-w-full text-sm">
          <thead><tr className="text-left"><th>Product</th><th>Warehouse</th><th>Quantity</th></tr></thead>
          <tbody>
            {!loading && levels.map((l, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2">{l.products?.name || "-"}</td>
                <td>{l.warehouses?.name || "-"}</td>
                <td className={Number(l.quantity_on_hand) <= 0 ? "text-red-500 font-semibold" : ""}>{l.quantity_on_hand}</td>
              </tr>
            ))}
            {loading && <tr><td colSpan={3}>Loading…</td></tr>}
            {!loading && levels.length === 0 && <tr><td colSpan={3} className="text-text-3 py-4">No stock movements recorded yet.</td></tr>}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
