export default function DepositSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-6xl">✅</div>
        <h1 className="text-2xl font-bold text-green-600">Payment Successful</h1>
        <p className="text-muted-foreground">
          Thank you for your deposit. Your transaction was successful and your funds will be credited to your account shortly.
        </p>
      </div>
    </div>
  );
}

