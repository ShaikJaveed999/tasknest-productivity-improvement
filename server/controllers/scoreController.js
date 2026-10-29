const prisma = require('../utils/prisma');
const { calculateProductivityScore } = require('../utils/scoreHelper');

const getScore = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      select: { completed: true, important: true }
    });
    res.json(calculateProductivityScore(tasks));
  } catch (error) {
    console.error('Failed to fetch productivity score:', error);
    res.status(500).json({ error: 'Failed to fetch score' });
  }
};

module.exports = {
  getScore
};
