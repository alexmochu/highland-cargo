"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Warehouse, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

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

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-orange-50 to-blue-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Banner for unfinished onboarding */}
        {onboardingIncomplete && (
          <div className="mb-6 bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>
                Your onboarding is not yet complete. Please continue to finish verification.
              </span>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/supplier-onboarding">Continue Onboarding</Link>
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-800">My Dashboard fgfg</h2>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    Browse partner products. Onboarding required to unlock ordering.
                  </p>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/products">Explore Partner Catalogs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Email:</span> {profile.email}
                  </div>
                  <div>
                    <span className="font-semibold">Role:</span> {profile.role ?? "Not yet assigned"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

