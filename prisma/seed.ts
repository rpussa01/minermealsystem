import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const meals = [
  { name: "Bacon & Egg Roll", description: "Crispy bacon, fried egg, BBQ sauce and cheese served in a toasted milk bun.", category: "Breakfast" },
  { name: "Big Breakfast", description: "Eggs of your choice, tomato, mushroom, spinach, hash brown, bacon and sourdough bread.", category: "Breakfast" },
  { name: "Granola Bowl", description: "House granola served with Greek yoghurt, seasonal berries, banana and honey.", category: "Breakfast" },
  { name: "Chicken Parmi", description: "Crumbed chicken breast topped with Napoli sauce, ham and mozzarella served with chips.", category: "Lunch" },
  { name: "Beef Curry", description: "Slow cooked beef curry served with steamed jasmine rice and naan bread.", category: "Lunch" },
  { name: "Chicken Caesar Wrap", description: "Grilled chicken, cos lettuce, bacon, parmesan and Caesar dressing in a toasted wrap.", category: "Lunch" },
  { name: "Steak Sandwich", description: "Grilled steak, caramelised onion, lettuce, tomato and BBQ aioli on Turkish bread.", category: "Lunch" },
  { name: "Fish & Chips", description: "Beer battered fish fillet served with chips, lemon and tartare sauce.", category: "Lunch" },
  { name: "Banana", description: "Fresh whole banana.", category: "Fruit" },
  { name: "Apple", description: "Fresh seasonal apple.", category: "Fruit" },
  { name: "Orange", description: "Fresh whole orange.", category: "Fruit" },
  { name: "Water", description: "600ml bottled spring water.", category: "Drink" },
  { name: "Coke", description: "375ml Coca-Cola can.", category: "Drink" },
  { name: "Powerade", description: "600ml mixed berry Powerade.", category: "Drink" },
  { name: "Muffin", description: "Fresh baked blueberry muffin.", category: "Sweet" },
  { name: "Brownie", description: "Rich chocolate brownie slice.", category: "Sweet" },
  { name: "Cookie", description: "House baked chocolate chip cookie.", category: "Sweet" },
];

async function main() {
  for (const meal of meals) {
    const existing = await prisma.menuItem.findFirst({ where: { name: meal.name, category: meal.category } });
    if (!existing) await prisma.menuItem.create({ data: { ...meal, active: true } });
  }

  const miners = [
    { name: "John Smith", mobile: "0400000001", company: "Sample Mining", roomNumber: "101" },
    { name: "David Lee", mobile: "0400000002", company: "Sample Mining", roomNumber: "102" },
  ];

  for (const miner of miners) {
    const existing = await prisma.miner.findUnique({ where: { mobile: miner.mobile } });
    if (!existing) await prisma.miner.create({ data: miner });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
