// app/payment/cancel/page.tsx
export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">❌ Payment Cancelled</h1>
      <p className="mt-4 dark:text-white/75">Your payment was cancelled or failed. Please try again.</p>
    </div>
  );
}
