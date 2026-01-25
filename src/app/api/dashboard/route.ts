import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { createClient as createSupabaseClient } from "../../../utils/superbase/server";

export async function GET() {
  try {
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

    // find local user by Supabase UUID or email
    let localUser = await prisma.user.findUnique({ where: { id: supUser.id } });
    if (!localUser && supUser.email) {
      localUser = await prisma.user.findUnique({ where: { email: supUser.email } });
    }
    if (!localUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch user investments
    const investments = await prisma.investment.findMany({
      where: { userId: localUser.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        plan: true,
        amount: true,
        currency: true,
        status: true,
        reference: true,
        createdAt: true,
        dailyRate: true,
        duration: true,
        expectedProfit: true,
        totalReturn: true,
        address: true,
      },
    });

    // Calculate totals from active/pending investments
    const activeInvestments = investments.filter((i) => i.status === "active" || i.status === "pending");
    const totalInvested = activeInvestments.reduce((s, i) => s + (i.amount ?? 0), 0);
    const expectedProfit = activeInvestments.reduce((s, i) => s + (i.expectedProfit ?? 0), 0);
    const pendingCount = await prisma.investment.count({ where: { userId: localUser.id, status: "pending" } });

    // Fetch confirmed deposits for balance
    const confirmedDeposits = await prisma.deposit.findMany({
      where: { userId: localUser.id, status: "confirmed" },
      select: { receivedAmount: true, amount: true },
    });
    const deposited = confirmedDeposits.reduce((s, d) => s + (d.receivedAmount ?? d.amount ?? 0), 0);

    return NextResponse.json({
      deposited,
      totalInvested,
      expectedProfit,
      pendingCount,
      investments,
    });
  } catch (err: unknown) {
    console.error("Error in dashboard route:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
