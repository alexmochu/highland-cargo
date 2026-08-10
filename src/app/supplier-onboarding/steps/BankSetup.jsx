"use client";
import { useState } from "react";

export default function StepBank({ onNext }) {
  const [iban, setIban] = useState("");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Step 3: Bank Details</h2>
      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="IBAN / Bank Account"
        value={iban}
        onChange={(e) => setIban(e.target.value)}
      />
      <button
        onClick={onNext}
        disabled={!iban}
        className="bg-ink text-paper px-4 py-2 rounded"
      >
        Save & Continue →
      </button>
    </div>
  );
}
