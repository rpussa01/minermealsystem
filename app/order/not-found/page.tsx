export default function NotFoundOrderPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <h1 className="text-3xl font-bold text-red-600">Miner Not Found</h1>
        <p className="mt-3 text-gray-600">Your mobile number was not found or your profile is inactive. Please contact admin.</p>
      </div>
    </main>
  );
}
