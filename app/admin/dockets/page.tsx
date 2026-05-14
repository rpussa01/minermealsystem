import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { endOfDate, perthDateString, startOfDate } from "@/lib/date";
import PrintButton from "./PrintButton";

function countItems(items: string[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    if (!item) return acc;
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function SummaryBox({ title, counts }: { title: string; counts: Record<string, number> }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <section className="rounded-2xl bg-white p-5 shadow print:shadow-none">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-3 grid gap-2">
        {entries.length === 0 && <p className="text-gray-500">No items</p>}
        {entries.map(([name, qty]) => (
          <div key={name} className="flex justify-between border-b py-1">
            <span>{name}</span>
            <strong>x {qty}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function DocketsPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams;
  const selectedDate = params.date || perthDateString();

  const orders = await prisma.mealOrder.findMany({
    where: { orderDate: { gte: startOfDate(selectedDate), lte: endOfDate(selectedDate) } },
    include: { miner: true },
    orderBy: { submittedAt: "asc" },
  });

  const breakfastCounts = countItems(orders.map((o) => o.breakfast));
  const lunchCounts = countItems([...orders.map((o) => o.lunchOption1), ...orders.map((o) => o.lunchOption2)]);
  const fruitCounts = countItems(orders.map((o) => o.fruit));
  const drinkCounts = countItems(orders.map((o) => o.drink));
  const sweetCounts = countItems(orders.map((o) => o.sweet));

  return (
    <main className="min-h-screen bg-gray-100 p-6 print:bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="print-hidden">
          <Link href="/admin" className="text-sm text-gray-600">← Back to admin</Link>
          <h1 className="mt-3 text-3xl font-bold">Daily Kitchen Docket</h1>

          <form className="mt-6 flex flex-wrap gap-3">
            <input type="date" name="date" defaultValue={selectedDate} className="rounded border p-3" />
            <button className="rounded-xl bg-black px-4 py-3 text-white">Generate</button>
            <PrintButton />
          </form>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow print:shadow-none">
          <h1 className="text-center text-3xl font-bold">MINER MEAL ORDERS</h1>
          <p className="mt-2 text-center text-gray-600">Date: {selectedDate}</p>
          <p className="mt-1 text-center text-gray-600">Total Orders: {orders.length}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <SummaryBox title="Breakfast Summary" counts={breakfastCounts} />
          <SummaryBox title="Lunch Summary" counts={lunchCounts} />
          <SummaryBox title="Fruit Summary" counts={fruitCounts} />
          <SummaryBox title="Drink Summary" counts={drinkCounts} />
          <SummaryBox title="Sweet Summary" counts={sweetCounts} />
        </div>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow print:shadow-none">
          <h2 className="text-xl font-bold">Individual Orders</h2>
          <div className="mt-4 grid gap-4">
            {orders.length === 0 && <p className="text-gray-500">No orders for this day.</p>}
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border p-4">
                <p className="font-bold">{order.miner.name}</p>
                <p className="text-sm text-gray-500">Room {order.miner.roomNumber || "-"} · {order.miner.mobile}</p>
                <div className="mt-3 text-sm">
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
        </section>
      </div>
    </main>
  );
}
