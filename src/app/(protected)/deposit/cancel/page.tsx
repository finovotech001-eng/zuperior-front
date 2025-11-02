'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function DepositCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Optional: Log cancelled payment
    const cregisId = searchParams.get('cregis_id');
    const orderId = searchParams.get('order_id');
    
    if (cregisId || orderId) {
      console.log('⚠️ Deposit cancelled:', { cregisId, orderId });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">❌</div>
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Payment Cancelled</h1>
        <p className="text-muted-foreground">
          Your deposit was cancelled. No funds were charged. If you need assistance, please contact our support team.
        </p>
        
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            You can try again anytime. If you continue to experience issues, please contact support.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/deposit"
              className="px-6 py-2 bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white rounded-lg hover:opacity-90 transition"
            >
              Try Again
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


