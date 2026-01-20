"use client";
import React from "react";

type Tx = {
  id: number;
  reference?: string;
  amount: number;
  receivedAmount?: number;
  status: string;
  createdAt: string;
};

export default function RecentTransactions({ transactions }: { transactions: Tx[] }) {
  return (
    <section className="px-4 md:px-6 mt-6 mb-10">
      <div className="bg-[#1B263B] p-4 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-sm text-gray-400 mb-4">Recent Transactions</h3>
        <table className="min-w-full text-xs md:text-sm border-collapse border border-gray-700">
          <thead>
            <tr className="bg-[#0D1B2A] text-gray-300">
              <th className="border border-gray-700 px-3 md:px-4 py-2">Ref</th>
              <th className="border border-gray-700 px-3 md:px-4 py-2">Amount</th>
              <th className="border border-gray-700 px-3 md:px-4 py-2">Status</th>
              <th className="border border-gray-700 px-3 md:px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#0D1B2A] border border-gray-700">
                  <td className="px-3 md:px-4 py-2">{tx.reference}</td>
                  <td className="px-3 md:px-4 py-2">${((tx.receivedAmount ?? tx.amount) || 0).toFixed(2)}</td>
                  <td className={`px-3 md:px-4 py-2 ${tx.status === "confirmed" ? "text-green-400" : "text-yellow-400"}`}>
                    {tx.status}
                  </td>
                  <td className="px-3 md:px-4 py-2">{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-3 md:px-4 py-4 text-center text-gray-400">No transactions yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
