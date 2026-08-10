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
    <div className="border-l-2 border-line-strong pl-5 space-y-5">
      {events.map((event, idx) => {
        const isLatest = idx === events.length - 1;
        return (
          <div key={idx} className="relative">
            <div className={`absolute -left-[26px] top-1 w-3 h-3 ${isLatest ? "bg-beacon" : "bg-surface border-2 border-line-strong"}`} />
            <div>
              <p className="text-sm font-semibold">{event.status}</p>
              {event.note && <p className="text-sm text-text-2 mt-0.5">{event.note}</p>}
              <p className="font-manifest text-xs text-text-3 mt-1">
                {event.profiles?.full_name || "System"} · {timeAgo(new Date(event.created_at))} ago
              </p>
            </div>
          </div>
        );
      })}
      {events.length === 0 && <p className="text-sm text-text-3">No status updates yet.</p>}
    </div>
  );
}
