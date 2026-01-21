import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (!update.callback_query) {
      return NextResponse.json({ ok: true });
    }

    const callback = update.callback_query;
    const data: string = callback.data;
    const chatId = callback.message.chat.id;
    const messageId = callback.message.message_id;

    // ✅ APPROVE
    if (data.startsWith("approve_")) {
      const reference = data.replace("approve_", "");

      await prisma.deposit.update({
        where: { reference },
        data: { status: "approved" },
      });

      await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback_query_id: callback.id,
            text: "Deposit approved ✅",
          }),
        }
      );

      await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: `✅ Deposit APPROVED\nReference: ${reference}`,
          }),
        }
      );
    }

    // ❌ REJECT
    if (data.startsWith("reject_")) {
      const reference = data.replace("reject_", "");

      await prisma.deposit.update({
        where: { reference },
        data: { status: "failed" },
      });

      await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback_query_id: callback.id,
            text: "Deposit rejected ❌",
          }),
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
