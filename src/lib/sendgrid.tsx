interface SendWithdrawalEmailPayload {
  email: string;
  amount: number;
  walletAddress: string;
  transactionId: string;
}

export async function sendWithdrawalEmail(payload: SendWithdrawalEmailPayload) {
  try {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com';

    if (!sendgridApiKey) {
      console.warn('[v0] SendGrid API key not configured');
      return;
    }

    const emailContent = generateWithdrawalEmailHTML(payload);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: payload.email }],
            subject: `Withdrawal Confirmation - $${payload.amount.toFixed(2)}`,
          },
        ],
        from: { email: fromEmail },
        content: [
          {
            type: 'text/html',
            value: emailContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`);
    }

    console.log('[v0] Withdrawal email sent successfully to:', payload.email);
  } catch (error) {
    console.error('[v0] Error sending withdrawal email:', error);
    // Don't throw - withdrawal should succeed even if email fails
  }
}

function generateWithdrawalEmailHTML(payload: SendWithdrawalEmailPayload): string {
  const maskedAddress = `${payload.walletAddress.slice(0, 6)}...${payload.walletAddress.slice(-4)}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #666; }
    .value { color: #333; }
    .status { background: #e8f5e9; color: #2e7d32; padding: 12px; border-radius: 6px; text-align: center; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Withdrawal Confirmed</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your withdrawal request has been successfully submitted and is now being processed.</p>

      <div class="details">
        <div class="detail-row">
          <span class="label">Amount:</span>
          <span class="value"><strong>$${payload.amount.toFixed(2)}</strong></span>
        </div>
        <div class="detail-row">
          <span class="label">Wallet Address:</span>
          <span class="value"><code>${maskedAddress}</code></span>
        </div>
        <div class="detail-row">
          <span class="label">Transaction ID:</span>
          <span class="value"><code>${payload.transactionId}</code></span>
        </div>
        <div class="detail-row">
          <span class="label">Date & Time:</span>
          <span class="value">${new Date().toLocaleString()}</span>
        </div>
      </div>

      <div class="status">
        ⏳ Processing - Most withdrawals complete within 1-2 hours
      </div>

      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Your funds will be transferred to the provided wallet address</li>
        <li>You'll receive updates via Telegram and email</li>
        <li>Keep your transaction ID for reference</li>
      </ul>

      <p><strong>Need help?</strong><br>
      If you have any questions, reply to this email or contact our support team.</p>

      <p>Best regards,<br><strong>The Withdrawal Team</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply with sensitive information.</p>
      <p>&copy; 2026 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
