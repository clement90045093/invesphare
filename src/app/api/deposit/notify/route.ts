import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: Request) {
  try {
    console.log('[v0] Deposit notify API called');

    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      console.error('[v0] BOT_TOKEN or ADMIN_CHAT_ID missing!');
      return NextResponse.json(
        { error: 'Bot token or admin chat ID not set' },
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log('[v0] Request body:', body);

    let { email, reference, amount, currency } = body;

    // Mock email if not provided
    if (!email) {
      email = 'mockuser@investsphere.com';
    }

    // Validate required fields
    if (!reference || !amount || !currency) {
      console.error('[v0] Missing required fields in request body');
      return NextResponse.json(
        { error: 'Missing reference, amount, or currency' },
        { status: 400 }
      );
    }

    // Build Telegram message with proper format
    const text = `💰 NEW DEPOSIT REQUEST

💵 Amount: ${amount} ${currency}
📧 Email: "mockemail.gmail.com"
🔗 Reference: ${reference}

⏰ Timestamp: ${new Date().toLocaleString()}`;

    const payload = {
      chat_id: ADMIN_CHAT_ID,
      text,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '✅ Approve',
              callback_data: `deposit_approve_${reference}`,
            },
            { text: '❌ Reject', callback_data: `deposit_reject_${reference}` },
          ],
        ],
      },
    };

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await telegramRes.json();
    console.log('[v0] Telegram API response:', data);

    if (!data.ok) {
      console.error('[v0] Telegram API failed:', data.description);
      return NextResponse.json(
        { error: `Telegram API failed: ${data.description}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[v0] Notify API exception:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
