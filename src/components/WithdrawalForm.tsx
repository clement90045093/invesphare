'use client';

import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Wallet,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface WithdrawalFormProps {
  onSuccess: (data: { amount: number; walletAddress: string; email: string }) => void;
}

const MIN_WITHDRAWAL = 10;
const MAX_WITHDRAWAL = 10000;
const QUICK_AMOUNTS = [50, 100, 250, 500, 1000];

export default function WithdrawalForm({ onSuccess }: WithdrawalFormProps) {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    setError('');

    if (!amount || !walletAddress || !email) {
      setError('All fields are required');
      return false;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount)) {
      setError('Please enter a valid amount');
      return false;
    }

    if (withdrawAmount < MIN_WITHDRAWAL) {
      setError(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
      return false;
    }

    if (withdrawAmount > MAX_WITHDRAWAL) {
      setError(`Maximum withdrawal amount is $${MAX_WITHDRAWAL}`);
      return false;
    }

    
  const isEthereum = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
  const isBitcoin = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(walletAddress);
  const isTron = /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(walletAddress);

  if (!isEthereum && !isBitcoin && !isTron) {
  setError("Please enter a valid crypto wallet address");
  return false;
  }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          walletAddress,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Withdrawal failed. Please try again.');
        setLoading(false);
        return;
      }

      setTimeout(() => {
        onSuccess({
          amount: parseFloat(amount),
          walletAddress,
          email,
        });
      }, 500);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B]">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">
            <Wallet className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">
              Secure Withdrawal
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Withdraw Funds
          </h1>
          <p className="text-gray-400">
            Withdraw your funds to your cryptocurrency wallet
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-xl border border-gray-800 bg-[#0D1B2A]">
          <div className="border-b border-gray-800 p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-500">
                1
              </span>
              Enter withdrawal details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Quick Amount Buttons */}
            <div>
              <Label className="mb-3 block text-sm text-gray-400">
                Quick select
              </Label>
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount.toString())}
                    variant={amount === quickAmount.toString() ? 'default' : 'outline'}
                    size="sm"
                    className={`min-w-[80px] ${
                      amount === quickAmount.toString()
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                        : 'bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Amount Field */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="amount" className="mb-2 block text-white">
                  Withdrawal Amount (USD)
                  <span className="text-xs text-gray-500">
                    {' '}
                    (min ${MIN_WITHDRAWAL} - max ${MAX_WITHDRAWAL})
                  </span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min={MIN_WITHDRAWAL}
                    max={MAX_WITHDRAWAL}
                    className="bg-[#1C2541] border-gray-700 pl-8 text-white focus:border-emerald-500 focus:ring-emerald-500"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="mb-2 block text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1C2541] border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Wallet Address Field */}
            <div>
              <Label htmlFor="wallet" className="mb-2 block text-white">
                Crypto Wallet Address
              </Label>
              <Input
                id="wallet"
                type="text"
                placeholder="0x... or bc1..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-[#1C2541] border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Ethereum (0x) or Bitcoin (bc1) address
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-[#1C2541] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">You withdraw</span>
                <span className="text-lg font-semibold text-white">
                  {amount ? `$${parseFloat(amount).toLocaleString()}` : '$0.00'}
                </span>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <p className="text-sm text-gray-400">
                Your withdrawal request will be reviewed by our team. You'll receive
                notifications via Telegram and email once approved.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !amount || !walletAddress || !email}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Withdraw Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center">
              By confirming, you agree to withdraw funds to the provided wallet address.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
