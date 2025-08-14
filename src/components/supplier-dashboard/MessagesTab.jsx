"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMessages } from "@/hooks/supplier/useSupplierData";
import * as svc from "@/services/supplierService";
import { useAuth } from "@/components/auth-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({ content: z.string().min(1), product_id: z.string().optional(), shipment_id: z.string().optional() });

export default function MessagesTab({ supplierId }) {
  const { messages, reload, loading } = useMessages(supplierId);
  const { profile } = useAuth();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSend = async (vals) => {
    try {
      const payload = { supplier_id: supplierId, sender_id: profile.user_id || profile.user_id, content: vals.content, product_id: vals.product_id || null, shipment_id: vals.shipment_id || null };
      await svc.postMessageForSupplier(payload);
      toast.success("Message sent");
      reset();
      reload();
    } catch {
      toast.error("Send failed");
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Messages & Inquiries</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <form onSubmit={handleSubmit(onSend)} className="space-y-2">
            <textarea placeholder="Write a message / reply" className="textarea w-full" {...register("content")} />
            <div className="flex gap-2">
              <input placeholder="Product id (optional)" className="input" {...register("product_id")} />
              <input placeholder="Shipment id (optional)" className="input" {...register("shipment_id")} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>Send</Button>
            </div>
          </form>

          <div className="space-y-3">
            {!loading && messages.map(m => (
              <div key={m.id} className="border rounded p-3">
                <div className="text-sm text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
                <div className="font-medium">{m.content}</div>
                <div className="text-xs text-muted-foreground">Product: {m.product_id || "-"} • Shipment: {m.shipment_id || "-"}</div>
              </div>
            ))}
            {loading && <div>Loading…</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
