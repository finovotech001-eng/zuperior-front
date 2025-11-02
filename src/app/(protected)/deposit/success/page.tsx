'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function DepositSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Optional: Log successful payment
    const cregisId = searchParams.get('cregis_id');
    const orderId = searchParams.get('order_id');
    const amount = searchParams.get('tranmt');
    const currency = searchParams.get('currency');
    
    if (cregisId || orderId) {
      console.log('✅ Deposit success:', { cregisId, orderId, amount, currency });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl animate-bounce">✅</div>
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Thank you for your deposit. Your transaction was successful and your funds will be credited to your account shortly.
        </p>
        
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly. If you have any questions, please contact our support team.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/transactions"
              className="px-6 py-2 bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white rounded-lg hover:opacity-90 transition"
            >
              View Transactions
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 border border-[#362e36] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


