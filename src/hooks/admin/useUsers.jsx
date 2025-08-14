import { useEffect, useState } from "react";
import { fetchUsers, saveUserProfile, deleteUserProfile } from "@/services/adminService";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const handleSave = async (userData) => {
    await saveUser(userData, editingUser?.id);
    setEditingUser(null);
    loadUsers();
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  return {
    users,
    editingUser,
    setEditingUser,
    handleSave,
    handleDelete,
  };
}
