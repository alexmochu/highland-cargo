"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { motion } from "framer-motion";

import OverviewTab from "@/components/supplier-dashboard/OverviewTab";
import ShipmentsTab from "@/components/supplier-dashboard/ShipmentsTab";
import ProductsTab from "@/components/supplier-dashboard/ProductsTab";
import TeamTab from "@/components/supplier-dashboard/TeamTab";
import MessagesTab from "@/components/supplier-dashboard/MessagesTab";
import ProfileTab from "@/components/supplier-dashboard/ProfileTab";

export default function SupplierDashboard() {
  const { profile, supplierId } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="bg-slate-800 p-3 rounded-2xl">
            <LayoutDashboard className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-4xl font-bold text-slate-800">Supplier Dashboard</h2>
        </motion.div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6 flex flex-wrap gap-3 bg-slate-100 p-2 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="shipments" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Shipments</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Products</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Team</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Messages</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Profile</TabsTrigger>
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
