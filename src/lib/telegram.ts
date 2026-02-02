const BOT_TOKEN = "8290283851:AAEhp4p_9N09yqUabiPigO38Qx-VApLvOr8";
const CHAT_ID = "914539208";

export interface TelegramNotificationPayload {
  type: 'deposit' | 'withdrawal';
  amount: number;
  walletAddress?: string;
  email: string;
  transactionId: string;
}

export async function sendTelegramNotification(
  payload: TelegramNotificationPayload
) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return;
  }

  const { type, amount, walletAddress, email, transactionId } = payload;

  const isWithdrawal = type === 'withdrawal';
  const title = isWithdrawal ? '💸 NEW WITHDRAWAL REQUEST' : '💰 NEW DEPOSIT REQUEST';
  const actionPrefix = isWithdrawal ? 'withdraw' : 'deposit';

  const message = `
${title}

💵 Amount: $${amount.toFixed(2)}
📧 Email: ${email}
🔗 ID: ${transactionId}
${walletAddress ? `📮 Wallet: \`${walletAddress}\`` : ''}

⏰ Timestamp: ${new Date().toLocaleString()}
  `;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '✅ Approve',
          callback_data: `${actionPrefix}_approve_${transactionId}`,
        },
        {
          text: '❌ Reject',
          callback_data: `${actionPrefix}_reject_${transactionId}`,
        },
      ],
    ],
  };

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
          reply_markup: inlineKeyboard,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to send Telegram notification:', await response.text());
    } else {
      console.log('[v0] Telegram notification sent for', type);
    }
  } catch (error) {
    console.error('[v0] Error sending Telegram notification:', error);
  }
}
