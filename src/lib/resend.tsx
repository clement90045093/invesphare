import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface WithdrawalEmailParams {
  email: string;
  amount: number;
  walletAddress: string;
  transactionId: string;
}

export async function sendWithdrawalEmail({
  email,
  amount,
  walletAddress,
  transactionId,
}: WithdrawalEmailParams) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      throw new Error('Email service not configured');
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@investsphare.com',
      to: email,
      subject: `Withdrawal Confirmation - ${amount} USD`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                overflow: hidden;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                padding: 30px;
              }
              .info-block {
                background-color: #f9f9f9;
                border-left: 4px solid #667eea;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .value {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                word-break: break-all;
              }
              .amount {
                font-size: 32px;
                font-weight: 700;
                color: #667eea;
                margin: 20px 0;
              }
              .footer {
                background-color: #f5f5f5;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #e0e0e0;
              }
              .button {
                display: inline-block;
                background-color: #667eea;
                color: white;
                padding: 12px 30px;
                border-radius: 4px;
                text-decoration: none;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💰 Withdrawal Confirmed</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>Your withdrawal request has been successfully processed. Here are the details:</p>
                
                <div class="amount">${amount.toFixed(2)} USD</div>
                
                <div class="info-block">
                  <div class="label">Transaction ID</div>
                  <div class="value">${transactionId}</div>
                </div>
                
                <div class="info-block">
                  <div class="label">Destination Wallet</div>
                  <div class="value">${walletAddress}</div>
                </div>
                
                <div class="info-block">
                  <div class="label">Date</div>
                  <div class="value">${new Date().toLocaleString()}</div>
                </div>
                
                <p>Your funds will be transferred to your wallet within the next 24-48 hours. Please do not share your transaction ID with anyone.</p>
                
                <p>If you have any questions or concerns, please contact our support team.</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 InvestSphare. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (result.error) {
      console.error('Resend email error:', result.error);
      throw new Error(result.error.message);
    }

    console.log('[v0] Withdrawal email sent successfully:', result.data);
    return result;
  } catch (error) {
    console.error('[v0] Failed to send withdrawal email:', error);
    throw error;
  }
}
