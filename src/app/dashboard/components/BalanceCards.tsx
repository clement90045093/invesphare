"use client";

import { FiDollarSign, FiClock, FiTrendingUp } from "react-icons/fi";

interface BalanceCardsProps {
  summary: {
    deposited: number;
    pendingCount: number;
    profit?: number;
  } | null;
  loading: boolean;
}

export default function BalanceCards({ summary, loading }: BalanceCardsProps) {
  if (loading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-6 py-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#0D1B2A] border border-gray-800 rounded-xl p-5 animate-pulse"
          >
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-3" />
            <div className="h-8 bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </section>
    );
  }

  const cards = [
    {
      title: "Total Deposited",
      value: `$${(summary?.deposited || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <FiDollarSign className="text-emerald-400" />,
      color: "text-emerald-400",
    },
    {
      title: "Expected Profit",
      value: `$${(summary?.profit || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <FiTrendingUp className="text-blue-400" />,
      color: "text-blue-400",
    },
   {
  title: "Pending Investments",
  value: summary?.pendingCount || 0,
  icon: <FiClock className="text-yellow-400" />,
  color: "text-yellow-400",
  },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-6 py-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-[#0D1B2A] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            {card.icon}
            <span>{card.title}</span>
          </div>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </section>
  );
}
