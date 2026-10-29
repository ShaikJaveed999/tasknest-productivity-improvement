import { useState } from 'react';
import { updateTask, deleteTaskFromApi } from '../services/api';
import { Trash2, Check, Star } from 'lucide-react';

const TaskCard = ({ task, onTaskUpdated }) => {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    setError('');
    setSaving(true);
    try {
      await updateTask(task.id, { completed: !task.completed });
      onTaskUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImportanceToggle = async () => {
    setError('');
    setSaving(true);
    try {
      await updateTask(task.id, { important: !task.important });
      onTaskUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setSaving(true);
    try {
      await deleteTaskFromApi(task.id);
      onTaskUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`task-card-v2 animate-fade ${task.completed ? 'completed' : ''} ${task.important ? 'important' : ''}`}>
      <div className="task-main">
        <button
          type="button"
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          disabled={saving}
          aria-label={task.completed ? `Reopen ${task.title}` : `Complete ${task.title}`}
        >
          {task.completed && <Check size={16} strokeWidth={4} />}
        </button>
        <span className="task-text">{task.title}</span>
      </div>

      <div className="task-actions">
        <button
          type="button"
          onClick={handleImportanceToggle}
          className={`importance-toggle ${task.important ? 'is-important' : ''}`}
          title={task.important ? 'Mark as normal' : 'Mark as important'}
          aria-label={task.important ? `Mark ${task.title} as normal` : `Mark ${task.title} as important`}
          aria-pressed={Boolean(task.important)}
          disabled={saving}
        >
          <Star size={18} />
          <span>{task.important ? 'Important' : 'Normal'}</span>
        </button>
        <button type="button" onClick={handleDelete} className="action-btn" title="Delete Task" aria-label={`Delete ${task.title}`} disabled={saving}>
          <Trash2 size={18} />
        </button>
      </div>
      {error && <p className="task-error" role="alert">{error}</p>}
    </div>
  );
};

export default TaskCard;
