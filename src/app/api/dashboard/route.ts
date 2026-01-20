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

    const pendingCount = await prisma.deposit.count({
      where: { userId: localUser.id, status: "pending" },
    });

    // Calculate deposited dynamically from confirmed deposits
    const deposited = recentTransactions
      .filter((d) => d.status === "confirmed")
      .reduce((s, d) => s + (d.receivedAmount ?? d.amount ?? 0), 0);

    return NextResponse.json({ deposited, pendingCount, recentTransactions });
  } catch (err: any) {
    console.error("Error in dashboard route:", err);
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}
