// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { createClient as createSupabaseClient } from "../../../utils/superbase/server";

// Match frontend Investment type exactly
export interface Investment {
  id: string; // string to match frontend
  plan: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  createdAt: string; // send as ISO string
  dailyRate: number;
  duration: number;
  expectedProfit: number;
  totalReturn: number;
  address: string;
}

export async function GET() {
  try {
    // 1️⃣ Authenticate user with Supabase
    const supabase = await createSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Supabase auth error", authError);
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const supUser = authData?.user ?? null;
    if (!supUser?.id) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    // 2️⃣ Find local user by Supabase UUID or email
    let localUser = await prisma.user.findUnique({ where: { id: supUser.id } });
    if (!localUser && supUser.email) {
      localUser = await prisma.user.findUnique({ where: { email: supUser.email } });
    }
    if (!localUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 3️⃣ Fetch recent investments for this user
    const rawInvestments = await prisma.investment.findMany({
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

    // Convert id to string and createdAt to ISO string
    const investments: Investment[] = rawInvestments.map((i) => ({
      ...i,
      id: i.id.toString(),
      createdAt: i.createdAt.toISOString(),
    }));

    // 4️⃣ Calculate totals for active + pending investments
    const activeInvestments = investments.filter(
      (i) => i.status === "active" || i.status === "pending"
    );

    const totalInvested = activeInvestments.reduce((sum, i) => sum + (i.amount ?? 0), 0);
    const expectedProfit = activeInvestments.reduce((sum, i) => sum + (i.expectedProfit ?? 0), 0);

    // 5️⃣ Count pending investments
    const pendingCount = await prisma.investment.count({
      where: { userId: localUser.id, status: "pending" },
    });

    // 6️⃣ Sum confirmed deposits
    const confirmedDeposits = await prisma.deposit.findMany({
      where: { userId: localUser.id, status: "approved" },
      select: { receivedAmount: true, amount: true },
    });

    const deposited = confirmedDeposits.reduce(
      (sum, d) => sum + (d.receivedAmount ?? d.amount ?? 0),
      0
    );

    // 7️⃣ Return dashboard data
    return NextResponse.json({
      deposited,
      profit: expectedProfit, // for BalanceCards
      pendingCount,
      totalInvested, // optional: can be used later
      investments,
    });
  } catch (err: unknown) {
    console.error("Dashboard API error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
