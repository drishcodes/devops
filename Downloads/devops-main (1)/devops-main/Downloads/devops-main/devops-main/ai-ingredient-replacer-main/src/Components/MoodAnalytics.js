import React, { useState, useEffect } from 'react';
import { getMoodAnalytics } from '../api';

/**
 * MoodAnalytics Component
 * Displays analytics about user's mood selections and interactions with mood meals
 */
const MoodAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getMoodAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching mood analytics:', err);
        setError('Failed to load mood analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Loading mood analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!analytics || (!analytics.topMood && !analytics.totalSelections)) {
    return (
      <div className="analytics-empty">
        <p>No mood data available yet. Try selecting some moods first!</p>
      </div>
    );
  }

  return (
    <div className="mood-analytics-container">
      <h3 className="analytics-title">Your Mood Insights</h3>
      
      <div className="analytics-grid">
        {/* Top Mood Card */}
        <div className="analytics-card">
          <div className="card-icon">😊</div>
          <h4>Top Mood</h4>
          <p className="card-value">
            {analytics.topMood ? (
              <>
                <span className="highlight">{analytics.topMood._id}</span>
                <span className="count">({analytics.topMood.count} times)</span>
              </>
            ) : (
              'None yet'
            )}
          </p>
        </div>

        {/* Favorite Meal Card */}
        <div className="analytics-card">
          <div className="card-icon">🍽️</div>
          <h4>Favorite Meal</h4>
          <p className="card-value">
            {analytics.topSavedMeal ? (
              <span className="highlight">{analytics.topSavedMeal.title}</span>
            ) : (
              'None saved yet'
            )}
          </p>
        </div>

        {/* Total Selections Card */}
        <div className="analytics-card">
          <div className="card-icon">📊</div>
          <h4>Total Selections</h4>
          <p className="card-value">
            <span className="highlight">{analytics.totalSelections || 0}</span>
          </p>
        </div>
      </div>

      {/* Mood Trend Section */}
      {analytics.moodTrend && analytics.moodTrend.length > 0 && (
        <div className="mood-trend">
          <h4>Your Mood Trend (Last 7 Days)</h4>
          <div className="trend-container">
            {analytics.moodTrend.map((item, index) => (
              <div key={index} className="trend-item">
                <div className="trend-day">{new Date(item._id.day).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="trend-mood">{item._id.mood}</div>
                <div className="trend-count">{item.count} times</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodAnalytics;