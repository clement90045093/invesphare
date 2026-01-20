"use client";
import { useEffect, useState } from "react";
import RecentTransactions from "../dashboard/components/RecentTransactions";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/dashboard`);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const json = await res.json();
        if (!mounted) return;
        setTransactions(json.recentTransactions || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#0B132B] text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">Transactions</h1>
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}
