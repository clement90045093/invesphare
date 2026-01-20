import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// Supabase auth webhooks: when a user is created/updated/deleted, the webhook
// will POST a payload. We upsert a local User record by email to keep in sync.

export async function POST(request: Request) {
  // Minimal debug logging: record headers and raw body length
  const headersObj: Record<string, string | null> = {};
  for (const [k, v] of request.headers) headersObj[k] = v;
  console.info("Supabase webhook headers:", headersObj);

  const raw = await request.text();
  console.info("Supabase webhook raw body length:", raw.length);
  console.log("Supabase webhook received:", raw);
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return NextResponse.json({ message: "invalid json" }, { status: 400 });
  }

  // Signature verification removed — accept all incoming webhook requests.

  // Extract user object from common webhook shapes
  const user = parsed?.user || parsed?.record || parsed?.new || parsed?.data?.new || parsed?.event?.body?.user || parsed?.event?.body || parsed;
  const eventType = parsed?.type || parsed?.event?.type || parsed?.event?.name || null;

  if (!user || !user.email) {
    console.warn("Supabase webhook received but no user email found", { body: parsed });
    return NextResponse.json({ ok: true });
  }

  const id =  user?.id
  const email: string = user.email;
  const name: string | null = user.user_metadata?.full_name || user.user_metadata?.name || user.name || null;
  const supabaseId: string | null = user.id || user.user_id || null;

  // Retry logic for DB upsert to handle transient DB errors
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.user.update({ where: { email }, data: { id, name: name ?? existing.name } });
        console.info("Updated local user from supabase webhook", { email });
      } else {
        await prisma.user.create({ data: { id, email, name } });
        console.info("Created local user from supabase webhook", { email });
      }

      return NextResponse.json({ ok: true });
    } catch (err: any) {
      console.error(`Error syncing user from supabase webhook (attempt ${attempt})`, err?.message || err);
      if (attempt === maxAttempts) {
        return NextResponse.json({ message: err?.message || "server error" }, { status: 500 });
      }
      // exponential-ish backoff
      const delay = 150 * attempt;
      await new Promise((res) => setTimeout(res, delay));
      continue;
    }
  }
}
