import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { perthDateString, startOfDate, endOfDate } from "@/lib/date";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams;
  const selectedDate = params.date || perthDateString();

  const orders = await prisma.mealOrder.findMany({
    where: { orderDate: { gte: startOfDate(selectedDate), lte: endOfDate(selectedDate) } },
    include: { miner: true },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-sm text-gray-600">← Back to admin</Link>
        <h1 className="mt-3 text-3xl font-bold">Orders</h1>
        <form className="mt-6 flex gap-3">
          <input type="date" name="date" defaultValue={selectedDate} className="rounded border p-3" />
          <button className="rounded-xl bg-black px-4 py-3 text-white">View</button>
        </form>

        <div className="mt-8 grid gap-4">
          {orders.length === 0 && <div className="rounded-2xl bg-white p-6 shadow">No orders found.</div>}
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl bg-white p-5 shadow">
              <p className="text-lg font-bold">{order.miner.name}</p>
              <p className="text-sm text-gray-500">Room {order.miner.roomNumber || "-"} · {order.miner.mobile}</p>
              <div className="mt-3 grid gap-1 text-sm">
                <p><strong>Breakfast:</strong> {order.breakfast}</p>
                <p><strong>Lunch:</strong> {order.lunchOption1}, {order.lunchOption2}</p>
                <p><strong>Fruit:</strong> {order.fruit}</p>
                <p><strong>Drink:</strong> {order.drink}</p>
                <p><strong>Sweet:</strong> {order.sweet}</p>
                {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
