"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Truck,
  HelpCircle,
  LayoutDashboard,
  Warehouse,
  Edit
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  })
};

export default function PartnerDashboard() {
  const supabase = createClient()
  const { user, profile, loading, logout } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [shipmentsLoading, setShipmentsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
  
    const fetchShipments = async () => {
      setShipmentsLoading(true);
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("partner_id", profile.id)
        .order("created_at", { ascending: false });
  
      if (!error) setShipments(data || []);
      setShipmentsLoading(false);
    };
  
    fetchShipments();
  
    const channel = supabase
      .channel('shipments-watch')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shipments', filter: `partner_id=eq.${profile.id}` },
        () => fetchShipments()
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const updateProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);
  
    if (!error) setEditing(false);
    setSaving(false);
  };

  const shipmentStepIndex = (status) => {
    return ["Ordered", "Shipped", "In Transit", "Delivered"].indexOf(status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-orange-50 to-blue-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-800">Partner Dashboard</h2>
          </div>
          <Button onClick={logout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments">My Shipments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Total Shipments:</strong> {shipments.length}</li>
                    <li><strong>Member Since:</strong> {new Date(profile?.created_at).toLocaleDateString()}</li>
                  </ul>
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
                      Exclusive Products with Tier Pricing
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Explore products with quantity-based pricing tiers from verified suppliers.
                  </p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href="/products">Explore Partner Catalogs</Link>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 text-sm text-gray-700">
                      Browse exclusive partner products, see tiered pricing, and request quotes directly from suppliers.
                    </HoverCardContent>
                  </HoverCard>
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
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2">ID</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipmentsLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i}>
                            <td colSpan={5} className="animate-pulse py-4">
                              <div className="h-4 bg-gray-200 rounded w-full"></div>
                            </td>
                          </tr>
                        ))
                    ) : shipments.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-4">No shipments found</td></tr>
                    ) : (
                      shipments.map((shipment) => (
                        <tr key={shipment.id}>
                          <td>{shipment.id}</td>
                          <td>{shipment.origin}</td>
                          <td>{shipment.destination}</td>
                          <td>{shipment.status}</td>
                          <td>
                            <div className="w-full bg-gray-200 rounded h-2">
                              <motion.div
                                className="bg-green-500 h-2 rounded"
                                initial={{ width: 0 }}
                                animate={{ width: `${(shipmentStepIndex(shipment.status) + 1) * 25}%` }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>
                            <div className="flex justify-between text-xs mt-1 text-gray-500">
                              {["Ordered", "Shipped", "In Transit", "Delivered"].map(step => (
                                <span key={step}>{step}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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
                  {editing ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold">Full Name</label>
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <Button onClick={updateProfile} size="sm" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="font-semibold">Name:</span> {profile?.full_name || "Not set"}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span> {profile?.email || "Not set"}
                      </div>
                      <Button onClick={() => setEditing(true)} size="sm">
                        <Edit className="w-4 h-4 mr-1" /> Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
