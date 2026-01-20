import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const reference = url.searchParams.get("reference");
    if (!reference) {
      return NextResponse.json({ message: "missing reference" }, { status: 400 });
    }

    const deposit = await prisma.deposit.findUnique({ where: { reference } });
    if (!deposit) {
      return NextResponse.json({ message: "not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: deposit.status,
      txHash: deposit.txHash || null,
      receivedAmount: deposit.receivedAmount || null,
      expiresAt: deposit.expiresAt ? deposit.expiresAt.toISOString() : null,
    });
  } catch (err: any) {
    console.error("deposit status error", err);
    return NextResponse.json({ message: err?.message || "server error" }, { status: 500 });
  }
}
