import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/expensesCrmService";
import { toast } from "sonner";

export default function useContactGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setGroups(await svc.fetchContactGroups());
    } catch (e) {
      toast.error("Unable to load contact groups.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveContactGroup(vals, editing?.id);
      toast.success(editing ? "Group updated" : "Group created");
      setEditing(null);
      load();
    } catch (e) { toast.error("Failed to save group: " + e.message); }
  };

  const remove = async (id) => {
    const backup = groups;
    setGroups(prev => prev.filter(g => g.id !== id));
    try {
      await svc.deleteContactGroup(id);
      toast.success("Group removed");
    } catch (e) {
      toast.error("Failed to delete group");
      setGroups(backup);
    }
  };

  return { groups, loading, editing, setEditing, addOrUpdate, remove };
}
