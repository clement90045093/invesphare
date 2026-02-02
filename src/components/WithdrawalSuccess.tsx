'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, Bell } from 'lucide-react';

interface WithdrawalSuccessProps {
  data: {
    amount: number;
    walletAddress: string;
    email: string;
  };
  onReset: () => void;
}

export default function WithdrawalSuccess({ data, onReset }: WithdrawalSuccessProps) {
  const maskedAddress = `${data.walletAddress.slice(0, 6)}...${data.walletAddress.slice(-4)}`;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-green-200">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600">Withdrawal Successful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Details */}
          <div className="space-y-4 rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-semibold text-lg">${data.amount.toFixed(2)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Wallet Address</span>
              <span className="font-mono text-sm text-right break-all">{maskedAddress}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-green-600">Processing</span>
              </span>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Telegram Notification</p>
                <p className="text-xs text-blue-700">Sent to your registered account</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Email Confirmation</p>
                <p className="text-xs text-blue-700">Sent to {data.email}</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your withdrawal is being processed. You'll receive updates via Telegram and email.
              Most withdrawals complete within 1-2 hours.
            </p>
          </div>

          {/* Action Button */}
          <Button onClick={onReset} className="w-full bg-transparent" variant="outline">
            Make Another Withdrawal
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
