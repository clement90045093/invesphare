"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp,
  Sparkles,
  Crown,
  Calculator,
} from "lucide-react";

type DepositStatus = "pending" | "approved" | "rejected" | null;

const PLANS = [
  {
    id: "starter",
    name: "Starter Plan",
    rate: 2,
    days: 5,
    minAmount: 100,
    maxAmount: 4999,
    range: "$100 - $4,999",
    icon: TrendingUp,
    features: ["Daily withdrawals", "24/7 Support", "Real-time tracking"],
  },
  {
    id: "pro",
    name: "Professional Plan",
    rate: 5,
    days: 5,
    minAmount: 5000,
    maxAmount: 9999,
    range: "$5,000 - $9,999",
    icon: Sparkles,
    features: ["Priority support", "Instant withdrawals", "Dedicated manager"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Plan",
    rate: 7,
    days: 5,
    minAmount: 10000,
    maxAmount: Infinity,
    range: "$10,000+",
    icon: Crown,
    features: ["VIP support", "Custom terms", "Exclusive benefits"],
  },
];

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
            ? "border-primary bg-primary text-primary-foreground"
            : isActive
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary text-muted-foreground"
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
          isActive ? "text-foreground" : "text-muted-foreground"
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

export default function InvestmentPage() {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState("USDT-TRC20");
  const [loading, setLoading] = useState(false);
  const [depositReference, setDepositReference] = useState<string | null>(null);
  const [depositStatus, setDepositStatus] = useState<DepositStatus>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const plan = PLANS.find((p) => p.id === selectedPlan) || PLANS[0];
  const dailyProfit = amount * (plan.rate / 100);
  const totalProfit = dailyProfit * plan.days;
  const totalReturn = amount + totalProfit;

  const currentStep = depositReference
    ? depositStatus === "approved"
      ? 4
      : isPolling
        ? 4
        : 3
    : showCalculator
      ? 2
      : 1;

  const walletAddress = "TXkVvbJUr8dG9RnLfnMz8aTpSzk9kXyR2P";

  const handlePlanSelect = (planId: string) => {
    const newPlan = PLANS.find((p) => p.id === planId);
    if (newPlan) {
      setSelectedPlan(planId);
      if (amount < newPlan.minAmount) {
        setAmount(newPlan.minAmount);
      } else if (amount > newPlan.maxAmount) {
        setAmount(newPlan.maxAmount);
      }
    }
  };
const confirmInvestment = async () => {
  setError(null);
  setLoading(true);
  try {
    const res = await fetch("/api/invest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, plan: selectedPlan }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Investment request failed");

    // Investment saved successfully → redirect to dashboard
    router.push("/dashboard");
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
          plan: selectedPlan,
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
      setTimeout(() => router.push("/dashboard"), 2000);
    } else if (data.status === "rejected") {
      setDepositStatus("rejected");
      setIsPolling(false);
    }
  };

  const confirmDeposit = () => {
    confirmInvestment();
  };

  return (
    <div className="min-h-screen bg-background">
      {isPolling && depositReference && (
        <PollingStatus
          reference={depositReference}
          intervalMs={4000}
          onUpdate={handleStatusUpdate}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Investment Plans
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Choose Your Investment Plan
          </h1>
          <p className="text-muted-foreground">
            Select a plan that fits your investment goals
          </p>
        </div>

        {/* Step Indicators */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center md:p-6">
          <StepIndicator step={1} currentStep={currentStep} label="Plan" />
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <StepIndicator step={2} currentStep={currentStep} label="Amount" />
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <StepIndicator step={3} currentStep={currentStep} label="Payment" />
          <div className="hidden h-px flex-1 bg-border sm:block" />
          <StepIndicator step={4} currentStep={currentStep} label="Confirm" />
        </div>

        {/* Step 1: Plan Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {PLANS.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPlan === p.id;

                return (
                  <Card
                    key={p.id}
                    className={`relative cursor-pointer transition-all duration-200 hover:border-primary/50 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card"
                    }`}
                    onClick={() => handlePlanSelect(p.id)}
                  >
                    {p.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                      <CardTitle className="mt-4 text-lg text-card-foreground">
                        {p.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-primary">
                            {p.rate}%
                          </span>
                          <span className="text-muted-foreground">daily</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          for {p.days} days
                        </p>
                      </div>

                      <div className="space-y-1 border-t border-border pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Investment
                          </span>
                          <span className="font-medium text-foreground">
                            {p.range}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total Return
                          </span>
                          <span className="font-medium text-primary">
                            {p.rate * p.days}%
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2 border-t border-border pt-4">
                        {p.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Selected: {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.rate}% daily for {plan.days} days ({plan.range})
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowCalculator(true)}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Amount Calculator */}
        {currentStep === 2 && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-card-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  2
                </span>
                Calculate Your Investment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Summary */}
              <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  {(() => {
                    const Icon = plan.icon;
                    return <Icon className="h-6 w-6" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.rate}% daily for {plan.days} days
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCalculator(false)}
                  className="bg-transparent"
                >
                  Change
                </Button>
              </div>

              {/* Amount Input */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label
                    htmlFor="amount"
                    className="mb-2 block text-foreground"
                  >
                    Investment Amount{" "}
                    <span className="text-xs text-muted-foreground">
                      (min ${plan.minAmount.toLocaleString()})
                    </span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="bg-input pl-8 text-foreground"
                      min={plan.minAmount}
                      max={plan.maxAmount === Infinity ? undefined : plan.maxAmount}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="currency"
                    className="mb-2 block text-foreground"
                  >
                    Payment Currency
                  </Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger
                      id="currency"
                      className="bg-input text-foreground"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDT-TRC20">USDT (TRC20)</SelectItem>
                      <SelectItem value="USDT-ERC20">USDT (ERC20)</SelectItem>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Profit Calculator */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">
                    Profit Calculator
                  </h4>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Investment
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      ${amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Daily Profit
                    </p>
                    <p className="mt-1 text-2xl font-bold text-primary">
                      ${dailyProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Total Profit
                    </p>
                    <p className="mt-1 text-2xl font-bold text-primary">
                      ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Total Return
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      ${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation Error */}
              {(amount < plan.minAmount ||
                (plan.maxAmount !== Infinity && amount > plan.maxAmount)) && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <p className="text-sm text-foreground">
                    Amount must be between ${plan.minAmount.toLocaleString()} and{" "}
                    {plan.maxAmount === Infinity
                      ? "unlimited"
                      : `$${plan.maxAmount.toLocaleString()}`}{" "}
                    for the {plan.name}.
                  </p>
                </div>
              )}

              {/* Security Note */}
              <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Your investment is protected by our secure platform. All
                  transactions are encrypted and monitored 24/7.
                </p>
              </div>

              <Button
                onClick={confirmInvestment}
                disabled={
                  loading ||
                  amount < plan.minAmount ||
                  (plan.maxAmount !== Infinity && amount > plan.maxAmount)
                }
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Invest
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && depositStatus === "pending" && !isPolling && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-card-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  3
                </span>
                Send Your Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="rounded-lg bg-secondary p-4">
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium text-foreground">
                      {plan.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Investment</span>
                    <span className="font-medium text-foreground">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Return</span>
                    <span className="font-medium text-primary">
                      {plan.rate}% (${dailyProfit.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Currency</span>
                    <span className="font-medium text-foreground">
                      {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-xs text-primary">
                      {depositReference}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Address */}
              <div>
                <Label className="mb-2 block text-sm text-muted-foreground">
                  Send exactly ${amount.toLocaleString()} to this wallet address
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg bg-secondary p-3">
                    <code className="break-all text-sm text-foreground">
                      {walletAddress}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="shrink-0 bg-transparent"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="mt-2 text-xs text-primary">
                    Address copied to clipboard!
                  </p>
                )}
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Important
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Only send {currency.split("-")[0]} on the{" "}
                    {currency.includes("-") ? currency.split("-")[1] : currency}{" "}
                    network. Sending other assets may result in permanent loss.
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <p className="text-sm text-foreground">{error}</p>
                </div>
              )}

              <Button
                onClick={notifyAdmin}
                disabled={loading}
                className="w-full"
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
            </CardContent>
          </Card>
        )}

        {/* Step 4: Awaiting Confirmation */}
        {isPolling && depositStatus === "pending" && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-card-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  4
                </span>
                Awaiting Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-10 w-10 animate-pulse text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Payment verification in progress
                </h3>
                <p className="max-w-sm text-muted-foreground">
                  We are verifying your payment. This usually takes a few
                  minutes. Please do not close this page.
                </p>
              </div>

              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono text-xs text-primary">
                    {depositReference}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium text-foreground">
                    {plan.name}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Investment</span>
                  <span className="font-medium text-foreground">
                    ${amount.toLocaleString()} {currency.split("-")[0]}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-1.5 font-medium text-amber-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Verifying
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {depositStatus === "approved" && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-card-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                Investment Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                  <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Investment successful!
                </h3>
                <p className="max-w-sm text-muted-foreground">
                  Your investment of ${amount.toLocaleString()} in the{" "}
                  {plan.name} has been confirmed. You will start earning{" "}
                  {plan.rate}% daily returns.
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-4">
                <div className="grid gap-4 sm:grid-cols-3 text-center">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Daily Profit
                    </p>
                    <p className="mt-1 text-xl font-bold text-primary">
                      ${dailyProfit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Total Profit
                    </p>
                    <p className="mt-1 text-xl font-bold text-primary">
                      ${totalProfit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Total Return
                    </p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      ${totalReturn.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Rejected State */}
        {depositStatus === "rejected" && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-card-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground">
                  <AlertCircle className="h-4 w-4" />
                </span>
                Payment Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Payment could not be verified
                </h3>
                <p className="max-w-sm text-muted-foreground">
                  We were unable to verify your payment. Please contact support
                  or try again.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/support")}
                  className="bg-transparent"
                >
                  Contact Support
                </Button>
                <Button
                  onClick={() => {
                    setDepositReference(null);
                    setDepositStatus(null);
                    setShowCalculator(false);
                    setIsPolling(false);
                  }}
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
