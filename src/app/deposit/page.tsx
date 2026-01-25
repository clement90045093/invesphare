"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Circle,
  Loader2,
  Wallet,
  Copy,
  AlertCircle,
  ShieldCheck,
  Clock,
} from "lucide-react";

type DepositStatus = "pending" | "approved" | "rejected" | null;

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500];
const MIN_DEPOSIT = 100;

function StepIndicator({
  step,
  currentStep,
  label,
}: {
  step: number;
  currentStep: number;
  label: string;
}) {
  const isCompleted = currentStep > step;
  const isActive = currentStep === step;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          isCompleted
            ? "border-emerald-500 bg-emerald-500 text-white"
            : isActive
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
              : "border-gray-700 bg-[#1C2541] text-gray-500"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : isActive ? (
          <CircleDot className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </div>
      <span
        className={`text-sm font-medium transition-colors ${
          isActive ? "text-white" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function PollingStatus({
  reference,
  intervalMs = 5000,
  onUpdate,
}: {
  reference: string;
  intervalMs?: number;
  onUpdate?: (data: {
    status: string | null;
    txHash?: string | null;
    receivedAmount?: number | null;
  }) => void;
}) {
  const stopped = useRef(false);

  useEffect(() => {
    stopped.current = false;
    let timer: ReturnType<typeof setTimeout>;

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `/api/deposit/status?reference=${encodeURIComponent(reference)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        onUpdate?.(data);

        if (data.status === "approved" || data.status === "rejected") {
          stopped.current = true;
          return;
        }
      } catch {}

      if (!stopped.current) timer = setTimeout(fetchStatus, intervalMs);
    };

    fetchStatus();

    return () => {
      stopped.current = true;
      if (timer) clearTimeout(timer);
    };
  }, [reference, intervalMs, onUpdate]);

  return null;
}

