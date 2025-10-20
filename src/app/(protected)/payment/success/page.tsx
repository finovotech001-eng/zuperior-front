// app/payment/success/page.tsx
export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-green-600">✅ Payment Successful</h1>
      <p className="mt-4 dark:text-white/75">Thank you for your payment. Your transaction was successful.</p>
    </div>
  );
}
  