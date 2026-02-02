import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: NextRequest) {
  try {
    if (!BOT_TOKEN) {
      console.error('❌ TELEGRAM_BOT_TOKEN missing');
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const update = await req.json();
    console.log('[v0] Telegram update:', update);

    if (!update.callback_query) {
      return NextResponse.json({ ok: true });
    }

    const callback = update.callback_query;
    const data: string | undefined = callback.data;

    if (!data) {
      console.warn('⚠️ Callback without data');
      return NextResponse.json({ ok: true });
    }

    const chatId = callback.message?.chat?.id;
    const messageId = callback.message?.message_id;

    if (!chatId || !messageId) {
      console.warn('⚠️ Missing chat/message info');
      return NextResponse.json({ ok: true });
    }

    // Parse callback data: "type_action_reference"
    const parts = data.split('_');
    const type = parts[0]; // 'deposit' or 'withdraw'
    const action = parts[1]; // 'approve' or 'reject'
    const reference = parts.slice(2).join('_'); // transaction ID

    if (!type || !action || !reference) {
      console.warn('⚠️ Invalid callback format:', data);
      return NextResponse.json({ ok: true });
    }

    console.log(`[v0] Type: ${type}, Action: ${action}, Reference: ${reference}`);

    // Handle Deposits
    if (type === 'deposit') {
      const deposit = await prisma.deposit.findUnique({
        where: { reference },
      });

      if (!deposit) {
        console.warn('❌ Deposit not found:', reference);
        await answer(callback.id, 'Deposit not found ❌');
        return NextResponse.json({ ok: true });
      }

      if (deposit.status !== 'pending') {
        await answer(callback.id, `Already ${deposit.status} ⚠️`);
        return NextResponse.json({ ok: true });
      }

      if (action === 'approve') {
        await prisma.deposit.update({
          where: { reference },
          data: { status: 'approved', confirmedAt: new Date() },
        });

        await answer(callback.id, 'Deposit approved ✅');
        await editMessage(
          chatId,
          messageId,
          `✅ DEPOSIT APPROVED\n\nReference: ${reference}`
        );

        console.log('🟢 Deposit approved:', reference);
      } else if (action === 'reject') {
        await prisma.deposit.update({
          where: { reference },
          data: { status: 'failed' },
        });

        await answer(callback.id, 'Deposit rejected ❌');
        await editMessage(
          chatId,
          messageId,
          `❌ DEPOSIT REJECTED\n\nReference: ${reference}`
        );

        console.log('🔴 Deposit rejected:', reference);
      }
    }
    // Handle Withdrawals
    else if (type === 'withdraw') {
      const withdrawal = await prisma.withdrawal.findUnique({
        where: { transactionId: reference },
      });

      if (!withdrawal) {
        console.warn('❌ Withdrawal not found:', reference);
        await answer(callback.id, 'Withdrawal not found ❌');
        return NextResponse.json({ ok: true });
      }

      if (withdrawal.status !== 'pending') {
        await answer(callback.id, `Already ${withdrawal.status} ⚠️`);
        return NextResponse.json({ ok: true });
      }

      if (action === 'approve') {
        await prisma.withdrawal.update({
          where: { transactionId: reference },
          data: { status: 'approved', approvedAt: new Date() },
        });

        await answer(callback.id, 'Withdrawal approved ✅');
        await editMessage(
          chatId,
          messageId,
          `✅ WITHDRAWAL APPROVED\n\nReference: ${reference}`
        );

        console.log('🟢 Withdrawal approved:', reference);
      } else if (action === 'reject') {
        await prisma.withdrawal.update({
          where: { transactionId: reference },
          data: { status: 'rejected', rejectedAt: new Date() },
        });

        await answer(callback.id, 'Withdrawal rejected ❌');
        await editMessage(
          chatId,
          messageId,
          `❌ WITHDRAWAL REJECTED\n\nReference: ${reference}`
        );

        console.log('🔴 Withdrawal rejected:', reference);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('🔥 Telegram webhook error:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

async function answer(callbackQueryId: string, text: string) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
    }),
  });
}

async function editMessage(chatId: number, messageId: number, text: string) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
    }),
  });
}
