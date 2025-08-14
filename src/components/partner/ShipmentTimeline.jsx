"use client"
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";

export default function ShipmentTimeline({ shipmentId }) {
  const supabase = createClient();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!shipmentId) return;

    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("shipment_events")
        .select("status, note, created_at, created_by, profiles:created_by(full_name)")
        .eq("shipment_id", shipmentId)
        .order("created_at", { ascending: true });

      if (!error) setEvents(data || []);
    };

    fetchEvents();
  }, [shipmentId]);

  return (
    <div className="border-l-2 border-gray-300 pl-4 space-y-4">
      {events.map((event, idx) => (
        <div key={idx} className="relative">
          <div className="absolute -left-3 top-1 w-5 h-5 rounded-full bg-blue-500 border border-white"></div>
          <div>
            <p className="font-semibold">{event.status}</p>
            {event.note && <p className="text-sm text-gray-600">{event.note}</p>}
            <p className="text-xs text-gray-400">
              {event.profiles?.full_name || "System"} • {formatDistanceToNow(new Date(event.created_at))} ago
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
