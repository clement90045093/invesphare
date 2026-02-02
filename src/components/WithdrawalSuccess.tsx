'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface WithdrawalSuccessProps {
  data: {
    amount: number;
    walletAddress: string;
    email: string;
  };
  onReset: () => void;
}

export default function WithdrawalSuccess({ data, onReset }: WithdrawalSuccessProps) {
  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-[#0D1B2A] overflow-hidden">
        <div className="space-y-6 p-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Successful</h1>
            <p className="text-sm text-gray-400">
              Your withdrawal request has been submitted
            </p>
          </div>

          {/* Summary Card */}
          <div className="rounded-lg bg-[#1C2541] p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="font-semibold text-white">
                  ${data.amount.toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-gray-700" />
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-emerald-500">{data.email}</span>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-xs text-gray-500 leading-relaxed">
            Confirmation email sent. Admin will review your request and process it shortly.
          </p>

          {/* Button */}
          <Button
            onClick={onReset}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
          >
            Make Another Withdrawal
          </Button>
        </div>
      </div>
    </div>
  );
}
