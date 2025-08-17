// components/partner/ProfileTab.jsx
"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as svc from "@/services/partnerService";
import { toast } from "sonner";

export default function ProfileTab({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await svc.updatePartnerProfile(profile.id, { full_name: fullName });
      toast.success("Profile updated");
      setEditing(false);
      onUpdate && onUpdate();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update profile");
    } finally { setSaving(false); }
  };

  return (
    <Card>
      <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
      <CardContent>
        {editing ? (
          <>
            <div>
              <label className="block text-sm font-semibold">Full name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} className="input w-full" />
            </div>
            <div className="flex gap-2 mt-3">
              <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              <Button variant="ghost" onClick={() => { setEditing(false); setFullName(profile?.full_name || ""); }}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div><strong>Name:</strong> {profile?.full_name || "-"}</div>
            <div><strong>Email:</strong> {profile?.email || "-"}</div>
            <div className="mt-2">
              {/* <Button onClick={() => setEditing(true)}>Edit Profile</Button> */}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
