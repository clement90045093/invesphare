"use client";

import { FiTrendingUp, FiClock, FiDollarSign, FiCalendar } from "react-icons/fi";

interface Investment {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  createdAt: string;
  dailyRate: number;
  duration: number;
  expectedProfit: number;
  totalReturn: number;
  address: string;
}

interface ActiveInvestmentsProps {
  investments: Investment[];
  loading?: boolean;
}

function getProgressPercentage(createdAt: string, duration: number): number {
  const start = new Date(createdAt).getTime();
  const now = Date.now();
  const end = start + duration * 24 * 60 * 60 * 1000;
  const elapsed = now - start;
  const total = end - start;
  const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
  return Math.round(progress);
}

function getDaysRemaining(createdAt: string, duration: number): number {
  const start = new Date(createdAt).getTime();
  const now = Date.now();
  const end = start + duration * 24 * 60 * 60 * 1000;
  const remaining = Math.max(0, Math.ceil((end - now) / (24 * 60 * 60 * 1000)));
  return remaining;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getEndDate(createdAt: string, duration: number): string {
  const start = new Date(createdAt);
  const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
  return formatDate(end.toISOString());
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "completed":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "cancelled":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

export default function ActiveInvestments({ investments, loading }: ActiveInvestmentsProps) {
  if (loading) {
    return (
      <section className="px-4 md:px-6 py-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Investments</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#0D1B2A] border border-gray-800 rounded-xl p-5 animate-pulse"
            >
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!investments || investments.length === 0) {
    return (
      <section className="px-4 md:px-6 py-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Investments</h3>
        <div className="bg-[#0D1B2A] border border-gray-800 rounded-xl p-8 text-center">
          <FiTrendingUp className="mx-auto text-4xl text-gray-600 mb-3" />
          <p className="text-gray-400">No investments yet</p>
          <p className="text-gray-500 text-sm mt-1">Start investing to see your portfolio here</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Your Investments</h3>
        <span className="text-sm text-gray-400">{investments.length} total</span>
      </div>
      
      <div className="space-y-4">
        {investments.map((investment) => {
          const progress = getProgressPercentage(investment.createdAt, investment.duration);
          const daysRemaining = getDaysRemaining(investment.createdAt, investment.duration);
          const isCompleted = progress >= 100;

          return (
            <div
              key={investment.id}
              className="bg-[#0D1B2A] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-white text-lg">{investment.plan}</h4>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(investment.status)}`}
                    >
                      {investment.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Ref: {investment.reference}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-semibold text-lg">
                    +${investment.expectedProfit.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xs">Expected Profit</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <div className="bg-[#0B132B] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <FiDollarSign className="text-emerald-400" />
                    <span>Invested</span>
                  </div>
                  <p className="text-white font-medium">
                    ${investment.amount.toFixed(2)} {investment.currency}
                  </p>
                </div>
                <div className="bg-[#0B132B] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <FiTrendingUp className="text-blue-400" />
                    <span>Daily Rate</span>
                  </div>
                  <p className="text-white font-medium">{investment.dailyRate}%</p>
                </div>
                <div className="bg-[#0B132B] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <FiClock className="text-yellow-400" />
                    <span>Duration</span>
                  </div>
                  <p className="text-white font-medium">{investment.duration} days</p>
                </div>
                <div className="bg-[#0B132B] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <FiDollarSign className="text-emerald-400" />
                    <span>Total Return</span>
                  </div>
                  <p className="text-white font-medium">${investment.totalReturn.toFixed(2)}</p>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Investment Progress</span>
                  <span className="text-white font-medium">
                    {isCompleted ? "Completed" : `${daysRemaining} days remaining`}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-2 bg-[#0B132B] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  {/* Progress Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0D1B2A] shadow-lg transition-all duration-500"
                    style={{ left: `calc(${Math.min(progress, 97)}% - 8px)` }}
                  />
                </div>

                {/* Timeline Labels */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <FiCalendar className="text-emerald-400" />
                    <span>Start: {formatDate(investment.createdAt)}</span>
                  </div>
                  <div className="text-emerald-400 font-medium">{progress}%</div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span>End: {getEndDate(investment.createdAt, investment.duration)}</span>
                    <FiCalendar className="text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
