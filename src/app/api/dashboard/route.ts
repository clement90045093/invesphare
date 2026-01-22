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

    // Find local user by Supabase UUID or email
    let localUser = await prisma.user.findUnique({ where: { id: supUser.id } });
    if (!localUser && supUser.email) {
      localUser = await prisma.user.findUnique({ where: { email: supUser.email } });
    }
    if (!localUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Last 10 transactions
    const recentTransactions = await prisma.deposit.findMany({
      where: { userId: localUser.id },
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

    // Pending deposits
    const pendingCount = await prisma.deposit.count({
      where: { userId: localUser.id, status: "pending" },
    });

    // Sum approved deposits
    const totalDeposited = await prisma.deposit.aggregate({
      where: { userId: localUser.id, status: "approved" },
      _sum: { receivedAmount: true, amount: true },
    });

    const deposited = totalDeposited._sum.receivedAmount ?? totalDeposited._sum.amount ?? 0;

    // Example profit calculation (replace with your own logic)
    const profit = 0; // or calculate based on your business logic

    return NextResponse.json({ deposited, pendingCount, recentTransactions, profit });
  } catch (err: any) {
    console.error("Error in dashboard route:", err);
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}
