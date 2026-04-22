import React, { useState, useEffect, useContext } from 'react';
import '../styles/MoodSelector.css';
import { getCurrentAIConfig, extractAIResponse } from '../config/aiConfig';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Mapping of custom mood keywords to predefined mood categories.
 */
const moodKeywords = {
  low: ['tired', 'exhausted', 'sleepy', 'fatigued', 'energy', 'drained'],
  happy: ['happy', 'excited', 'joyful', 'cheerful', 'celebrate', 'celebration'],
  stressed: ['stressed', 'anxious', 'worried', 'nervous', 'tense', 'pressure'],
  workout: ['gym', 'workout', 'exercise', 'fitness', 'training', 'post-workout'],
  sad: ['sad', 'depressed', 'down', 'blue', 'unhappy', 'gloomy']
};

/**
 * MoodSelector
 * Allows users to select or type their mood to get tailored food recommendations.
 * Connects to backend to fetch mood-based meal recommendations and track user interactions.
 */
const MoodSelector = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();

  // State for mood selected via buttons
  const [selectedMood, setSelectedMood] = useState('');

  // State for custom mood input field
  const [customMood, setCustomMood] = useState('');

  // State for food recommendations based on mood
  const [recommendations, setRecommendations] = useState([]);

  // Additional state for backend integration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedMeals, setSavedMeals] = useState([]);

  /**
   * Load saved meals from localStorage on component mount
   */
  useEffect(() => {
    const saved = localStorage.getItem('savedMoodMeals');
    if (saved) {
      setSavedMeals(JSON.parse(saved));
    }
  }, []);

  /**
   * Handles click on mood button.
   * Sets selected mood, clears custom input, and fetches recommendations from API.
   */
  const handleMoodClick = async (moodKey) => {
    setSelectedMood(moodKey);
    setCustomMood('');
    setLoading(true);
    setError(null);

    try {
      const config = getCurrentAIConfig();
      const prompt = `I'm feeling ${moodKey}. Suggest 3-5 meal options that would be perfect for this mood. For each meal, provide:
      1. Meal name
      2. Brief description
      3. Key ingredients
      4. Why it's good for this mood

      Be specific and practical. Use emojis for better readability. Do not use asterisks or markdown formatting.`;

      const response = await fetch(config.BASE_URL, {
        method: 'POST',
        headers: config.HEADERS,
        body: JSON.stringify({
          model: config.MODEL,
          messages: [
            { role: 'system', content: 'You are a helpful food and nutrition expert. Provide meal recommendations based on mood. Format responses clearly without markdown or asterisks.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 800,
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const reply = extractAIResponse(data);
      const cleanedReply = reply ? reply.replace(/\*/g, '') : '';

      if (cleanedReply) {
        setRecommendations([{
          mood: moodKey,
          title: `${moodKey.charAt(0).toUpperCase() + moodKey.slice(1)} Meal Suggestions`,
          description: cleanedReply,
          recipes: []
        }]);
      } else {
        setError('Could not generate meal suggestions. Please try again.');
      }

    } catch (err) {
      console.error('Error generating mood meals:', err);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates customMood as user types.
   * Clears selected mood if typing in custom field.
   */
  const handleCustomInput = (e) => {
    setCustomMood(e.target.value);
    setSelectedMood('');
  };

  /**
   * Matches custom mood input to predefined moods using keywords.
   * If no match, uses the custom mood directly.
   */
  const handleSubmit = async () => {
    if (!customMood.trim()) {
      setError('Please enter a mood');
      return;
    }

    const mood = customMood.toLowerCase();
    let matchedMood = null;

    // Check if the custom mood matches any keywords
    for (const [key, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => mood.includes(keyword))) {
        matchedMood = key;
        break;
      }
    }

    if (matchedMood) {
      // If we found a match, use the predefined mood
      handleMoodClick(matchedMood);
    } else {
      // Otherwise, use the custom mood directly with AI
      setSelectedMood('');
      setLoading(true);
      setError(null);

      try {
        const config = getCurrentAIConfig();
        const prompt = `I'm feeling ${mood}. Suggest 3-5 meal options that would be perfect for this mood. For each meal, provide:
        1. Meal name
        2. Brief description
        3. Key ingredients
        4. Why it's good for this mood

        Be specific and practical. Use emojis for better readability. Do not use asterisks or markdown formatting.`;

        const response = await fetch(config.BASE_URL, {
          method: 'POST',
          headers: config.HEADERS,
          body: JSON.stringify({
            model: config.MODEL,
            messages: [
              { role: 'system', content: 'You are a helpful food and nutrition expert. Provide meal recommendations based on mood. Format responses clearly without markdown or asterisks.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 800,
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const reply = extractAIResponse(data);
        const cleanedReply = reply ? reply.replace(/\*/g, '') : '';

        if (cleanedReply) {
          setRecommendations([{
            mood: mood,
            title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Meal Suggestions`,
            description: cleanedReply,
            recipes: []
          }]);
        } else {
          setError('Could not generate meal suggestions. Please try again.');
        }

      } catch (err) {
        console.error('Error generating mood meals:', err);
        setError('Failed to generate recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveMeal = (meal) => {
    const saved = localStorage.getItem('savedMoodMeals');
    const savedMealsList = saved ? JSON.parse(saved) : [];
    savedMealsList.push(meal);
    localStorage.setItem('savedMoodMeals', JSON.stringify(savedMealsList));
    setSavedMeals(savedMealsList);
  };

  return (
    <div className="mood-container" style={{
      background: isDarkMode ? '#1a202c' : '#f7fafc',
      color: isDarkMode ? '#e2e8f0' : '#1a202c'
    }}>
      {/* Heading */}
      <h2 style={{ color: isDarkMode ? '#00e6a2' : '#2c5282' }}>
        Select or Type Your Mood <span role="img" aria-label="brain">🧠</span>
      </h2>

      {/* Mood Selection Buttons */}
      <div className="mood-options">
        <button
          className={`mood-btn ${selectedMood === 'happy' ? 'selected' : ''}`}
          onClick={() => handleMoodClick('happy')}
        >
          😊 Happy
        </button>

        <button
          className={`mood-btn ${selectedMood === 'stressed' ? 'selected' : ''}`}
          onClick={() => handleMoodClick('stressed')}
        >
          😰 Stressed
        </button>

        <button
          className={`mood-btn ${selectedMood === 'low' ? 'selected' : ''}`}
          onClick={() => handleMoodClick('low')}
        >
          🥱 Low Energy
        </button>
        
        <button
          className={`mood-btn ${selectedMood === 'workout' ? 'selected' : ''}`}
          onClick={() => handleMoodClick('workout')}
        >
          💪 Post-Workout
        </button>
        
        <button
          className={`mood-btn ${selectedMood === 'sad' ? 'selected' : ''}`}
          onClick={() => handleMoodClick('sad')}
        >
          😢 Sad
        </button>
      </div>

      {/* Custom Mood Input */}
      <div className="custom-input">
        <input
          type="text"
          placeholder="Enter your mood (e.g., stressed, lazy, excited)"
          value={customMood}
          onChange={handleCustomInput}
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Get Suggestions
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Finding the perfect meal for your mood...</p>
        </div>
      )}

      {/* Display Recommendations */}
      {!loading && recommendations.length > 0 && (
        <div className="recommendations" style={{
          backgroundColor: isDarkMode ? '#2d3748' : '#fff',
          borderColor: isDarkMode ? '#4a5568' : '#e2e8f0'
        }}>
          <h3 style={{ color: isDarkMode ? '#00e6a2' : '#2c5282' }}>Recommended for {selectedMood || customMood}</h3>
          <div className="meal-cards">
            {recommendations.map((meal, index) => (
              <div key={index} className="meal-card" style={{
                backgroundColor: isDarkMode ? '#1a202c' : '#fff',
                borderColor: isDarkMode ? '#4a5568' : '#e2e8f0'
              }}>
                <h4 style={{ color: isDarkMode ? '#00e6a2' : '#2c5282' }}>{meal.title}</h4>
                <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: isDarkMode ? '#e2e8f0' : '#4a5568' }}>{meal.description}</p>
                {meal.recipes && meal.recipes.length > 0 && (
                  <div className="recipe-list">
                    <h5 style={{ color: isDarkMode ? '#b0b8c1' : '#718096' }}>Recipes:</h5>
                    <ul>
                      {meal.recipes.map((recipe, idx) => (
                        <li key={idx} style={{ color: isDarkMode ? '#e2e8f0' : '#4a5568' }}>{recipe.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="meal-actions">
                  <button
                    className="action-btn save-btn"
                    onClick={() => handleSaveMeal(meal)}
                    style={{
                      backgroundColor: isDarkMode ? '#2d3748' : '#f7fafc',
                      color: isDarkMode ? '#e2e8f0' : '#2c5282',
                      borderColor: isDarkMode ? '#4a5568' : '#e2e8f0'
                    }}
                  >
                    💾 Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Saved Meals Section */}
      {savedMeals.length > 0 && (
        <div className="saved-meals" style={{
          backgroundColor: isDarkMode ? '#2d3748' : '#fff',
          borderColor: isDarkMode ? '#4a5568' : '#e2e8f0'
        }}>
          <h3 style={{ color: isDarkMode ? '#00e6a2' : '#2c5282' }}>Your Saved Meals</h3>
          <div className="meal-cards">
            {savedMeals.map((meal, index) => (
              <div key={index} className="meal-card saved" style={{
                backgroundColor: isDarkMode ? '#1a202c' : '#fff',
                borderColor: isDarkMode ? '#00e6a2' : '#3182ce'
              }}>
                <h4 style={{ color: isDarkMode ? '#00e6a2' : '#2c5282' }}>{meal.title}</h4>
                <p style={{ color: isDarkMode ? '#e2e8f0' : '#4a5568' }}>{meal.description}</p>
                {meal.recipes && meal.recipes.length > 0 && (
                  <div className="recipe-list">
                    <h5 style={{ color: isDarkMode ? '#b0b8c1' : '#718096' }}>Recipes:</h5>
                    <ul>
                      {meal.recipes.map((recipe, idx) => (
                        <li key={idx} style={{ color: isDarkMode ? '#e2e8f0' : '#4a5568' }}>{recipe.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="saved-badge">Saved</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
