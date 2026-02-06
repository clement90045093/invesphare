import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import { sendWithdrawalEmail } from '@/lib/resend';
import prisma from '@/lib/prisma';
import { createClient as createSupabaseClient } from '@/utils/superbase/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, walletAddress, email } = await request.json();

    /* =======================
       BASIC VALIDATION
    ======================== */
    if (!amount || !walletAddress || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid withdrawal amount' },
        { status: 400 }
      );
    }

    if (withdrawAmount < 10) {
      return NextResponse.json(
        { success: false, error: 'Minimum withdrawal is $10' },
        { status: 400 }
      );
    }

    if (withdrawAmount > 10000) {
      return NextResponse.json(
        { success: false, error: 'Maximum withdrawal is $10,000' },
        { status: 400 }
      );
    }

    /* =======================
       WALLET VALIDATION
    ======================== */
    const isEthereum = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
    const isBitcoin = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(walletAddress);
    const isTron = /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(walletAddress);

    if (!isEthereum && !isBitcoin && !isTron) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    /* =======================
       AUTHENTICATE USER
    ======================== */
    const supabase = await createSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError)
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );

    const supUser = authData?.user;
    if (!supUser?.id)
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );

    let localUser = await prisma.user.findUnique({ where: { id: supUser.id } });
    if (!localUser && supUser.email) {
      localUser = await prisma.user.findUnique({ where: { email: supUser.email } });
    }
    if (!localUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    /* =======================
       CALCULATE AVAILABLE BALANCE
       Use the same logic as dashboard
    ======================== */
    const confirmedDeposits = await prisma.deposit.findMany({
      where: { userId: localUser.id, status: 'approved' },
      select: { amount: true, receivedAmount: true },
    });

    const totalDeposited = confirmedDeposits.reduce(
      (sum, d) => sum + (d.receivedAmount ?? d.amount ?? 0),
      0
    );

    const rawInvestments = await prisma.investment.findMany({
      where: { userId: localUser.id },
      select: {
        id: true,
        amount: true,
        status: true,
      },
    });

    const activeInvestments = rawInvestments.filter(i =>
      ['active', 'pending'].includes((i.status ?? '').toLowerCase())
    );

    const totalInvested = activeInvestments.reduce(
      (sum, i) => sum + Number(i.amount ?? 0),
      0
    );

    const availableBalance = totalDeposited - totalInvested;

    if (withdrawAmount > availableBalance) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient balance. You can withdraw up to $${availableBalance.toFixed(2)}`,
        },
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
       SAVE TO DATABASE
    ======================== */
    await prisma.withdrawal.create({
      data: {
        userId: localUser.id,
        transactionId,
        amount: withdrawAmount,
        walletAddress,
        email,
        status: 'pending',
        createdAt: new Date(),
      },
    });

    /* =======================
       TELEGRAM & EMAIL NOTIFICATION
    ======================== */
    await sendTelegramNotification({
      type: 'withdrawal',
      amount: withdrawAmount,
      walletAddress,
      email,
      transactionId,
    });

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
      availableBalance,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal request submitted successfully',
        transactionId,
        availableBalance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[withdraw] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
