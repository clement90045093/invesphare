import { NextResponse } from "next/server";
import { createClient } from "../../../utils/superbase/server";

// Plan configurations
const PLAN_CONFIG = {
  starter: { dailyRate: 0.05, duration: 30 },
  pro: { dailyRate: 0.08, duration: 60 },
  premium: { dailyRate: 0.12, duration: 90 },
};

// Wallet addresses per currency
const WALLET_ADDRESSES: Record<string, string> = {
  "USDT-TRC20": "TYourTRC20WalletAddressHere",
  "USDT-ERC20": "0xYourERC20WalletAddressHere",
  BTC: "bc1YourBTCWalletAddressHere",
};

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, currency, plan } = body;

    // Validate required fields
    if (!amount || !currency || !plan) {
      return NextResponse.json(
        { error: "Missing required fields: amount, currency, plan" },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Validate plan
    const validPlans = ["starter", "pro", "premium"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Validate currency
    const validCurrencies = ["USDT-TRC20", "USDT-ERC20", "BTC"];
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json(
        { error: "Invalid currency selected" },
        { status: 400 }
      );
    }

    // Get plan config
    const planConfig = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG];
    const dailyRate = planConfig.dailyRate;
    const duration = planConfig.duration;
    const expectedProfit = amount * dailyRate * duration;
    const totalReturn = amount + expectedProfit;
    const address = WALLET_ADDRESSES[currency];

    // Generate a unique reference for this investment
    const reference = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min expiry

    // Save investment to database using Supabase
    const { data: investment, error } = await supabase
      .from("Investment")
      .insert({
        userId: user.id,
        plan,
        amount,
        currency,
        dailyRate,
        duration,
        expectedProfit,
        totalReturn,
        address,
        reference,
        status: "pending",
        expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create investment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reference: investment.reference,
      address,
      message: "Investment request created successfully",
      data: {
        amount,
        currency,
        plan,
        dailyRate,
        duration,
        expectedProfit,
        totalReturn,
        status: "pending",
        expiresAt: investment.expiresAt,
      },
    });
  } catch (error) {
    console.error("Investment API error:", error);
    return NextResponse.json(
      { error: "Failed to process investment request" },
      { status: 500 }
    );
  }
}
