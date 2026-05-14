import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Miner Meal System</h1>
        <p className="mt-3 text-gray-600">
          Digital breakfast and lunch ordering system for miners.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link className="rounded-xl bg-black p-4 font-semibold text-white" href="/admin">
            Admin Dashboard
          </Link>
          <Link className="rounded-xl border p-4 font-semibold" href="/order/today">
            Miner Order Page
          </Link>
        </div>
      </div>
    </main>
  );
}
