import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/expensesCrmService";
import { toast } from "sonner";

export default function useAgents({ pageSize = 10 } = {}) {
  const [agents, setAgents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const { data, count } = await svc.fetchAgents({ page: p, pageSize });
      setAgents(data);
      setTotal(count);
    } catch (e) {
      toast.error("Unable to load agents.");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveAgent(vals, editing?.id);
      toast.success(editing ? "Agent updated" : "Agent added");
      setEditing(null);
      load(editing ? page : 1);
    } catch (e) { toast.error("Failed to save agent: " + e.message); }
  };

  const remove = async (id) => {
    const backup = agents;
    setAgents(prev => prev.filter(a => a.id !== id));
    try {
      await svc.deleteAgent(id);
      toast.success("Agent removed");
    } catch (e) {
      toast.error("Failed to delete agent");
      setAgents(backup);
    }
  };

  return { agents, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove };
}
