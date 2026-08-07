import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY is not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const signature = req.headers.get("x-paystack-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Paystack signs the raw request body -- hashing a re-serialized
  // JSON.stringify of the parsed object can produce a different string and
  // break verification.
  const rawBody = await req.text();
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

  if (hash !== signature) {
    console.error("Invalid Paystack signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { event, data } = JSON.parse(rawBody);
  const reference = data?.reference;
  if (!reference) {
    return NextResponse.json({ status: "ignored" });
  }

  const admin = createServerSupabaseClient();

  const { data: payment, error: findError } = await admin
    .from("payments")
    .select("id, status, amount, invoice_id")
    .eq("paystack_reference", reference)
    .single();

  if (findError || !payment) {
    console.error("Webhook: no payment found for reference", reference);
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (event === "charge.success") {
    // Idempotent: a retried/duplicate webhook delivery must not double-credit the invoice.
    if (payment.status === "success") {
      return NextResponse.json({ status: "already processed" });
    }

    const expectedAmount = Math.round(Number(payment.amount) * 100);
    if (data.amount !== expectedAmount) {
      console.error(`Webhook amount mismatch for payment ${payment.id}: expected ${expectedAmount}, got ${data.amount}`);
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    await admin.from("payments").update({ status: "success", paid_at: new Date().toISOString() }).eq("id", payment.id);

    if (payment.invoice_id) {
      const { data: invoice } = await admin.from("invoices").select("amount, amount_paid").eq("id", payment.invoice_id).single();
      if (invoice) {
        const amountPaid = Number(invoice.amount_paid || 0) + Number(payment.amount);
        await admin.from("invoices").update({
          amount_paid: amountPaid,
          status: amountPaid >= Number(invoice.amount) ? "paid" : "sent",
        }).eq("id", payment.invoice_id);
      }
    }
  } else if (event === "charge.failed") {
    if (payment.status === "pending") {
      await admin.from("payments").update({ status: "failed" }).eq("id", payment.id);
    }
  }

  return NextResponse.json({ status: "success" });
}
