import { NextResponse } from "next/server";

const BOT_TOKEN = "8290283851:AAEhp4p_9N09yqUabiPigO38Qx-VApLvOr8";
const ADMIN_CHAT_ID = "914539208";

export async function POST(req: Request) {
  try {
    console.log("Notify API called");

    // Check environment variables
    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      console.error("BOT_TOKEN or ADMIN_CHAT_ID missing!");
      return NextResponse.json(
        { error: "Bot token or admin chat ID not set in env" },
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log("Request body:", body);

    const { email, reference, amount, currency } = body;

    // Validate inputs
    if (!email || !reference || !amount || !currency) {
      console.error("Missing required fields in request body");
      return NextResponse.json(
        { error: "Missing email, reference, amount, or currency" },
        { status: 400 }
      );
    }

    // Build Telegram message
    const text = `New deposit request:\nEmail: ${email}\nAmount: ${amount} ${currency}\nReference: ${reference}`;
    console.log("Telegram message text:", text);

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

    // Send message to Telegram
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
      console.error("Telegram API returned error:", data);
      return NextResponse.json(
        { error: `Telegram API failed: ${data.description}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Notify API caught exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
