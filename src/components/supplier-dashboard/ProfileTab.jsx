"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfileTab({ profile }) {
  return (
    <Card>
      <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div><span className="font-semibold">Name:</span> {profile?.full_name || "-"}</div>
          <div><span className="font-semibold">Email:</span> {profile?.email || "-"}</div>
          <div><span className="font-semibold">Role:</span> {profile?.role || "-"}</div>
          <div className="mt-3">
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
