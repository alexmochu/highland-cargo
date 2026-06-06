"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Warehouse, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ClientDashboard() {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();
  const [onboardingIncomplete, setOnboardingIncomplete] = useState(false);
console.log('role', profile)
  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === "supplier" && profile.supplier_id) {
        // If supplier, check onboarding
        fetch(`/api/supplier/${profile.supplier_id}/progress`)
          .then(res => res.json())
          .then(data => {
            if (data.status !== "verified") {
              setOnboardingIncomplete(true);
              // Redirect supplier straight into onboarding flow
              router.push("/supplier-onboarding");
            }
          });
      } else if (!profile.role) {
        // No role yet → prompt choice
        router.push("/choose-role");
      } else {
        setOnboardingIncomplete(true);
      }
    }
  }, [loading, user, profile, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-slate-600">Please log in</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Banner for unfinished onboarding */}
        {onboardingIncomplete && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-lg">
                Your onboarding is not yet complete. Please continue to finish verification.
              </span>
            </div>
            <Button asChild size="sm" variant="outline" className="border-amber-300 hover:bg-amber-100 hover:text-amber-800 text-amber-800">
              <Link href="/supplier-onboarding">Continue Onboarding</Link>
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 p-3 rounded-2xl">
              <LayoutDashboard className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-4xl font-bold text-slate-800">My Dashboard</h2>
          </div>
        </motion.div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6 flex flex-wrap gap-3 bg-slate-100 p-2 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-800">Partner Product Catalogs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-slate-100 p-3 rounded-xl">
                      <Warehouse className="w-7 h-7 text-slate-700" />
                    </div>
                    <span className="font-semibold text-slate-700 text-lg">
                      Exclusive Products from Dubai, China, UK
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">
                    Browse partner products. Onboarding required to unlock ordering.
                  </p>
                  <Button asChild className="w-full bg-slate-800 hover:bg-slate-700 text-white h-12 text-lg">
                    <Link href="/products">Explore Partner Catalogs</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800">My Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <span className="font-semibold text-slate-700 min-w-[100px]">Email:</span> 
                  <span className="text-slate-600">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <span className="font-semibold text-slate-700 min-w-[100px]">Role:</span> 
                  <span className="text-slate-600">{profile.role ?? "Not yet assigned"}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

