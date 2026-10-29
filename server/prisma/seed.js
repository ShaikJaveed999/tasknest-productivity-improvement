const prisma = require('../utils/prisma');

async function main() {
  const taskCount = await prisma.task.count();
  if (taskCount === 0) {
    await prisma.task.createMany({
      data: [
        { title: 'Finish assignment', completed: false },
        { title: 'Review lecture notes', completed: true },
        { title: 'Complete coding challenge', completed: false },
      ],
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
