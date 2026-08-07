"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useAgents from "@/hooks/admin/useAgents";
import AgentModal from "@/components/admin/Modals/AgentModal";
import Pagination from "@/components/ui/pagination";

export default function AgentsTab() {
  const { agents, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useAgents({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Agents</CardTitle>
          <Button className="bg-slate-800 text-white" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />Add Agent
          </Button>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Name</th><th>Type</th><th>Contact</th><th>Country</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && agents.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="py-2">{a.name}</td>
                  <td className="capitalize">{a.type.replace("_", " ")}</td>
                  <td>{a.contact_email || a.phone || "-"}</td>
                  <td>{a.country || "-"}</td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(a.id)}><Trash2 className="w-4 h-4" /></Button>
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
        <AgentModal isOpen={open} onClose={() => { setOpen(false); setEditing(null); }} onSave={addOrUpdate} agent={editing} />
      )}
    </>
  );
}
