import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Supabase auth webhooks: when a user is created/updated/deleted, the webhook
// will POST a payload. We upsert a local User record to keep in sync.

export async function POST(request: Request) {
  const raw = await request.text();
  console.log("[v0] Supabase webhook received:", raw);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ message: "invalid json" }, { status: 400 });
  }

  // Extract user object from common webhook shapes
  const user =
    (parsed?.user as Record<string, unknown>) ||
    (parsed?.record as Record<string, unknown>) ||
    (parsed?.new as Record<string, unknown>) ||
    ((parsed?.data as Record<string, unknown>)?.new as Record<string, unknown>) ||
    parsed;

  if (!user || !user.email) {
    console.warn("[v0] Supabase webhook: no user email found", { body: parsed });
    return NextResponse.json({ ok: true });
  }

  // Extract necessary data from Supabase auth user
  const id = user.id as string;
  const email = user.email as string;
  const userMetadata = user.user_metadata as Record<string, unknown> | undefined;
  const name =
    (userMetadata?.full_name as string) ||
    (userMetadata?.first_name as string) ||
    (userMetadata?.name as string) ||
    (user.name as string) ||
    null;

  // Retry logic for DB upsert
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const existing = await prisma.user.findUnique({ where: { id } });

      if (existing) {
        await prisma.user.update({
          where: { id },
          data: {
            email,
            name: name ?? existing.name,
            updatedAt: new Date(),
          },
        });
        console.info("[v0] Updated user from supabase webhook", { id, email });
      } else {
        await prisma.user.create({
          data: {
            id,
            email,
            name,
            balance: 0,
          },
        });
        console.info("[v0] Created user from supabase webhook", { id, email });
      }

      return NextResponse.json({ ok: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[v0] Error syncing user (attempt ${attempt})`, message);

      if (attempt === maxAttempts) {
        return NextResponse.json({ message }, { status: 500 });
      }

      await new Promise((res) => setTimeout(res, 150 * attempt));
    }
  }

  return NextResponse.json({ ok: true });
}
