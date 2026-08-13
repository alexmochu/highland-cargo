"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboard, BookOpen } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { motion } from "framer-motion";
import Link from "next/link";

import OverviewTab from "@/components/supplier-dashboard/OverviewTab";
import ShipmentsTab from "@/components/supplier-dashboard/ShipmentsTab";
import ProductsTab from "@/components/supplier-dashboard/ProductsTab";
import TeamTab from "@/components/supplier-dashboard/TeamTab";
import MessagesTab from "@/components/supplier-dashboard/MessagesTab";
import ProfileTab from "@/components/supplier-dashboard/ProfileTab";

export default function SupplierDashboard() {
  const { profile, supplierId } = useAuth();

  return (
    <div className="min-h-screen bg-paper-dim py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="bg-ink p-3 rounded-2xl">
              <LayoutDashboard className="w-8 h-8 text-beacon" />
            </div>
            <h2 className="text-4xl font-bold text-ink">Supplier Dashboard</h2>
          </div>
          <Link href="/docs" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-text-2 hover:text-freight border border-line-strong px-3 py-2">
            <BookOpen className="w-4 h-4" />Documentation
          </Link>
        </motion.div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6 flex flex-wrap gap-3 bg-surface-raised border border-line p-2 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="shipments" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Shipments</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Products</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Team</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Messages</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-ink data-[state=active]:text-paper rounded-lg">Profile</TabsTrigger>
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
