"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import CompanyDetails from "./steps/CompanyDetails";
import ContactDetails from "./steps/ContactDetails";
import ProductQuickAdd from "./steps/ProductQuickAdd";
import BankSetup from "./steps/BankSetup";
import KYCUpload from "./steps/KYCUpload";
import { motion } from "framer-motion";

const steps = [
  { id: 1, title: "Company Details", component: CompanyDetails },
  { id: 2, title: "Contact Info", component: ContactDetails },
  { id: 3, title: "Add Product", component: ProductQuickAdd },
  { id: 4, title: "Bank Setup", component: BankSetup },
  { id: 5, title: "KYC Upload", component: KYCUpload },
];

export default function Stepper({ userId, supplierId }) {
  const supabase = createClient();
  const [step, setStep] = useState(0);

  useEffect(() => {
    async function fetchProgress() {
      const { data, error } = await supabase
        .from("suppliers")
        .select("onboarding_step")
        .eq("id", supplierId)
        .single();

      if (!error && data) {
        setStep(data.onboarding_step - 1); // array index
      }
    }
    fetchProgress();
  }, [supabase, supplierId]);

  async function saveProgress(nextStep) {
    await supabase
      .from("suppliers")
      .update({ onboarding_step: nextStep + 1 })
      .eq("id", supplierId);
    setStep(nextStep);
  }

  const CurrentStep = steps[step]?.component;

  if (!CurrentStep) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center p-10 bg-white rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">All steps completed 🎉</h1>
        <p className="text-lg text-slate-600">You&apos;re all set up! Check your dashboard for more details.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-4">
            <span className="text-sm font-semibold text-slate-700">Step {step + 1} of {steps.length}</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-2">{steps[step].title}</h2>
          <p className="text-lg text-slate-600">Complete this step to continue your onboarding process.</p>
        </motion.div>
        
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
        >
          <CurrentStep
            userId={userId}
            supplierId={supplierId}
            onNext={() => saveProgress(step + 1)}
          />
        </motion.div>
      </div>
    </div>
  );
}
