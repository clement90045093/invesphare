import { NextResponse } from "next/server";

const BOT_TOKEN = "8290283851:AAEhp4p_9N09yqUabiPigO38Qx-VApLvOr8";
const ADMIN_CHAT_ID = "914539208";

export async function POST(req: Request) {
  try {
    console.log("Notify API called");

    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      console.error("BOT_TOKEN or ADMIN_CHAT_ID missing!");
      return NextResponse.json(
        { error: "Bot token or admin chat ID not set" },
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log("Request body:", body);

    let { email, reference, amount, currency } = body;

    // ✅ MOCK EMAIL IF NOT PROVIDED
    if (!email) {
      email = "mockuser@investsphere.com";
    }

    // Validate required fields (email now guaranteed)
    if (!reference || !amount || !currency) {
      console.error("Missing required fields in request body");
      return NextResponse.json(
        { error: "Missing reference, amount, or currency" },
        { status: 400 }
      );
    }

    // Build Telegram message
    const text = `💰 New deposit request
Email: ${email}
Amount: ${amount} ${currency}
Reference: ${reference}`;

    const payload = {
      chat_id: ADMIN_CHAT_ID,
      text,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Approve", callback_data: `approve_${reference}` },
            { text: "❌ Reject", callback_data: `reject_${reference}` },
          ],
        ],
      },
    };

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await telegramRes.json();
    console.log("Telegram API response:", data);

    if (!data.ok) {
      return NextResponse.json(
        { error: `Telegram API failed: ${data.description}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Notify API exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
