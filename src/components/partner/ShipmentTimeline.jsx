"use client"
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Tiny relative-time formatter so this component doesn't need an extra
// dependency (date-fns wasn't in package.json/node_modules).
function timeAgo(date) {
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const units = [
    ["year", 31536000], ["month", 2592000], ["day", 86400],
    ["hour", 3600], ["minute", 60], ["second", 1],
  ];
  for (const [unit, secondsInUnit] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value} ${unit}${value > 1 ? "s" : ""}`;
  }
  return "just now";
}

export default function ShipmentTimeline({ shipmentId }) {
  const supabase = useMemo(() => createClient(), []);
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
  }, [shipmentId, supabase]);

  return (
    <div className="border-l-2 border-gray-300 pl-4 space-y-4">
      {events.map((event, idx) => (
        <div key={idx} className="relative">
          <div className="absolute -left-3 top-1 w-5 h-5 rounded-full bg-blue-500 border border-white"></div>
          <div>
            <p className="font-semibold">{event.status}</p>
            {event.note && <p className="text-sm text-gray-600">{event.note}</p>}
            <p className="text-xs text-gray-400">
              {event.profiles?.full_name || "System"} • {timeAgo(new Date(event.created_at))} ago
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
