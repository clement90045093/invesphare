import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "../../../lib/prisma";
import { createClient as createSupabaseClient } from "../../../utils/superbase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, plan, dailyRate, duration, expectedProfit, totalReturn, address } = body || {};

    // 1️⃣ Authenticate user via Supabase
    const supabase = await createSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError)
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });

    const supUser = authData?.user;
    if (!supUser?.id)
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });

    // 2️⃣ Find or create local user
    let localUser = await prisma.user.findUnique({ where: { id: supUser.id } });
    if (!localUser && supUser.email) {
      localUser = await prisma.user.findUnique({ where: { email: supUser.email } });
    }

    const nameFromMeta = supUser.user_metadata?.full_name || supUser.user_metadata?.name || null;
    if (!localUser) {
      localUser = await prisma.user.create({ data: { id: supUser.id, email: supUser.email || "", name: nameFromMeta } });
    } else {
      await prisma.user.update({
        where: { id: localUser.id },
        data: { email: supUser.email || localUser.email, name: nameFromMeta ?? localUser.name },
      });
    }

    // 3️⃣ Validate request
    if (!plan) return NextResponse.json({ success: false, message: "Plan is required" }, { status: 400 });
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 400 });

    const investAmount = Number(amount);

    // 4️⃣ Fetch confirmed deposits (same as dashboard)
    const confirmedDeposits = await prisma.deposit.findMany({
      where: { userId: localUser.id, status: "approved" },
      select: { amount: true, receivedAmount: true },
    });
    const totalDeposited = confirmedDeposits.reduce((sum, d) => sum + (d.receivedAmount ?? d.amount ?? 0), 0);

    // 5️⃣ Fetch user's active/pending investments
    const rawInvestments = await prisma.investment.findMany({
      where: { userId: localUser.id },
      select: { amount: true, status: true },
    });
    const activeInvestments = rawInvestments.filter(i =>
      ["active", "pending"].includes((i.status ?? "").toLowerCase())
    );
    const totalInvested = activeInvestments.reduce((sum, i) => sum + Number(i.amount ?? 0), 0);

    // 6️⃣ Check if user has enough balance to invest
    const availableBalance = totalDeposited - totalInvested;
    if (investAmount > availableBalance) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient deposited balance. Available: $${availableBalance.toFixed(2)}`,
        },
        { status: 400 }
      );
    }

    // 7️⃣ Generate reference
    const reference = `INV-${crypto.randomUUID()}`;

    // 8️⃣ Save investment
    const investment = await prisma.investment.create({
      data: {
        userId: localUser.id,
        plan,
        amount: investAmount,
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
    return NextResponse.json({ success: false, message: err?.message || "Server error" }, { status: 500 });
  }
}
