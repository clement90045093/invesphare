'use client';

import { useState } from 'react';
import WithdrawalForm from '@/components/WithdrawalForm';
import WithdrawalSuccess from '@/components/WithdrawalSuccess';

export default function Home() {
  const [withdrawalData, setWithdrawalData] = useState<{
    amount: number;
    walletAddress: string;
    email: string;
  } | null>(null);

  const handleWithdrawalSuccess = (data: { amount: number; walletAddress: string; email: string }) => {
    setWithdrawalData(data);
  };

  if (withdrawalData) {
    return <WithdrawalSuccess data={withdrawalData} onReset={() => setWithdrawalData(null)} />;
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <WithdrawalForm onSuccess={handleWithdrawalSuccess} />
      </div>
    </main>
  );
}
