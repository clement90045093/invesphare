import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "../../../lib/prisma";
import { createClient as createSupabaseClient } from "../../../utils/superbase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency } = body || {};

    // ==============================
    // 1️⃣ Authenticate User (Supabase)
    // ==============================

    const supabase = await createSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const supUser = authData.user;

    // ==============================
    // 2️⃣ Sync User With Prisma
    // ==============================

    let localUser = await prisma.user.findUnique({
      where: { id: supUser.id },
    });

    if (!localUser) {
      localUser = await prisma.user.create({
        data: {
          id: supUser.id,
          email: supUser.email || "",
          name:
            supUser.user_metadata?.full_name ||
            supUser.user_metadata?.name ||
            null,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: localUser.id },
        data: {
          email: supUser.email || localUser.email,
          name:
            supUser.user_metadata?.full_name ||
            supUser.user_metadata?.name ||
            localUser.name,
        },
      });
    }

    // ==============================
    // 3️⃣ Validate Deposit
    // ==============================

    if (currency !== "USDT-TRC20") {
      return NextResponse.json(
        { message: "Only USDT-TRC20 deposits are accepted" },
        { status: 400 }
      );
    }

    const amt = Number(amount);

    if (!amt || isNaN(amt) || amt <= 0) {
      return NextResponse.json(
        { message: "Invalid amount" },
        { status: 400 }
      );
    }

    // ==============================
    // 4️⃣ Use ONE Fixed Wallet
    // ==============================

    const address = process.env.USDT_TRC20_WALLET;

    if (!address) {
      return NextResponse.json(
        { message: "Deposit wallet not configured" },
        { status: 500 }
      );
    }

    const providerAddressId = null;

    // ==============================
    // 5️⃣ Generate Reference
    // ==============================

    const reference =
      Date.now().toString(36) +
      "-" +
      crypto.randomBytes(4).toString("hex");

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    // ==============================
    // 6️⃣ Save Deposit Record
    // ==============================

    const deposit = await prisma.deposit.create({
      data: {
        userId: localUser.id,
        amount: amt,
        currency,
        address,
        providerAddressId,
        reference,
        status: "pending",
        expiresAt,
      },
    });

    // ==============================
    // 7️⃣ Return Response
    // ==============================

    return NextResponse.json({
      address,
      reference,
      expiresAt: expiresAt.toISOString(),
      amount: deposit.amount,
    });

  } catch (err: any) {
    console.error("Deposit error:", err);

    return NextResponse.json(
      { message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}