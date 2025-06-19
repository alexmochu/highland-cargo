import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Truck, HelpCircle, LayoutDashboard, Warehouse } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-orange-50 to-blue-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-800">My Dashboard</h2>
          </div>
          <Button variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments">My Shipments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Truck className="w-8 h-8 text-orange-500" />
                    <span className="text-3xl font-bold">3</span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Track your ongoing shipments in real-time.
                  </p>
                  <Button className="mt-2" size="sm">View Shipments</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partner Product Catalogs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-2">
                    <Warehouse className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-gray-700">
                      Exclusive Products from Dubai, China, UK
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Browse a selection of our partners’ products from Dubai, China, and the UK.
                    Sign up or log in to see all product details and unlock ordering.
                  </p>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/products">Explore Partner Catalogs</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="mb-2 w-full">Create New Shipment</Button>
                  <Button variant="outline" className="mb-2 w-full">Request Quote</Button>
                  <Button variant="outline" className="w-full">Contact Support</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">Your most recent shipments will appear here.</div>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2">ID</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>HC-142</td>
                      <td>New York</td>
                      <td>London</td>
                      <td><span className="text-green-600 font-medium">Delivered</span></td>
                      <td>Jun 1, 2025</td>
                    </tr>
                    <tr>
                      <td>HC-143</td>
                      <td>Berlin</td>
                      <td>Lagos</td>
                      <td><span className="text-blue-600 font-medium">In Transit</span></td>
                      <td>Jun 5, 2025</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Name:</span> Jane Doe
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> jane@example.com
                  </div>
                  <div>
                    <span className="font-semibold">Phone:</span> +1 234 567 8901
                  </div>
                  <Button size="sm" className="mt-2">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>
                  <HelpCircle className="inline mr-2 mb-1 text-blue-500" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Contact our team and see FAQs and support tickets.</p>
                <Button variant="outline" className="mb-2">Open Support Ticket</Button>
                <Button variant="ghost">Visit FAQs</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
