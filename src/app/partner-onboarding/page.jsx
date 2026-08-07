"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const STEPS = ["Company Details", "Contact Info", "Warehouse Preference"];

export default function PartnerOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [partnerId, setPartnerId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    country: "",
    contact_email: "",
    phone: "",
    preferred_region: "dubai",
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("partner_id").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data?.partner_id) setPartnerId(data.partner_id);
    });
  }, [user, supabase]);

  async function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    await finish();
  }

  async function finish() {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        country: form.country,
        contact_email: form.contact_email,
        phone: form.phone,
        preferred_region: form.preferred_region,
      };

      let id = partnerId;
      if (id) {
        const { error } = await supabase.from("partners").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("partners").insert([payload]).select().single();
        if (error) throw error;
        id = data.id;
        const { error: profileError } = await supabase.from("profiles").update({ partner_id: id }).eq("user_id", user.id);
        if (profileError) throw profileError;
      }

      toast.success("Partner profile set up!");
      router.push("/partner");
    } catch (err) {
      toast.error(err.message || "Failed to complete onboarding");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-lg text-slate-600">Please login</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-4">
            <span className="text-sm font-semibold text-slate-700">Step {step + 1} of {STEPS.length}</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-2">{STEPS[step]}</h2>
          <p className="text-lg text-slate-600">Set up your partner account to access regional catalogs and shipment tracking.</p>
        </motion.div>

        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
            {step === 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company / Partner Name</label>
                  <input
                    className="border border-slate-300 rounded-lg p-2 w-full"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                  <input
                    className="border border-slate-300 rounded-lg p-2 w-full"
                    value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    placeholder="Kenya, Uganda, Tanzania..."
                    required
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    className="border border-slate-300 rounded-lg p-2 w-full"
                    value={form.contact_email}
                    onChange={e => setForm({ ...form, contact_email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="border border-slate-300 rounded-lg p-2 w-full"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Sourcing Region</label>
                <select
                  className="border border-slate-300 rounded-lg p-2 w-full"
                  value={form.preferred_region}
                  onChange={e => setForm({ ...form, preferred_region: e.target.value })}
                >
                  <option value="dubai">Dubai</option>
                  <option value="china">China</option>
                  <option value="uk">UK</option>
                </select>
                <p className="text-sm text-slate-500 mt-2">You'll see this region's catalog first -- you can browse all regions afterwards.</p>
              </div>
            )}

            <div className="flex justify-between pt-2">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="text-slate-500 text-sm underline">
                  Back
                </button>
              ) : <span />}
              <button
                type="button"
                onClick={handleNext}
                disabled={saving || (step === 0 && (!form.name || !form.country)) || (step === 1 && (!form.contact_email || !form.phone))}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
              >
                {saving ? "Saving..." : step === STEPS.length - 1 ? "Finish" : "Continue →"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
