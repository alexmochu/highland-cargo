"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Truck, Settings, Warehouse, Plus, Trash2, Pencil } from "lucide-react";
import Link from 'next/link'
import { useEffect, useState } from "react";
import UserModal from "@/components/Modals/UserModal";
import ProductModal from "@/components/Modals/ProductModal";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";

export default function AdminDashboard() {
  const supabase = createClient()
  const { profile } = useAuth()
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    console.log('prdcts', data)
    if (!error) setProducts(data);
  };
  
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (!error) setUsers(data);
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      await supabase.from("products").update(productData).eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert([productData]);
    }
    fetchProducts();
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

const handleSaveUser = async (userData) => {
  if (editingUser) {
    await supabase.from("users").update(userData).eq("id", editingUser.id);
  } else {
    await supabase.from("users").insert([userData]);
  }
  fetchUsers();
  setIsUserModalOpen(false);
  setEditingUser(null);
};

const handleDeleteUser = async (id) => {
  await supabase.from("users").delete().eq("id", id);
  fetchUsers();
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          </div>
        </div>
        <Tabs defaultValue="analytics">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="catalogs">Product Catalogs</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Users className="w-7 h-7 text-blue-600" />
                    <span className="text-3xl font-bold">1250</span>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">Registered accounts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Truck className="w-7 h-7 text-orange-600" />
                    <span className="text-3xl font-bold">420</span>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Partner Product Catalogs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Warehouse className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-gray-700">Dubai • China • UK</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Active: 3 regions · Status: <span className="text-green-600 font-medium">Online</span>
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/products">View Catalog Preview</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="catalogs">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Manage Product Catalog</CardTitle>
                <Button onClick={() => setIsProductModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th>Name</th>
                      <th>Region</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-t">
                        <td>{product.name}</td>
                        <td>{product.region}</td>
                        <td>{product.price}</td>
                        <td>{product.description}</td>
                        <td className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Recent and active shipments:</p>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th>ID</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th>User</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>HC-180</td>
                      <td>Paris</td>
                      <td>Cape Town</td>
                      <td><span className="text-yellow-700">Pending</span></td>
                      <td>user1@email.com</td>
                      <td>Jun 15, 2025</td>
                    </tr>
                    <tr>
                      <td>HC-181</td>
                      <td>Delhi</td>
                      <td>Sydney</td>
                      <td><span className="text-blue-600">In Transit</span></td>
                      <td>user2@email.com</td>
                      <td>Jun 10, 2025</td>
                    </tr>
                  </tbody>
                </table>
                <Button variant="outline" size="sm" className="mt-4">Manage Shipments</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <Button onClick={() => setIsUserModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add User
                </Button>
              </CardHeader>
              <CardContent>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th>Email</th>
                      <th>Status</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-t">
                        <td>{user.email}</td>
                        <td>
                          <span className={`font-medium ${user.status === "active" ? "text-green-600" : "text-red-500"}`}>
                            {user.status || "unknown"}
                          </span>
                        </td>
                        <td>{user.role || "user"}</td>
                        <td className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUser(user);
                              setIsUserModalOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        user={editingUser}
        role="admin"
        teamId={profile.id}
      />


      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}
