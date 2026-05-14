import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAfter8PMPerth, perthDateString, startOfDate } from "@/lib/date";

async function submitOrder(formData: FormData) {
  "use server";

  if (isAfter8PMPerth()) redirect("/order/closed");

  const mobile = String(formData.get("mobile") || "").trim();
  const miner = await prisma.miner.findUnique({ where: { mobile } });

  if (!miner || !miner.active) redirect("/order/not-found");

  const today = startOfDate(perthDateString());
  const existingOrder = await prisma.mealOrder.findUnique({
    where: { minerId_orderDate: { minerId: miner.id, orderDate: today } },
  });

  if (existingOrder) redirect("/order/already-submitted");

  await prisma.mealOrder.create({
    data: {
      minerId: miner.id,
      orderDate: today,
      breakfast: String(formData.get("breakfast") || ""),
      lunchOption1: String(formData.get("lunchOption1") || ""),
      lunchOption2: String(formData.get("lunchOption2") || ""),
      fruit: String(formData.get("fruit") || ""),
      drink: String(formData.get("drink") || ""),
      sweet: String(formData.get("sweet") || ""),
      notes: String(formData.get("notes") || "").trim() || null,
    },
  });

  redirect("/order/success");
}

function MealSelect({ label, name, items }: { label: string; name: string; items: { id: string; name: string; description: string | null }[] }) {
  return (
    <label className="grid gap-2">
      <span className="font-semibold">{label}</span>
      <select name={name} className="rounded border p-3" required>
        <option value="">Choose {label.toLowerCase()}</option>
        {items.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}{item.description ? ` - ${item.description}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

function MealCards({ title, items }: { title: string; items: { id: string; name: string; description: string | null }[] }) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border p-4">
      <h2 className="font-bold">{title}</h2>
      <div className="mt-3 grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl bg-gray-50 p-3">
            <p className="font-semibold">{item.name}</p>
            {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function TodayOrderPage() {
  if (isAfter8PMPerth()) redirect("/order/closed");

  const menuItems = await prisma.menuItem.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    select: { id: true, name: true, description: true, category: true },
  });

  const breakfast = menuItems.filter((item) => item.category === "Breakfast");
  const lunch = menuItems.filter((item) => item.category === "Lunch");
  const fruit = menuItems.filter((item) => item.category === "Fruit");
  const drink = menuItems.filter((item) => item.category === "Drink");
  const sweet = menuItems.filter((item) => item.category === "Sweet");

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Submit Meal Order</h1>
        <p className="mt-2 text-gray-600">Orders close at 8 PM. You can only submit one order per day.</p>

        <div className="mt-6 grid gap-4">
          <MealCards title="Breakfast Options" items={breakfast} />
          <MealCards title="Lunch Options" items={lunch} />
        </div>

        <form action={submitOrder} className="mt-8 grid gap-5">
          <input name="mobile" placeholder="Enter your mobile number" className="rounded border p-3" required />

          <MealSelect label="Breakfast" name="breakfast" items={breakfast} />
          <MealSelect label="Lunch Option 1" name="lunchOption1" items={lunch} />
          <MealSelect label="Lunch Option 2" name="lunchOption2" items={lunch} />
          <MealSelect label="Fruit" name="fruit" items={fruit} />
          <MealSelect label="Drink" name="drink" items={drink} />
          <MealSelect label="Sweet" name="sweet" items={sweet} />

          <textarea name="notes" placeholder="Any notes or allergies?" className="rounded border p-3" rows={3} />

          <button className="rounded-xl bg-black px-4 py-3 font-semibold text-white">Submit Order</button>
        </form>
      </div>
    </main>
  );
}
