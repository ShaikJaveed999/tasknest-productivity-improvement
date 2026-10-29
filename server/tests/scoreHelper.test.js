const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateProductivityScore } = require('../utils/scoreHelper');

test('returns zero for no tasks', () => {
  assert.deepEqual(calculateProductivityScore([]), {
    value: 0,
    completedTasks: 0,
    importantTasksCompleted: 0,
    totalTasks: 0
  });
});

test('incomplete normal tasks earn no points', () => {
  assert.equal(calculateProductivityScore([{ completed: false }]).value, 0);
});

test('completed normal tasks earn one point each', () => {
  assert.equal(calculateProductivityScore([{ completed: true }]).value, 1);
});

test('completed important tasks earn two points', () => {
  const result = calculateProductivityScore([{ completed: true, important: true }]);
  assert.equal(result.value, 2);
  assert.equal(result.importantTasksCompleted, 1);
});

test('only completed tasks contribute and missing importance defaults to normal', () => {
  const result = calculateProductivityScore([
    { completed: true },
    { completed: true, important: true },
    { completed: false, important: true }
  ]);
  assert.deepEqual(result, {
    value: 3,
    completedTasks: 2,
    importantTasksCompleted: 1,
    totalTasks: 3
  });
});

test('reopening or deleting a task removes its points when recalculated', () => {
  const completed = [{ completed: true, important: true }];
  assert.equal(calculateProductivityScore(completed).value, 2);
  assert.equal(calculateProductivityScore([{ ...completed[0], completed: false }]).value, 0);
  assert.equal(calculateProductivityScore([]).value, 0);
});

test('repeated reads of unchanged tasks return the same score', () => {
  const tasks = [{ completed: true }, { completed: true, important: true }];
  assert.deepEqual(calculateProductivityScore(tasks), calculateProductivityScore(tasks));
});
