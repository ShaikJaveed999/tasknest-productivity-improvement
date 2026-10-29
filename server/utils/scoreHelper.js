const calculateProductivityScore = (tasks = []) => {
  const completedTasks = tasks.filter((task) => task.completed);
  const importantTasksCompleted = completedTasks.filter((task) => task.important === true).length;

  return {
    value: completedTasks.reduce((score, task) => score + (task.important === true ? 2 : 1), 0),
    completedTasks: completedTasks.length,
    importantTasksCompleted,
    totalTasks: tasks.length
  };
};

module.exports = {
  calculateProductivityScore
};
