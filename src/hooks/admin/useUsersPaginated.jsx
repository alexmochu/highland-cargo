import { useEffect, useState } from "react";
import * as svc from "@/services/adminService";
import { toast } from "sonner";

export default function useUsers({ pageSize = 10 } = {}) {
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const [pList, sList, uRes] = await Promise.all([
        svc.fetchPartners({ page: 1, pageSize: 200 }).then(r => r.data),
        svc.fetchSuppliers({ page: 1, pageSize: 200 }).then(r => r.data),
        svc.fetchUsers({ page: p, pageSize }),
      ]);
      setPartners(pList);
      setSuppliers(sList);
      setUsers(uRes.data);
      setTotal(uRes.count);
    } catch (e) {
      toast.error("Failed to load users");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const addOrUpdate = async (vals) => {
    if (!editing) {
      // For invite use server endpoint
      try {
        await fetch("/api/admin/invite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vals) });
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

  return { users, partners, suppliers, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove, reload: load };
}
