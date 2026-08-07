import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.error("PAYSTACK_SECRET_KEY is not configured");
    return NextResponse.json({ error: "Payment is not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const invoiceId = body?.invoiceId;
  if (!invoiceId) {
    return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
  }

  const admin = createServerSupabaseClient();

  // Re-price server-side -- never trust a client-sent amount.
  const { data: invoice, error: invoiceError } = await admin
    .from("invoices")
    .select("id, amount, amount_paid, currency, status")
    .eq("id", invoiceId)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const amountDue = Number(invoice.amount) - Number(invoice.amount_paid || 0);
  if (amountDue <= 0) {
    return NextResponse.json({ error: "Invoice is already paid" }, { status: 400 });
  }

  const reference = `HC-${invoice.id.slice(0, 8)}-${Date.now()}`;

  const { data: payment, error: paymentError } = await admin
    .from("payments")
    .insert({
      invoice_id: invoice.id,
      amount: amountDue,
      currency: invoice.currency || "KES",
      method: "paystack",
      status: "pending",
      paystack_reference: reference,
    })
    .select()
    .single();

  if (paymentError) {
    console.error("Failed to create payment record:", paymentError);
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }

  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: Math.round(amountDue * 100),
      currency: invoice.currency || "KES",
      reference,
    }),
  });

  const paystackData = await paystackRes.json().catch(() => null);

  if (!paystackRes.ok || !paystackData?.status) {
    console.error("Paystack initialize failed:", paystackData);
    await admin.from("payments").delete().eq("id", payment.id);
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 502 });
  }

  return NextResponse.json({
    paymentId: payment.id,
    accessCode: paystackData.data.access_code,
    reference,
  });
}
