// src/app/api/dashboard/summary/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient as createSupabaseClient } from "@/utils/superbase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

    const supUser = authData?.user ?? null;
    if (!supUser || !supUser.id) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

    // Find user in Prisma
    let user = await prisma.user.findUnique({ where: { id: supUser.id } });
    if (!user && supUser.email) user = await prisma.user.findUnique({ where: { email: supUser.email } });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Fetch deposits
    const deposits = await prisma.deposit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        amount: true,
        receivedAmount: true,
        status: true,
        currency: true,
        createdAt: true,
        reference: true,
        txHash: true,
      },
    });

    const pendingCount = await prisma.deposit.count({ where: { userId: user.id, status: "pending" } });

    // Sum only confirmed deposits for "Deposited"
    const deposited = deposits
      .filter(d => d.status === "confirmed")
      .reduce((sum, d) => sum + (d.receivedAmount ?? d.amount ?? 0), 0);

    // Optional: calculate profit if you have a plan rate per deposit
    const profit = deposits
      .filter(d => d.status === "confirmed")
      .reduce((sum, d) => sum + ((d.receivedAmount ?? d.amount ?? 0) * 0.05), 0); // 5% example

    return NextResponse.json({ deposited, pendingCount, profit, recentTransactions: deposits });
  } catch (err: any) {
    console.error("Dashboard summary error:", err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
