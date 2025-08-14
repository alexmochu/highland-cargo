// components/partner/MessagesTab.jsx
"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import usePartnerMessages from "@/hooks/partner/usePartnerMessages";
import * as svc from "@/services/partnerService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  content: z.string().min(1),
  shipment_id: z.string().optional(),
  product_id: z.string().optional()
});

export default function MessagesTab({ partnerId, partnerProfile }) {
  const { messages, loading, reload } = usePartnerMessages(partnerId);
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(schema) });

  const onSend = async (vals) => {
    setSending(true);
    try {
      const payload = {
        content: vals.content,
        sender_id: partnerProfile.user_id,
        shipment_id: vals.shipment_id || null,
        product_id: vals.product_id || null,
        supplier_id: null
      };
      await svc.postMessage(payload);
      toast.success("Message sent");
      reset();
      reload();
    } catch (e) {
      console.error(e);
      toast.error("Failed to send message");
    } finally { setSending(false); }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Messages & Inquiries</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSend)} className="space-y-2 mb-4">
          <textarea className="textarea w-full" placeholder="Write a message" {...register("content")}></textarea>
          <div className="flex gap-2">
            <input placeholder="Shipment id (optional)" className="input" {...register("shipment_id")} />
            <input placeholder="Product id (optional)" className="input" {...register("product_id")} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={sending}>Send</Button>
          </div>
        </form>

        <div className="space-y-2">
          {loading && <div>Loading…</div>}
          {!loading && messages.length === 0 && <div className="text-sm text-muted-foreground">No messages</div>}
          {!loading && messages.map(m => (
            <div key={m.id} className="border rounded p-2">
              <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
              <div>{m.content}</div>
              <div className="text-xs text-muted-foreground">Shipment: {m.shipment_id || "-"} • Product: {m.product_id || "-"}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// "use client"
// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";

// export default function MessagesPanel({ shipmentId, productId }) {
//   const supabase = createClient();
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     if (!shipmentId && !productId) return;

//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("id, content, created_at, sender_id, profiles:sender_id(full_name)")
//         .match(shipmentId ? { shipment_id: shipmentId } : { product_id: productId })
//         .order("created_at", { ascending: true });

//       if (!error) setMessages(data || []);
//     };

//     fetchMessages();
//   }, [shipmentId, productId]);

//   return (
//     <div className="space-y-3">
//       {messages.map(msg => (
//         <div key={msg.id} className="bg-gray-100 p-3 rounded">
//           <p className="text-sm">{msg.content}</p>
//           <p className="text-xs text-gray-500">
//             {msg.profiles?.full_name || "Unknown"} • {new Date(msg.created_at).toLocaleString()}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

