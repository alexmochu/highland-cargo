"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import OverviewTab from "@/components/partner/OverviewTab";
import ShipmentsTab from "@/components/partner/ShipmentsTab";
import MessagesTab from "@/components/partner/MessagesTab";
import ProfileTab from "@/components/partner/ProfileTab";

export default function PartnerDashboardPage() {
  const { profile } = useAuth();
  const partnerId = profile?.id || null;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-orange-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-800">Partner Dashboard</h2>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments">My Shipments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab partnerId={partnerId} /></TabsContent>
          <TabsContent value="shipments"><ShipmentsTab partnerId={partnerId} partnerProfile={profile} /></TabsContent>
          <TabsContent value="messages"><MessagesTab partnerId={partnerId} partnerProfile={profile} /></TabsContent>
          <TabsContent value="profile"><ProfileTab profile={profile} onUpdate={() => { /* optional refresh action */ }} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
