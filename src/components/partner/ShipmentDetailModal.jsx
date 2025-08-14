// components/partner/ShipmentDetailModal.jsx
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as svc from "@/services/partnerService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({ content: z.string().min(1) });

export default function ShipmentDetailModal({ shipment, onClose, partnerProfile }) {
  const [messages, setMessages] = useState([]);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!shipment) return;
    (async () => {
      try {
        const msgs = await svc.fetchMessagesForShipments([shipment.id]);
        setMessages(msgs);
      } catch (e) {
        toast.error("Failed to load messages");
      }
    })();
  }, [shipment]);

  const onSend = async (vals) => {
    try {
      const payload = {
        shipment_id: shipment.id,
        sender_id: partnerProfile.user_id, // auth user id from profile
        content: vals.content,
        supplier_id: shipment.supplier_id || null,
        product_id: shipment.product_id || null
      };
      await svc.postMessage(payload);
      toast.success("Message sent");
      reset();
      // reload messages
      const msgs = await svc.fetchMessagesForShipments([shipment.id]);
      setMessages(msgs);
    } catch (e) {
      console.error(e);
      toast.error("Failed to send message");
    }
  };

  if (!shipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow max-w-2xl w-full p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Shipment {shipment.id}</h3>
          <div className="text-sm text-muted-foreground">{new Date(shipment.created_at).toLocaleString()}</div>
        </div>

        <div className="mt-3">
          <div><strong>Product:</strong> {shipment.products?.name || shipment.product_id}</div>
          <div><strong>From:</strong> {shipment.source_location || "-"}</div>
          <div><strong>To:</strong> {shipment.destination_location || "-"}</div>
          <div className="mt-2"><strong>Status:</strong> {shipment.status}</div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium">Messages</h4>
          <div className="max-h-48 overflow-auto space-y-2 mt-2">
            {messages.length === 0 && <div className="text-sm text-muted-foreground">No messages yet</div>}
            {messages.map(m => (
              <div key={m.id} className="p-2 border rounded">
                <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
                <div>{m.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSend)} className="mt-3 space-y-2">
            <textarea className="textarea w-full" placeholder="Write a message" {...register("content")}></textarea>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} type="button">Close</Button>
              <Button type="submit" disabled={isSubmitting}>Send</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
