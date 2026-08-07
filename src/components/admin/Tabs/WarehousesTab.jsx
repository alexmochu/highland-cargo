"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useWarehouses from "@/hooks/admin/useWarehouses";
import WarehouseModal from "@/components/admin/Modals/WarehouseModal";
import Pagination from "@/components/ui/pagination";

export default function WarehousesTab() {
  const { warehouses, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useWarehouses({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Warehouses</CardTitle>
          <Button className="bg-slate-800 text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />Add Warehouse
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left"><th>Name</th><th>Location</th><th>Type</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {!loading && warehouses.map(w => (
                <tr key={w.id} className="border-t">
                  <td className="py-2">{w.name}</td>
                  <td>{[w.city, w.country].filter(Boolean).join(", ")}</td>
                  <td className="capitalize">{w.type}</td>
                  <td>{w.is_active ? <span className="text-emerald-600">Active</span> : <span className="text-slate-400">Inactive</span>}</td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(w); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(w.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={5}>Loading…</td></tr>}
            </tbody>
          </table>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <WarehouseModal
          isOpen={open}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={addOrUpdate}
          warehouse={editing}
        />
      )}
    </>
  );
}
