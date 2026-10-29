import React, { useState, useEffect } from 'react';
import { fetchScore } from '../services/api';
import { Award, Check, Star } from 'lucide-react';

const ScoreWidget = ({ tasks }) => {
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getScore = async () => {
      try {
        const data = await fetchScore();
        setScore(data);
        setError('');
      } catch (err) {
        setScore(null);
        setError(err.message);
      }
    };
    getScore();
  }, [tasks]);

  return (
    <div className="score-hero-card">
      <div className="score-hero-left">
        <h2>Your Productivity</h2>
        <div className="score-big">
          {score ? score.value : '—'}
          <span>pts</span>
        </div>
        <p style={{ marginTop: '1rem', opacity: 0.7 }}>
          1 point per completed normal task; 2 points per completed important task.
        </p>
        {error && <p className="score-error" role="alert">{error}</p>}
      </div>
      <div className="score-hero-right">
        <div className="score-stat">
          <Check size={17} />
          {score ? score.completedTasks : '—'} completed
        </div>
        <div className="score-stat">
          <Star size={17} />
          {score ? score.importantTasksCompleted : '—'} important completed
        </div>
        <div className="logo-icon score-award">
          <Award size={42} />
        </div>
      </div>
    </div>
  );
};

export default ScoreWidget;
