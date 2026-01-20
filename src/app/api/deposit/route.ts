import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "../../../lib/prisma";
import * as provider from "../../../lib/provider";
import { createClient as createSupabaseClient } from "../../../utils/superbase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency } = body || {};

    // get authenticated user from Supabase server client
    const supabase = await createSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error("Supabase auth error", authError);
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const supUser = authData?.user ?? null;
    if (!supUser || !supUser.id) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    // find local user by Supabase UUID first, else create with that id
    let localUser = await prisma.user.findUnique({ where: { id: supUser.id } });
    if (!localUser) {
      // if not found by id, try by email to avoid duplicates
      if (supUser.email) {
        localUser = await prisma.user.findUnique({ where: { email: supUser.email } });
      }
    }

    const nameFromMeta = supUser.user_metadata?.full_name || supUser.user_metadata?.name || null;
    if (!localUser) {
      // create user with Supabase UUID as primary key
      localUser = await prisma.user.create({ data: { id: supUser.id, email: supUser.email || "", name: nameFromMeta } });
    } else {
      // ensure local record has up-to-date name/email
      await prisma.user.update({ where: { id: localUser.id }, data: { email: supUser.email || localUser.email, name: nameFromMeta ?? localUser.name } });
    }

    console.log("Deposit request:", body);

    if (currency !== "USDT-TRC20") {
      return NextResponse.json({ message: "Only USDT-TRC20 deposits are accepted" }, { status: 400 });
    }

    const amt = Number(amount);
    if (!amt || isNaN(amt) || amt <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    // generate a short, unguessable reference
    const reference = Date.now().toString(36) + "-" + crypto.randomBytes(4).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // create or allocate an address from provider (mock in dev)
    const { address, providerAddressId } = await provider.createAddress({ reference });

    // persist pending deposit
    const deposit = await prisma.deposit.create({
      data: {
        userId: localUser.id,
        amount: Number(amt),
        currency,
        address,
        providerAddressId,
        reference,
        status: "pending",
        expiresAt,
      },
    });

    return NextResponse.json({ address, reference, expiresAt: expiresAt.toISOString(), amount: deposit.amount });
  } catch (err: any) {
    console.error("Error in deposit route:", err);
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}
