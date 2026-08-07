import { useState, useEffect, useCallback } from "react";
import * as svc from "@/services/adminService";
import { toast } from "sonner";

export default function useRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRoles(await svc.fetchRoles());
    } catch (e) {
      toast.error("Unable to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    try {
      await svc.saveRole(vals, editing?.id);
      toast.success(editing ? "Role updated" : "Role created");
      setEditing(null);
      load();
    } catch (e) {
      toast.error("Failed to save role: " + e.message);
    }
  };

  const remove = async (role) => {
    if (role.is_system) return toast.error("System roles cannot be deleted");
    const backup = roles;
    setRoles(prev => prev.filter(r => r.id !== role.id));
    try {
      await svc.deleteRole(role.id);
      toast.success("Role deleted");
    } catch (e) {
      toast.error("Failed to delete role");
      setRoles(backup);
    }
  };

  return { roles, loading, editing, setEditing, addOrUpdate, remove, reload: load };
}
