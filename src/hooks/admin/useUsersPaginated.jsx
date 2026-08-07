import { useCallback, useEffect, useState } from "react";
import * as svc from "@/services/adminService";
import { toast } from "sonner";

export default function useUsers({ pageSize = 10 } = {}) {
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [pList, sList, rList, uRes] = await Promise.all([
        svc.fetchPartners({ page: 1, pageSize: 200 }).then(r => r.data),
        svc.fetchSuppliers({ page: 1, pageSize: 200 }).then(r => r.data),
        svc.fetchRoles(),
        svc.fetchUsers({ page: p, pageSize }),
      ]);
      setPartners(pList);
      setSuppliers(sList);
      setRoles(rList);
      setUsers(uRes.data);
      setTotal(uRes.count);
    } catch (e) {
      toast.error("Failed to load users");
    } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  const addOrUpdate = async (vals) => {
    if (!editing) {
      // For invite use server endpoint
      try {
        const res = await fetch("/api/invite-user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vals) });
        if (!res.ok) throw new Error(await res.text());
        toast.success("Invite sent");
        load(1);
      } catch (e) {
        toast.error("Failed to invite user");
      }
    } else {
      const backup = users;
      setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...vals } : u));
      try {
        await svc.saveUserProfile(vals, editing.id);
        toast.success("User updated");
        setEditing(null);
        load(page);
      } catch (e) {
        toast.error("Failed to update user");
        setUsers(backup);
      }
    }
  };

  const remove = async (id) => {
    const backup = users;
    setUsers(prev => prev.filter(u => u.id !== id));
    try {
      await svc.deleteUserProfile(id);
      toast.success("User deleted");
      load(page);
    } catch (e) {
      toast.error("Failed to delete user");
      setUsers(backup);
    }
  };

  return { users, partners, suppliers, roles, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove, reload: load };
}
