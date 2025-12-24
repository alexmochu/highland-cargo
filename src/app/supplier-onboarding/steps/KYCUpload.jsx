"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function KYCUpload({ supplierId, onNext }) {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!file) return;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("company-documents")
      .upload(`${supplierId}/${file.name}`, file);

    if (error) {
      console.error("Upload failed:", error);
      return;
    }

    // Insert into company_documents
    await supabase.from("company_documents").insert([
      { supplier_id: supplierId, doc_type: "business_reg", storage_url: data.path }
    ]);

    onNext();
  }

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload}>Upload & Continue</button>
    </div>
  );
}
