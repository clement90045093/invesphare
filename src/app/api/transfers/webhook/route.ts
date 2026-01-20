import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "../../../../lib/prisma";

// Tatum webhook handler
export async function POST(request: NextRequest) {
  const secret = process.env.PROVIDER_WEBHOOK_SECRET || process.env.TATUM_HMAC_SECRET;
  const xPayloadHash = request.headers.get("x-payload-hash");

  // Read raw body
  const raw = await request.text();
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return NextResponse.json({ message: "invalid json" }, { status: 400 });
  }

  // Tatum wraps actual payload in event.body
  const body = parsed?.event?.body ?? parsed;

  if (!secret) {
    console.error("No webhook secret configured (PROVIDER_WEBHOOK_SECRET)");
    return NextResponse.json({ message: "server misconfigured" }, { status: 500 });
  }

  if (!xPayloadHash) {
    console.warn("Missing x-payload-hash header");
    return NextResponse.json({ message: "missing signature" }, { status: 401 });
  }

  // Verify HMAC signature
  try {
    const base64Hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(body))
      .digest("base64");

    if (base64Hash !== xPayloadHash) {
      console.warn("Webhook signature mismatch", { expected: base64Hash, got: xPayloadHash });
      console.debug({ raw, body });
      return NextResponse.json({ message: "invalid signature" }, { status: 401 });
    }
  } catch (err) {
    console.error("Error verifying webhook signature", err);
    return NextResponse.json({ message: "signature verification failed" }, { status: 500 });
  }

  // Process deposit
  try {
    const txId = body?.txId ?? body?.txHash ?? body?.hash;
    const amount = Number(body?.amount ?? body?.value ?? 0);
    const addressCandidates: string[] = [];
    if (body?.address) addressCandidates.push(body.address);
    if (body?.counterAddress) addressCandidates.push(body.counterAddress);

    const reference = body?.reference || body?.memo || body?.label || null;

    // Try to match deposit by reference
    let deposit: any = null;
    if (reference) {
      deposit = await prisma.deposit.findUnique({ where: { reference } });
    }

    // Fallback: match by address for pending deposits
    if (!deposit && addressCandidates.length) {
      deposit = await prisma.deposit.findFirst({
        where: { address: { in: addressCandidates }, status: "pending" },
      });
    }

    if (!deposit) {
      console.info("Webhook received but no matching deposit found", { body });
      return NextResponse.json({ ok: true });
    }

    // Check expiry
    if (deposit.expiresAt && new Date() > new Date(deposit.expiresAt)) {
      console.info("Deposit has expired, marking as failed", { depositId: deposit.id });
      await prisma.deposit.update({ where: { id: deposit.id }, data: { status: "failed" } });
      return NextResponse.json({ ok: true });
    }

    // Check amount
    if (isNaN(amount) || amount < Number(deposit.amount)) {
      console.info("Received amount less than expected, ignoring", { depositId: deposit.id, amount });
      return NextResponse.json({ ok: true });
    }

    // Idempotency: already confirmed
    if (deposit.status === "confirmed") {
      return NextResponse.json({ ok: true });
    }

    // Confirm the deposit
    const creditAmount = Number(amount) || Number(deposit.amount || 0);

    await prisma.deposit.update({
      where: { id: deposit.id },
      data: {
        status: "confirmed",
        txHash: txId || undefined,
        receivedAmount: creditAmount || undefined,
        providerPayload: body,
        confirmedAt: new Date(),
      },
    });

    console.info("Deposit confirmed", { depositId: deposit.id, txId, creditAmount });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Error handling webhook", err);
    return NextResponse.json({ message: err?.message || "server error" }, { status: 500 });
  }
}
