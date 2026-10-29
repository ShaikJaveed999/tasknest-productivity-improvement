const validateCreateTask = (body) => {
  const { title, important = false } = body || {};
  if (typeof title !== 'string' || !title.trim()) {
    return { error: 'Task title is required' };
  }
  if (typeof important !== 'boolean') {
    return { error: 'Important must be a boolean' };
  }

  return { data: { title: title.trim(), important } };
};

const validateTaskUpdate = (updates) => {
  const allowedFields = ['completed', 'important'];
  const fields = updates && typeof updates === 'object' && !Array.isArray(updates)
    ? Object.keys(updates)
    : [];

  if (fields.length === 0 || fields.some((field) => !allowedFields.includes(field))) {
    return { error: 'Provide completed and/or important task fields' };
  }
  if (fields.some((field) => typeof updates[field] !== 'boolean')) {
    return { error: 'Completed and important must be booleans' };
  }

  return { data: updates };
};

module.exports = {
  validateCreateTask,
  validateTaskUpdate
};
