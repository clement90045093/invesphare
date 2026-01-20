"use client";

import React, { useState } from "react";
import PollingStatus from "./PollingStatus";

export default function DepositPage() {
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [amount, setAmount] = useState<number>(100);
  const [currency, setCurrency] = useState("USDT-TRC20");
  const [loading, setLoading] = useState(false);
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [depositReference, setDepositReference] = useState<string | null>(null);
  const [depositExpiresAt, setDepositExpiresAt] = useState<string | null>(null);
  const [depositStatus, setDepositStatus] = useState<string | null>(null);
  const [depositTxHash, setDepositTxHash] = useState<string | null>(null);
  const [depositReceivedAmount, setDepositReceivedAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Plan data
  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      rate: 2,
      range: "$100.00 - $4,999.00",
      condition: (amt: number) => amt >= 100 && amt < 5000,
    },
    {
      id: "pro",
      name: "Professional Plan",
      rate: 5,
      range: "$5,000.00 - $9,999.00",
      condition: (amt: number) => amt >= 5000 && amt < 10000,
    },
    {
      id: "premium",
      name: "Premium Plan",
      rate: 7,
      range: "$10,000.00 and more",
      condition: (amt: number) => amt >= 10000,
    },
  ];

  // Minimum amounts for each plan
  const getMinAmount = (id: string) => {
    switch (id) {
      case "starter":
        return 100;
      case "pro":
        return 5000;
      case "premium":
        return 10000;
      default:
        return 0;
    }
  };

  const selected = plans.find((p) => p.id === selectedPlan);
  const dailyProfit = amount * ((selected?.rate || 0) / 100);
  const totalProfit = dailyProfit * 5;

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6">Make a Deposit:</h2>

      <p className="text-sm text-gray-400 mb-3">Select a plan:</p>

      {/* Plan Options */}
      <div className="space-y-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border border-gray-700 rounded-md p-4 bg-[#1e293b] ${
              selectedPlan === plan.id ? "border-blue-500" : ""
            }`}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="plan"
                checked={selectedPlan === plan.id}
                onChange={() => {
                  const min = getMinAmount(plan.id);
                  // If current amount is below plan minimum, auto-set it to the minimum
                  if (amount < min) {
                    setAmount(min);
                  }
                  setError(null);
                  setSelectedPlan(plan.id);
                }}
                className="text-blue-500 accent-blue-500"
              />
              <span className="font-semibold text-sm">
                {plan.rate}% DAILY FOR 5 DAYS
              </span>
            </label>

            <div className="mt-3 border-t border-gray-700 pt-3 text-sm">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Plan</span>
                <span>{plan.name}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Spent Amount ($)</span>
                <span>{plan.range}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Daily Profit (%)</span>
                <span>{plan.rate.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="text-blue-400 text-xs mt-2 hover:underline"
              >
                Calculate your profit &gt;&gt;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Balance Section */}
      <div className="mt-10 border border-gray-700 rounded-md overflow-hidden">
        <div className="grid grid-cols-2 border-b border-gray-700">
          <div className="p-3">
            <p className="text-sm text-gray-400">Your account balance ($):</p>
            <p className="text-white font-medium">$0</p>
          </div>
          <div className="p-3 border-l border-gray-700">
            <p className="text-sm text-gray-400">Amount to Spend ($):</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAmount(val);
                // Clear error if the new amount satisfies the selected plan
                const min = getMinAmount(selectedPlan);
                if (val >= min) setError(null);
              }}
              className="w-full bg-[#0f172a] border border-gray-600 rounded-md p-2 text-white mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-700">
          {[
            // Only show USDT-TRC20 as selectable currency for deposits
            "USDT-TRC20",
          ].map((coin) => (
            <label
              key={coin}
              className={`flex items-center gap-2 px-4 py-3 cursor-pointer ${
                currency === coin ? "bg-blue-600" : "bg-[#1e293b]"
              } hover:bg-blue-700 transition`}
            >
              <input
                type="radio"
                name="currency"
                checked={currency === coin}
                onChange={() => setCurrency(coin)}
              />
              <span>{coin}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Calculation Section */}
      <div className="mt-10 p-6 bg-[#1e293b] border border-gray-700 rounded-md">
        <h3 className="text-lg font-semibold mb-3">Profit Calculator</h3>
        <p className="text-sm mb-2">
          <span className="font-medium text-blue-400">{selected?.name}</span> —
          {` ${selected?.rate}% daily for 5 days`}
        </p>

        <p className="text-sm">
          Investment:{" "}
          <span className="font-semibold text-green-400">${amount}</span>
        </p>
        <p className="text-sm mt-1">
          Daily Profit:{" "}
          <span className="font-semibold text-green-400">
            ${dailyProfit.toFixed(2)}
          </span>
        </p>
        <p className="text-sm mt-1">
          Total Profit (5 days):{" "}
          <span className="font-semibold text-yellow-400">
            ${totalProfit.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Submit Button */}
      <div className="mt-8 text-center">
        <button
          onClick={async () => {
            setError(null);
            setDepositAddress(null);

            // validate against selected plan minimum before calling API
            const min = getMinAmount(selectedPlan);
            if (amount < min) {
              setError(
                `Put the correct amount according to the selected plan (minimum $${min})`
              );
              return;
            }

            setLoading(true);
            try {
              const res = await fetch("/api/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, currency }),
              });
              if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message || "Deposit request failed");
              }
              const data = await res.json();
              setDepositAddress(data.address || null);
              setDepositReference(data.reference || null);
              setDepositExpiresAt(data.expiresAt || null);
              setDepositStatus(data.status || "pending");
            } catch (e: any) {
              setError(e?.message || "Unknown error");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Confirm Deposit"}
        </button>

        {depositAddress && (
          <div className="mt-4 p-3 bg-[#0b1220] border border-gray-700 rounded-md text-sm">
            <p className="font-medium mb-1">Send USDT (TRC20) to this wallet:</p>
            <p className="break-all text-green-300">{depositAddress}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(depositAddress || "");
                  } catch {}
                }}
                className="text-xs text-blue-300 hover:underline"
              >
                Copy address
              </button>
              {depositReference && (
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(depositReference || "");
                    } catch {}
                  }}
                  className="text-xs text-blue-300 hover:underline"
                >
                  Copy reference
                </button>
              )}
            </div>
            {depositReference && (
              <p className="text-sm text-gray-300 mt-2">Reference: <span className="font-medium text-yellow-300">{depositReference}</span></p>
            )}
            {depositExpiresAt && (
              <p className="text-sm text-gray-400 mt-1">Expires: <span className="font-medium">{new Date(depositExpiresAt).toLocaleString()}</span></p>
            )}
            <p className="text-gray-400 mt-2">Send the exact amount shown and wait for confirmation.</p>
            {depositStatus === "confirmed" && (
              <p className="text-green-400 mt-2 font-medium">Deposit confirmed{depositTxHash ? ` (tx: ${depositTxHash})` : ""}</p>
            )}
            {depositStatus === "failed" && (
              <p className="text-red-400 mt-2 font-medium">Deposit failed or expired</p>
            )}
          </div>
        )}

        {/* Polling for status */}
        {depositReference && (
          <PollingStatus reference={depositReference} onUpdate={(s: any) => {
            setDepositStatus(s.status);
            setDepositTxHash(s.txHash || null);
            setDepositReceivedAmount(s.receivedAmount || null);
          }} />
        )}

        {error && (
          <p className="text-red-400 mt-3 text-sm">Error: {error}</p>
        )}
      </div>



      {depositStatus === "pending" && depositReference && (
  <button
    onClick={async () => {
      try {
        const res = await fetch("/api/deposit/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "user@example.com", // replace with logged-in user's email
            reference: depositReference,
            amount,
            currency,
          }),
        });
        if (!res.ok) throw new Error("Failed to notify admin");
        alert("Admin notified via Telegram");
      } catch (e: any) {
        alert(e?.message || "Unknown error");
      }
    }}
    className="mt-3 bg-green-600 px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition"
  >
    I have paid
  </button>
)}

    </div>
  );
}
