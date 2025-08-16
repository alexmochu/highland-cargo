// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import UserModal from "@/components/Modals/UserModal";
// import useUsers from "@/hooks/useUsers";
// import { useAuth } from "@/components/auth-provider";
// import { useState } from "react";

// export default function UsersTab() {
//   const { profile } = useAuth();
//   const { users, editingUser, setEditingUser, handleSave, handleDelete } = useUsers();
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);

//   return (
//     <>
//       <Card>
//         <CardHeader className="flex justify-between items-center">
//           <CardTitle>User Management</CardTitle>
//           <Button onClick={() => setIsUserModalOpen(true)}>
//             <Plus className="w-4 h-4 mr-2" /> Add User
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="text-left">
//                 <th>Email</th>
//                 <th>Status</th>
//                 <th>Role</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(user => (
//                 <tr key={user.id} className="border-t">
//                   <td>{user.email}</td>
//                   <td>
//                     <span className={`font-medium ${user.status === "active" ? "text-green-600" : "text-red-500"}`}>
//                       {user.status || "unknown"}
//                     </span>
//                   </td>
//                   <td>{user.role || "user"}</td>
//                   <td className="flex gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => {
//                         setEditingUser(user);
//                         setIsUserModalOpen(true);
//                       }}
//                     >
//                       <Pencil className="w-4 h-4" />
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() => handleDelete(user.id)}
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>

//       <UserModal
//         isOpen={isUserModalOpen}
//         onClose={() => {
//           setIsUserModalOpen(false);
//           setEditingUser(null);
//         }}
//         onSave={handleSave}
//         user={editingUser}
//         role="admin"
//         teamId={profile.id}
//       />
//     </>
//   );
// }

"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import useUsers from "@/hooks/admin/useUsersPaginated";
import UserModal from "@/components/admin/Modals/UserModal";
import Pagination from "@/components/admin/Pagination";

export default function UsersTab() {
  const { users, partners, suppliers, total, page, setPage, pageSize, loading, editing, setEditing, addOrUpdate, remove } = useUsers({ pageSize: 10 });
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Users & Roles</CardTitle>
          <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Invite User</Button>
        </CardHeader>

        <CardContent>
          <table className="min-w-full text-sm">
            <thead><tr className="text-left"><th>Email</th><th>Name</th><th>Role</th><th>Partner</th><th>Supplier</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {!loading && users.map(u => (
                <tr key={u.id} className="border-t">
                  <td>{u.email}</td>
                  <td>{u.full_name || "-"}</td>
                  <td className="capitalize">{u.role || "-"}</td>
                  <td>{u.partners?.name || "-"}</td>
                  <td>{u.suppliers?.name || "-"}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleString() : "-"}</td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(u); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(u.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan={7}>Loading…</td></tr>}
            </tbody>
          </table>

          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="rounded shadow max-w-md w-full">
            <UserModal
              isOpen={open}
              onClose={() => { setOpen(false); setEditing(null); }}
              onSave={(vals) => addOrUpdate(vals)}
              user={editing}
              partners={partners}
              suppliers={suppliers}
            />
          </div>
      </div>)}
    </>
  );
}

