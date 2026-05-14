export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function getTodayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isAfter8PMPerth() {
  const hour = new Date().toLocaleString("en-US", {
    timeZone: "Australia/Perth",
    hour12: false,
    hour: "2-digit",
  });

  return Number(hour) >= 20;
}

async function submitOrder(formData: FormData) {
  "use server";

  if (isAfter8PMPerth()) {
    redirect("/order/closed");
  }

  const mobile = String(formData.get("mobile") || "").trim();

  const miner = await prisma.miner.findUnique({
    where: { mobile },
  });

  if (!miner || !miner.active) {
    redirect("/order/not-found");
  }

  const today = getTodayStart();

  const existingOrder = await prisma.mealOrder.findFirst({
    where: {
      minerId: miner.id,
      orderDate: today,
    },
  });

  if (existingOrder) {
    redirect("/order/already-submitted");
  }

  await prisma.mealOrder.create({
    data: {
      minerId: miner.id,
      orderDate: today,
      breakfast: String(formData.get("breakfast")),
      lunchOption1: String(formData.get("lunchOption1")),
      lunchOption2: String(formData.get("lunchOption2")),
      fruit: String(formData.get("fruit")),
      drink: String(formData.get("drink")),
      sweet: String(formData.get("sweet")),
      notes: String(formData.get("notes") || ""),
    },
  });

  redirect("/order/success");
}

export default async function TodayOrderPage() {
  if (isAfter8PMPerth()) {
    redirect("/order/closed");
  }

  const menuItems = await prisma.menuItem.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const breakfast = menuItems.filter((item) => item.category === "Breakfast");
  const lunch = menuItems.filter((item) => item.category === "Lunch");
  const fruit = menuItems.filter((item) => item.category === "Fruit");
  const drink = menuItems.filter((item) => item.category === "Drink");
  const sweet = menuItems.filter((item) => item.category === "Sweet");

  const renderOptions = (items: typeof menuItems) =>
    items.map((item) => (
      <option key={item.id} value={item.name}>
        {item.name}
      </option>
    ));

  const renderPreview = (title: string, items: typeof menuItems) => (
    <section className="rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>

      <div className="mt-4 grid gap-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No active items available.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">{item.name}</p>
              {item.description && (
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow md:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Submit Meal Order
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            Select your breakfast, two lunch options, fruit, drink and sweet.
            Orders close at 8 PM.
          </p>
        </div>

        <div className="mt-8 grid gap-5">
          {renderPreview("Breakfast Options", breakfast)}
          {renderPreview("Lunch Options", lunch)}
          {renderPreview("Fruit Options", fruit)}
          {renderPreview("Drink Options", drink)}
          {renderPreview("Sweet Options", sweet)}
        </div>

        <form action={submitOrder} className="mt-8 grid gap-5">
          <input
            name="mobile"
            placeholder="Enter your mobile number"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
            required
          />

          <label className="grid gap-2">
            <span className="font-semibold text-gray-900">Breakfast</span>
            <select
              name="breakfast"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            >
              <option value="">Choose breakfast</option>
              {renderOptions(breakfast)}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-semibold text-gray-900">Lunch Option 1</span>
            <select
              name="lunchOption1"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            >
              <option value="">Choose lunch option 1</option>
              {renderOptions(lunch)}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-semibold text-gray-900">Lunch Option 2</span>
            <select
              name="lunchOption2"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            >
              <option value="">Choose lunch option 2</option>
              {renderOptions(lunch)}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-semibold text-gray-900">Fruit</span>
            <select
              name="fruit"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            >
              <option value="">Choose fruit</option>
              {renderOptions(fruit)}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-semibold text-gray-900">Drink</span>
            <select
              name="drink"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            >
              <option value="">Choose drink</option>
              {renderOptions(drink)}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="font-semibold text-gray-900">Sweet</span>
            <select
              name="sweet"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              required
            >
              <option value="">Choose sweet</option>
              {renderOptions(sweet)}
            </select>
          </label>

          <textarea
            name="notes"
            placeholder="Any notes or allergies?"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
            rows={3}
          />

          <button className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white">
            Submit Order
          </button>
        </form>
      </div>
    </main>
  );
}