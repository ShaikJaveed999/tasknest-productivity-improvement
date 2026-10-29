const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const request = async (path, options) => {
  const response = await fetch(`${API_URL}${path}`, options);
  if (response.status === 204) return null;

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return data;
};

export const fetchTasks = () => request('/tasks');

export const createTask = (title, important = false) => request('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, important })
  });

export const updateTask = (id, updates) => request(`/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

export const deleteTaskFromApi = (id) => request(`/tasks/${id}`, {
    method: 'DELETE'
  });

export const fetchScore = () => request('/score');
