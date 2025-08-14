"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

import OverviewTab from "@/components/supplier-dashboard/OverviewTab";
import ShipmentsTab from "@/components/supplier-dashboard/ShipmentsTab";
import ProductsTab from "@/components/supplier-dashboard/ProductsTab";
import TeamTab from "@/components/supplier-dashboard/TeamTab";
import MessagesTab from "@/components/supplier-dashboard/MessagesTab";
import ProfileTab from "@/components/supplier-dashboard/ProfileTab";

export default function SupplierDashboard() {
  const { profile, supplierId } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-orange-50 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-800">Supplier Dashboard</h2>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="flex flex-wrap gap-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab supplierId={supplierId} />
          </TabsContent>
          <TabsContent value="shipments">
            <ShipmentsTab supplierId={supplierId} />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab supplierId={supplierId} />
          </TabsContent>
          <TabsContent value="team">
            <TeamTab supplierId={supplierId} />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesTab supplierId={supplierId} />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileTab profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
