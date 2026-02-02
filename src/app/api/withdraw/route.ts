import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import { sendWithdrawalEmail } from '@/lib/resend';
// import prisma from '@/lib/prisma'; // ⛔ TEMPORARILY DISABLED

export async function POST(request: NextRequest) {
  try {
    const { amount, walletAddress, email } = await request.json();

    /* =======================
       BASIC VALIDATION
    ======================== */
    if (!amount || !walletAddress || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid withdrawal amount' },
        { status: 400 }
      );
    }

    if (withdrawAmount < 10) {
      return NextResponse.json(
        { error: 'Minimum withdrawal is $10' },
        { status: 400 }
      );
    }

    if (withdrawAmount > 10000) {
      return NextResponse.json(
        { error: 'Maximum withdrawal is $10,000' },
        { status: 400 }
      );
    }

    /* =======================
       WALLET VALIDATION
    ======================== */
    const isEthereum = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
    const isBitcoin =
      /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(walletAddress);
    const isTron = /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(walletAddress);

    if (!isEthereum && !isBitcoin && !isTron) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    /* =======================
       GENERATE TRANSACTION ID
    ======================== */
    const transactionId = `WTH-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    /* =======================
       🚫 DATABASE SAVE (DISABLED)
       Enable this later after
       Prisma + Supabase are fixed
    ======================== */
    /*
    await prisma.withdrawal.create({
      data: {
        transactionId,
        amount: withdrawAmount,
        walletAddress,
        email,
        status: 'pending',
      },
    });
    */

    /* =======================
       TELEGRAM NOTIFICATION
    ======================== */
    await sendTelegramNotification({
      type: 'withdrawal',
      amount: withdrawAmount,
      walletAddress,
      email,
      transactionId,
    });

    /* =======================
       EMAIL CONFIRMATION
    ======================== */
    await sendWithdrawalEmail({
      email,
      amount: withdrawAmount,
      walletAddress,
      transactionId,
    });

    console.log('[withdraw] Request processed:', {
      transactionId,
      amount: withdrawAmount,
      walletAddress,
      email,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal request submitted successfully',
        transactionId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[withdraw] Error:', error);

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
