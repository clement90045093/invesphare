"use client";
import { useState } from "react";

export default function WithdrawalForm() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDT-TRC20");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const amt = Number(amount);
    if (!amt || isNaN(amt) || amt <= 0) {
      setMessage("Enter a valid amount");
      return;
    }
    if (!address) {
      setMessage("Enter destination address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, currency, address }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Request failed");
      setMessage("Withdrawal request submitted");
      setAmount("");
      setAddress("");
    } catch (err: any) {
      setMessage(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1B263B] p-4 rounded-lg shadow-md">
      <h3 className="text-sm text-gray-400 mb-3">Withdraw Funds</h3>

      <label className="block text-xs text-gray-300 mb-1">Amount</label>
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-3 bg-[#0D1B2A] border border-gray-700 rounded text-white"
        placeholder="0.00"
      />

      <label className="block text-xs text-gray-300 mb-1">Currency</label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full p-2 mb-3 bg-[#0D1B2A] border border-gray-700 rounded text-white"
      >
        <option>USDT-TRC20</option>
      </select>

      <label className="block text-xs text-gray-300 mb-1">Destination Address</label>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 mb-3 bg-[#0D1B2A] border border-gray-700 rounded text-white"
        placeholder="Destination address"
      />

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 px-4 py-2 rounded text-black font-semibold disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Request Withdrawal"}
        </button>
        {message && <p className="text-sm text-gray-300">{message}</p>}
      </div>
    </form>
  );
}
