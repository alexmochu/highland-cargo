import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Truck, BarChart2, Settings, LogOut, Warehouse } from "lucide-react";
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          </div>
          <Button variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
        <Tabs defaultValue="analytics">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                  <CardTitle>Monthly Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-7 h-7 text-green-500" />
                    <span className="text-3xl font-bold">+21%</span>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">Month over month</p>
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
              <CardHeader>
                <CardTitle>Partner Product Catalogs Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Warehouse className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold">Dubai, China, UK</span>
                </div>
                <p className="mb-3">
                  Clients can browse a limited preview of products from our international partners—full access requires signup/login.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/products">View Product Catalogs (Preview)</Link>
                </Button>
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
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">Manage users, reset passwords, and review activity.</div>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th>Email</th>
                      <th>Status</th>
                      <th>Shipments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>admin@highlandcargo.com</td>
                      <td><span className="text-green-600 font-medium">Active</span></td>
                      <td>12</td>
                      <td>
                        <Button size="sm" variant="ghost">View</Button>
                        <Button size="sm" variant="outline">Disable</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>jane@example.com</td>
                      <td><span className="text-blue-600 font-medium">Pending</span></td>
                      <td>8</td>
                      <td>
                        <Button size="sm" variant="ghost">View</Button>
                        <Button size="sm" variant="outline">Disable</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="mb-2 w-full" variant="outline">Manage Site Settings</Button>
                <Button className="mb-2 w-full" variant="outline">View Logs</Button>
                <Button className="w-full" variant="destructive">Delete All Test Data</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
