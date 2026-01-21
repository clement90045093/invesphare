import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const BOT_TOKEN = "8290283851:AAEhp4p_9N09yqUabiPigO38Qx-VApLvOr8";

export async function POST(req: NextRequest) {
  try {
    if (!BOT_TOKEN) {
      console.error("❌ TELEGRAM_BOT_TOKEN missing");
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const update = await req.json();
    console.log("📩 Telegram update:", update);

    // Telegram sends many update types — we only care about button clicks
    if (!update.callback_query) {
      return NextResponse.json({ ok: true });
    }

    const callback = update.callback_query;
    const data: string | undefined = callback.data;

    if (!data) {
      console.warn("⚠️ Callback without data");
      return NextResponse.json({ ok: true });
    }

    const chatId = callback.message?.chat?.id;
    const messageId = callback.message?.message_id;

    if (!chatId || !messageId) {
      console.warn("⚠️ Missing chat/message info");
      return NextResponse.json({ ok: true });
    }

    // -------------------------
    // ACTION PARSING
    // -------------------------
    const [action, reference] = data.split("_");

    if (!reference) {
      console.warn("⚠️ Invalid callback format:", data);
      return NextResponse.json({ ok: true });
    }

    console.log(`🔘 Action: ${action}, Reference: ${reference}`);

    // Fetch deposit first (important)
    const deposit = await prisma.deposit.findUnique({
      where: { reference },
    });

    if (!deposit) {
      console.warn("❌ Deposit not found:", reference);
      await answer(callback.id, "Deposit not found ❌");
      return NextResponse.json({ ok: true });
    }

    // Prevent double actions
    if (deposit.status !== "pending") {
      await answer(callback.id, `Already ${deposit.status} ⚠️`);
      return NextResponse.json({ ok: true });
    }

    // -------------------------
    // APPROVE
    // -------------------------
    if (action === "approve") {
      await prisma.deposit.update({
        where: { reference },
        data: { status: "approved", confirmedAt: new Date() },
      });

      await answer(callback.id, "Deposit approved ✅");
      await editMessage(chatId, messageId, `✅ DEPOSIT APPROVED\n\nReference: ${reference}`);

      console.log("🟢 Deposit approved:", reference);
    }

    // -------------------------
    // REJECT
    // -------------------------
    if (action === "reject") {
      await prisma.deposit.update({
        where: { reference },
        data: { status: "failed" },
      });

      await answer(callback.id, "Deposit rejected ❌");
      await editMessage(chatId, messageId, `❌ DEPOSIT REJECTED\n\nReference: ${reference}`);

      console.log("🔴 Deposit rejected:", reference);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("🔥 Telegram webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

/* ---------------- HELPERS ---------------- */

async function answer(callbackQueryId: string, text: string) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
    }),
  });
}

async function editMessage(chatId: number, messageId: number, text: string) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
    }),
  });
}
