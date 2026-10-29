const { validateCreateTask, validateTaskUpdate } = require('../utils/taskValidation');
const prisma = require('../utils/prisma');

const isValidTaskId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const validation = validateCreateTask(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const task = await prisma.task.create({
      data: validation.data
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  if (!isValidTaskId(id)) {
    return res.status(400).json({ error: 'Task id must be a positive integer' });
  }

  const validation = validateTaskUpdate(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: validation.data
    });
    res.json(task);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.error('Failed to update task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  if (!isValidTaskId(id)) {
    return res.status(400).json({ error: 'Task id must be a positive integer' });
  }

  try {
    await prisma.task.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.error('Failed to delete task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
