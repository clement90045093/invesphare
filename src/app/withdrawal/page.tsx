"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WithdrawalForm from "./components/WithdrawalForm";
import RecentTransactions from "../dashboard/components/RecentTransactions";

export default function WithdrawalPage() {
	const router = useRouter();
	const [summary, setSummary] = useState<any>(null);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch("/api/dashboard");
				if (!res.ok) throw new Error("Failed to fetch dashboard");
				const json = await res.json();
				if (!mounted) return;
				setSummary({ deposited: json.deposited, pendingCount: json.pendingCount });
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
				<button
					onClick={() => router.back()}
					className="text-sm text-gray-300 mb-3 underline"
				>
					Go Back
				</button>
				<h1 className="text-xl font-semibold mb-4">Withdrawals</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<div className="mb-4 text-sm text-gray-400">Available Balance</div>
						<div className="bg-[#1B263B] p-4 rounded-lg mb-6">
							<div className="text-2xl font-semibold">
								{loading ? "..." : `$${(summary?.deposited ?? 0).toFixed(2)}`}
							</div>
							<div className="text-xs text-gray-400">Currency: USDT-TRC20</div>
						</div>

						<WithdrawalForm />
					</div>

					<div>
						<RecentTransactions transactions={transactions} />
					</div>
				</div>
			</div>
		</div>
	);
}

