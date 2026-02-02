'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface WithdrawalFormProps {
  onSuccess: (data: { amount: number; walletAddress: string; email: string }) => void;
}

const MIN_WITHDRAWAL = 10;
const MAX_WITHDRAWAL = 10000;

export default function WithdrawalForm({ onSuccess }: WithdrawalFormProps) {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

      setSuccess(true);
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
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Withdraw Funds</CardTitle>
        <CardDescription>
          Withdraw your funds to your cryptocurrency wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Field */}
          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
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
                className="pl-7"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Min: ${MIN_WITHDRAWAL} | Max: ${MAX_WITHDRAWAL}
            </p>
          </div>

          {/* Wallet Address Field */}
          <div className="space-y-2">
            <Label htmlFor="wallet">Crypto Wallet Address</Label>
            <Input
              id="wallet"
              type="text"
              placeholder="0x... or bc1..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Ethereum (0x) or Bitcoin (bc1) address
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Confirmation will be sent to this email
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success State */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Withdrawal request submitted successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || success}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Success
              </>
            ) : (
              'Withdraw Now'
            )}
          </Button>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center">
            By confirming, you agree to withdraw funds to the provided wallet address.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
