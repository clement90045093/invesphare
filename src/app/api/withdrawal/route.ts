import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "../../../utils/superbase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, address } = body || {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }
    if (!address) {
      return NextResponse.json({ message: "Missing destination address" }, { status: 400 });
    }

    // Basic auth check - ensure user is signed in via Supabase server client
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

    // TODO: Persist withdrawal request, check balance, integrate provider
    console.log("Withdrawal request from:", supUser.id, { amount, currency, address });

    return NextResponse.json({ ok: true, message: "Withdrawal request received" });
  } catch (err: any) {
    console.error("Error in withdrawal route:", err);
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}
