"use client";

import React, { useEffect, useState } from "react";

type Summary = {
  deposited?: number;
  profit?: number;
  pendingCount?: number;
};

const cards = [
  { label: "Deposited", key: "deposited", icon: "💰" },
  { label: "Profit", key: "profit", icon: "💹" },
  { label: "Pending", key: "pending", icon: "🔁" },
];

export default function BalanceCards() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch("/api/dashboard/summary");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 md:p-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[#1B263B] p-3 md:p-4 rounded-lg shadow-md flex items-center gap-3"
        >
          <span className="text-2xl md:text-3xl">{card.icon}</span>
          <div>
            <h3 className="text-gray-400 text-xs md:text-sm">{card.label}</h3>
            <p className="text-base md:text-lg font-semibold">
              {loading
                ? "..."
                : card.key === "deposited"
                ? `$${(summary?.deposited ?? 0).toFixed(2)}`
                : card.key === "profit"
                ? `$${(summary?.profit ?? 0).toFixed(2)}`
                : card.key === "pending"
                ? `${summary?.pendingCount ?? 0}`
                : "$0.00"}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
