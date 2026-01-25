import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "../../../lib/prisma";
import { createClient as createSupabaseClient } from "../../../utils/superbase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[v0] Invest API received body:", JSON.stringify(body, null, 2));
    const { amount, currency, plan, dailyRate, duration, expectedProfit, totalReturn, address } = body || {};
    console.log("[v0] Parsed values:", { dailyRate, duration, expectedProfit, totalReturn, address });

    // get authenticated user from Supabase server client
    const supabase = await createSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

    const supUser = authData?.user;
    if (!supUser?.id) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

    // find local user
    let localUser = await prisma.user.findUnique({ where: { id: supUser.id } });
    if (!localUser && supUser.email) {
      localUser = await prisma.user.findUnique({ where: { email: supUser.email } });
    }

    // create local user if needed
    const nameFromMeta = supUser.user_metadata?.full_name || supUser.user_metadata?.name || null;
    if (!localUser) {
      localUser = await prisma.user.create({ data: { id: supUser.id, email: supUser.email || "", name: nameFromMeta } });
    } else {
      await prisma.user.update({
        where: { id: localUser.id },
        data: { email: supUser.email || localUser.email, name: nameFromMeta ?? localUser.name },
      });
    }

    if (!plan) return NextResponse.json({ message: "Plan is required" }, { status: 400 });
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    // generate reference
    const reference = `INV-${crypto.randomUUID()}`;

    // save investment with Prisma
    const investment = await prisma.investment.create({
      data: {
        userId: localUser.id,
        plan,
        amount: Number(amount),
        currency: currency || "USDT",
        status: "pending",
        reference,
        createdAt: new Date(),
        dailyRate: Number(dailyRate) || 0,
        duration: Number(duration) || 0,
        expectedProfit: Number(expectedProfit) || 0,
        totalReturn: Number(totalReturn) || 0,
        address: address || "",
      },
    });

    return NextResponse.json({ success: true, investment: { reference, id: investment.id } });
  } catch (err: any) {
    console.error("Invest API error:", err);
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}
