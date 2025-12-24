"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import CompanyDetails from "./steps/CompanyDetails";
import ContactDetails from "./steps/ContactDetails";
import ProductQuickAdd from "./steps/ProductQuickAdd";
import BankSetup from "./steps/BankSetup";
import KYCUpload from "./steps/KYCUpload";

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

  if (!CurrentStep) return <div>All steps completed 🎉</div>;

  return (
    <div>
      <div className="mb-4">
        Step {step + 1} of {steps.length}: {steps[step].title}
      </div>

      <CurrentStep
        userId={userId}
        supplierId={supplierId}
        onNext={() => saveProgress(step + 1)}
      />
    </div>
  );
}