export default function DepositPage() {
  const router = useRouter();

  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState("USDT-TRC20");
  const [loading, setLoading] = useState(false);
  const [depositReference, setDepositReference] = useState<string | null>(null);
  const [depositStatus, setDepositStatus] = useState<DepositStatus>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const currentStep = depositReference
    ? depositStatus === "approved"
      ? 3
      : isPolling
        ? 3
        : 2
    : 1;

  const walletAddress = "TXkVvbJUr8dG9RnLfnMz8aTpSzk9kXyR2P";

  const confirmDeposit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }),
      });
      if (!res.ok) throw new Error("Deposit request failed");
      const data = await res.json();
      setDepositReference(data.reference || `DEP-${Date.now()}`);
      setDepositStatus("pending");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const notifyAdmin = async () => {
    if (!depositReference) return;
    setLoading(true);
    try {
      const res = await fetch("/api/deposit/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "mockuser@example.com",
          reference: depositReference,
          amount,
          currency,
        }),
      });
      if (!res.ok) throw new Error("Failed to notify admin");
      setError(null);
      setIsPolling(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusUpdate = (data: { status: string | null }) => {
    if (data.status === "approved") {
      setDepositStatus("approved");
      setTimeout(() => router.push("/investment"), 2000);
    } else if (data.status === "rejected") {
      setDepositStatus("rejected");
      setIsPolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B]">
      {isPolling && depositReference && (
        <PollingStatus
          reference={depositReference}
          intervalMs={4000}
          onUpdate={handleStatusUpdate}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">
            <Wallet className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">
              Secure Deposit
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Deposit Funds
          </h1>
          <p className="text-gray-400">
            Add funds to your investment account securely
          </p>
        </div>

        {/* Step Indicators */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-800 bg-[#0D1B2A] p-4 sm:flex-row sm:items-center md:p-6">
          <StepIndicator step={1} currentStep={currentStep} label="Amount" />
          <div className="hidden h-px flex-1 bg-gray-800 sm:block" />
          <StepIndicator step={2} currentStep={currentStep} label="Payment" />
          <div className="hidden h-px flex-1 bg-gray-800 sm:block" />
          <StepIndicator
            step={3}
            currentStep={currentStep}
            label="Confirmation"
          />
        </div>

        {/* Main Content */}
        <div className="rounded-xl border border-gray-800 bg-[#0D1B2A]">
          {/* Step 1: Amount Selection */}
          {currentStep === 1 && (
            <>
              <div className="border-b border-gray-800 p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-500">
                    1
                  </span>
                  Select amount & currency
                </h2>
              </div>
              <div className="space-y-6 p-6">
                {/* Quick Amount Buttons */}
                <div>
                  <Label className="mb-3 block text-sm text-gray-400">
                    Quick select
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        variant={amount === quickAmount ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAmount(quickAmount)}
                        className={`min-w-[80px] ${
                          amount === quickAmount
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                            : "bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        ${quickAmount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="amount" className="mb-2 block text-white">
                      Amount (USD){" "}
                      <span className="text-xs text-gray-500">
                        (min ${MIN_DEPOSIT})
                      </span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="bg-[#1C2541] border-gray-700 pl-8 text-white focus:border-emerald-500 focus:ring-emerald-500"
                        min={MIN_DEPOSIT}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="currency" className="mb-2 block text-white">
                      Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency" className="bg-[#1C2541] border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C2541] border-gray-700">
                        <SelectItem value="USDT-TRC20" className="text-white hover:bg-gray-800">USDT (TRC20)</SelectItem>
                        <SelectItem value="USDT-ERC20" className="text-white hover:bg-gray-800">USDT (ERC20)</SelectItem>
                        <SelectItem value="BTC" className="text-white hover:bg-gray-800">Bitcoin (BTC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-[#1C2541] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">You deposit</span>
                    <span className="text-lg font-semibold text-white">
                      ${amount.toLocaleString()} {currency.split("-")[0]}
                    </span>
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm text-gray-400">
                    Your deposit is protected by our secure payment system. All
                    transactions are encrypted and monitored 24/7.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button
                  onClick={confirmDeposit}
                  disabled={loading || amount < MIN_DEPOSIT}
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
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && depositStatus === "pending" && !isPolling && (
            <>
              <div className="border-b border-gray-800 p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-500">
                    2
                  </span>
                  Send your payment
                </h2>
              </div>
              <div className="space-y-6 p-6">
                {/* Order Summary */}
                <div className="rounded-lg bg-[#1C2541] p-4">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Amount</span>
                      <span className="font-medium text-white">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Currency</span>
                      <span className="font-medium text-white">{currency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Reference</span>
                      <span className="font-mono text-xs text-emerald-500">
                        {depositReference}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wallet Address */}
                <div>
                  <Label className="mb-2 block text-sm text-gray-400">
                    Send exactly ${amount} to this wallet address
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg bg-[#1C2541] p-3">
                      <code className="break-all text-sm text-white">
                        {walletAddress}
                      </code>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="shrink-0 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {copied && (
                    <p className="mt-2 text-xs text-emerald-500">
                      Address copied to clipboard!
                    </p>
                  )}
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Important
                    </p>
                    <p className="text-sm text-gray-400">
                      Only send {currency.split("-")[0]} on the{" "}
                      {currency.includes("-") ? currency.split("-")[1] : currency}{" "}
                      network. Sending other assets may result in permanent loss.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <Button
                  onClick={notifyAdmin}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Notifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      I have sent the payment
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Awaiting Confirmation */}
          {isPolling && depositStatus === "pending" && (
            <>
              <div className="border-b border-gray-800 p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-500">
                    3
                  </span>
                  Awaiting confirmation
                </h2>
              </div>
              <div className="space-y-6 p-6">
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                    <Clock className="h-10 w-10 animate-pulse text-emerald-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Payment verification in progress
                  </h3>
                  <p className="max-w-sm text-gray-400">
                    We are verifying your payment. This usually takes a few
                    minutes. Please do not close this page.
                  </p>
                </div>

                <div className="rounded-lg bg-[#1C2541] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Reference</span>
                    <span className="font-mono text-xs text-emerald-500">
                      {depositReference}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-400">Amount</span>
                    <span className="font-medium text-white">
                      ${amount.toLocaleString()} {currency.split("-")[0]}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className="flex items-center gap-1.5 font-medium text-amber-500">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Verifying
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Success State */}
          {depositStatus === "approved" && (
            <>
              <div className="border-b border-gray-800 p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  Deposit confirmed
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Payment successful!
                  </h3>
                  <p className="max-w-sm text-gray-400">
                    Your deposit of ${amount.toLocaleString()} has been confirmed.
                    Redirecting you to investments...
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Rejected State */}
          {depositStatus === "rejected" && (
            <>
              <div className="border-b border-gray-800 p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                    <AlertCircle className="h-4 w-4" />
                  </span>
                  Deposit rejected
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Payment could not be verified
                  </h3>
                  <p className="max-w-sm text-gray-400">
                    Please contact support if you believe this is an error.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setDepositReference(null);
                    setDepositStatus(null);
                    setIsPolling(false);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="lg"
                >
                  Try again
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Need help? Contact our{" "}
          <a href="/support" className="text-emerald-500 hover:underline">
            support team
          </a>
        </p>
      </div>
    </div>
  );
}
