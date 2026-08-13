"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { canViewModule } from "@/lib/permissions";
import { DOCS, docSectionVisible } from "@/lib/docsContent";
import { BookOpen, Loader2, ChevronRight } from "lucide-react";

const GROUP_ORDER = [
  "Getting started",
  "Customer guide",
  "Supplier portal",
  "Partner portal",
  "Admin console",
  "Catalog",
  "Shipments",
  "Sales",
  "Billing",
  "Purchasing",
  "Inventory",
  "Warehouses",
  "Expenses",
  "Contacts",
  "User management",
  "Reports",
  "HRM",
  "Settings",
  "POS terminal",
  "Reference",
];

export default function DocsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [rolesByName, setRolesByName] = useState({});
  const [rolesLoading, setRolesLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.push("/auth");
  }, [authLoading, user, router]);

  useEffect(() => {
    let active = true;
    supabase.from("roles").select("*").then(({ data }) => {
      if (!active) return;
      const map = {};
      (data || []).forEach(r => { map[r.name] = r; });
      setRolesByName(map);
      setRolesLoading(false);
    });
    return () => { active = false; };
  }, [supabase]);

  const visibleSections = useMemo(() => {
    if (!profile) return [];
    return DOCS.filter(s => docSectionVisible(s, profile, rolesByName, canViewModule));
  }, [profile, rolesByName]);

  const grouped = useMemo(() => {
    const byGroup = {};
    visibleSections.forEach(s => {
      if (!byGroup[s.group]) byGroup[s.group] = [];
      byGroup[s.group].push(s);
    });
    return GROUP_ORDER.filter(g => byGroup[g]?.length).map(g => ({ group: g, items: byGroup[g] }));
  }, [visibleSections]);

  useEffect(() => {
    if (!activeId && visibleSections.length) setActiveId(visibleSections[0].id);
  }, [activeId, visibleSections]);

  const active = visibleSections.find(s => s.id === activeId) || visibleSections[0];

  if (authLoading || rolesLoading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-paper-dim">
        <Loader2 className="w-10 h-10 text-ink animate-spin mb-3" />
        <p className="text-text-3 font-medium">Loading documentation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-dim">
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
        <div className="mb-10">
          <div className="font-manifest text-[12px] text-freight-soft tracking-wide mb-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            DOCUMENTATION
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl mb-2">How to use Highland Cargo</h1>
          <p className="text-text-2 max-w-2xl">
            Showing what's relevant to your account -- signed in as <span className="font-semibold text-ink">{profile.full_name || profile.email}</span>
            {" "}(<span className="capitalize">{profile.is_admin ? "admin" : (profile.role || "customer").replace("_", " ")}</span>).
          </p>
        </div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
          <nav className="lg:sticky lg:top-8 lg:self-start bg-surface border border-line max-h-[75vh] overflow-y-auto">
            {grouped.map(({ group, items }) => (
              <div key={group} className="border-b border-line last:border-b-0">
                <div className="px-4 pt-3 pb-1.5 font-manifest text-[10.5px] text-text-3 tracking-wide uppercase">{group}</div>
                <div className="pb-2">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className={`w-full text-left px-4 py-1.5 text-[13.5px] transition-colors ${
                        active?.id === item.id ? "text-freight font-semibold bg-beacon/10" : "text-text-2 hover:text-ink"
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <main className="bg-surface border border-line p-8 md:p-10 min-w-0">
            {active && <DocSection section={active} />}
          </main>
        </div>
      </div>
    </div>
  );
}

function DocSection({ section }) {
  return (
    <article className="space-y-8">
      <div>
        <h2 className="font-display font-extrabold text-3xl mb-2">{section.title}</h2>
        {section.summary && <p className="text-text-2 text-lg">{section.summary}</p>}
      </div>

      {section.body && (
        <div className="space-y-4">
          {section.body.map((p, i) => (
            <p key={i} className="text-text-2 leading-relaxed">{p}</p>
          ))}
        </div>
      )}

      {section.actions && (
        <div className="space-y-6">
          {section.actions.map((action, i) => (
            <div key={i} className="border border-line">
              <div className="bg-paper-dim px-4 py-2.5 font-semibold text-sm flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-freight" />
                {action.label}
              </div>
              <ol className="p-4 pl-9 space-y-2 list-decimal text-[14.5px] text-text-2 leading-relaxed">
                {action.steps.map((step, j) => <li key={j}>{step}</li>)}
              </ol>
            </div>
          ))}
        </div>
      )}

      {section.table && (
        <div className="border border-line overflow-x-auto">
          <table className="hc-table w-full">
            <thead>
              <tr>{section.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.notes && (
        <div className="bg-paper-dim border-l-2 border-beacon p-4 space-y-2">
          {section.notes.map((n, i) => (
            <p key={i} className="text-[13.5px] text-text-2 leading-relaxed">{n}</p>
          ))}
        </div>
      )}
    </article>
  );
}
