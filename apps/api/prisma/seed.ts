import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const topics = [
  { title: 'Budgeting', description: 'Track income and expenses to build a spending plan.' },
  { title: 'Emergency Fund', description: 'Build a financial safety net for unexpected expenses.' },
  { title: 'Debt Management', description: 'Strategies to pay down and eliminate debt effectively.' },
  { title: 'Investing Basics', description: 'Foundations of growing wealth through investments.' },
  { title: 'Retirement Planning', description: 'Long-term strategies for financial independence.' },
];

async function main() {
  const existing = await prisma.topic.count();
  if (existing > 0) {
    console.log(`Skipping seed — ${existing} topics already present.`);
    return;
  }

  await prisma.topic.createMany({ data: topics });
  console.log(`Seeded ${topics.length} topics.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
