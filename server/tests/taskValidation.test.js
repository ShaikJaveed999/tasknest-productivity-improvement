const test = require('node:test');
const assert = require('node:assert/strict');
const { validateCreateTask, validateTaskUpdate } = require('../utils/taskValidation');

test('new tasks default to normal importance and trim their title', () => {
  assert.deepEqual(validateCreateTask({ title: '  Read notes  ' }), {
    data: { title: 'Read notes', important: false }
  });
});

test('new tasks accept an explicit boolean importance value', () => {
  assert.deepEqual(validateCreateTask({ title: 'Prepare demo', important: true }), {
    data: { title: 'Prepare demo', important: true }
  });
});

test('new tasks reject invalid importance values and blank titles', () => {
  assert.equal(validateCreateTask({ title: 'Task', important: 'true' }).error, 'Important must be a boolean');
  assert.equal(validateCreateTask({ title: '  ' }).error, 'Task title is required');
});

test('task updates accept only boolean completion or importance fields', () => {
  assert.deepEqual(validateTaskUpdate({ completed: true }), { data: { completed: true } });
  assert.deepEqual(validateTaskUpdate({ important: false }), { data: { important: false } });
  assert.equal(validateTaskUpdate({ important: 1 }).error, 'Completed and important must be booleans');
  assert.equal(validateTaskUpdate({ title: 'Changed' }).error, 'Provide completed and/or important task fields');
  assert.equal(validateTaskUpdate({}).error, 'Provide completed and/or important task fields');
});
