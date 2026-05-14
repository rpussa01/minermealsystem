export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <h1 className="text-3xl font-bold text-green-600">Order Submitted</h1>
        <p className="mt-3 text-gray-600">Your breakfast and lunch order has been submitted successfully.</p>
      </div>
    </main>
  );
}
