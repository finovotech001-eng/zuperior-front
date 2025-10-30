export default function DepositCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-6xl">❌</div>
        <h1 className="text-2xl font-bold text-red-600">Payment Cancelled</h1>
        <p className="text-muted-foreground">
          Your deposit was cancelled. No funds were charged. If you need assistance, please contact our support team.
        </p>
      </div>
    </div>
  );
}

