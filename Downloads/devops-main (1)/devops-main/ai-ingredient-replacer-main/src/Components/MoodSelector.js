import React, { useState, useEffect, useContext } from 'react';
import '../styles/MoodSelector.css';
import { getMoodMealsByMood, trackMoodSelection, updateMoodMealInteraction, getUserSavedMeals } from '../api';
import { AuthContext } from '../context/AuthContext';

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
  const [interactions, setInteractions] = useState({});
  const [currentStatId, setCurrentStatId] = useState(null);

  /**
   * Fetch saved meals on component mount
   */
  useEffect(() => {
    const fetchSavedMeals = async () => {
      try {
        const meals = await getUserSavedMeals();
        setSavedMeals(meals);
      } catch (err) {
        console.error('Error fetching saved meals:', err);
      }
    };
    
    if (user) {
      fetchSavedMeals();
    }
  }, [user]);

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
      // Fetch mood-based meal recommendations
      const mealData = await getMoodMealsByMood(moodKey);
      
      if (mealData && mealData.length > 0) {
        setRecommendations(mealData);
      } else {
        setRecommendations([{
          mood: moodKey,
          title: `Default ${moodKey} Meal`,
          description: `We don't have specific recommendations for ${moodKey} yet.`,
          recipes: []
        }]);
      }
      
      // Track this mood selection
      const trackData = await trackMoodSelection({
        mood: moodKey,
        mealId: mealData && mealData.length > 0 ? mealData[0]._id : null
      });
      
      // Save the stat ID for later interactions
      if (trackData && trackData.moodStat) {
        setCurrentStatId(trackData.moodStat._id);
      }
      
    } catch (err) {
      console.error('Error fetching mood meals:', err);
      setError('Failed to load recommendations. Please try again.');
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
      // Otherwise, use the custom mood directly
      setSelectedMood('');
      setLoading(true);
      setError(null);
      
      try {
        // Try to find meals for this custom mood
        const mealData = await getMoodMealsByMood(mood);
        
        if (mealData && mealData.length > 0) {
          setRecommendations(mealData);
        } else {
          // If no specific meals found, create default recommendations
          setRecommendations([{
            mood: mood,
            title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Meal`,
            description: `A balanced meal for when you're feeling ${mood}.`,
            recipes: []
          }]);
        }
        
        // Track this mood selection
        const trackData = await trackMoodSelection({
          mood: mood,
          mealId: mealData && mealData.length > 0 ? mealData[0]._id : null
        });
        
        // Save the stat ID for later interactions
        if (trackData && trackData.moodStat) {
          setCurrentStatId(trackData.moodStat._id);
        }
        
      } catch (err) {
        console.error('Error processing custom mood:', err);
        setError('Failed to process your mood. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  /**
   * Handle liking a meal recommendation
   */
  const handleLikeMeal = async (mealId) => {
    if (!currentStatId) return;
    
    try {
      // Update the interaction in state for immediate UI feedback
      setInteractions(prev => ({
        ...prev,
        [mealId]: { ...prev[mealId], liked: true }
      }));
      
      // Send the update to the backend
      await updateMoodMealInteraction({
        statId: currentStatId,
        liked: true
      });
      
    } catch (err) {
      console.error('Error liking meal:', err);
      // Revert the UI change if the API call fails
      setInteractions(prev => ({
        ...prev,
        [mealId]: { ...prev[mealId], liked: false }
      }));
    }
  };
  
  /**
   * Handle saving a meal recommendation
   */
  const handleSaveMeal = async (meal) => {
    if (!currentStatId) return;
    
    try {
      // Update the interaction in state for immediate UI feedback
      setInteractions(prev => ({
        ...prev,
        [meal._id]: { ...prev[meal._id], saved: true }
      }));
      
      // Add to saved meals for immediate UI update
      setSavedMeals(prev => [...prev, meal]);
      
      // Send the update to the backend
      await updateMoodMealInteraction({
        statId: currentStatId,
        saved: true
      });
      
    } catch (err) {
      console.error('Error saving meal:', err);
      // Revert the UI changes if the API call fails
      setInteractions(prev => ({
        ...prev,
        [meal._id]: { ...prev[meal._id], saved: false }
      }));
      setSavedMeals(prev => prev.filter(m => m._id !== meal._id));
    }
  };

  return (
    <div className="mood-container">
      {/* Heading */}
      <h2>
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
        <div className="recommendations">
          <h3>Recommended for {selectedMood || customMood}</h3>
          <div className="meal-cards">
            {recommendations.map((meal, index) => (
              <div key={index} className="meal-card">
                <h4>{meal.title}</h4>
                <p>{meal.description}</p>
                {meal.recipes && meal.recipes.length > 0 && (
                  <div className="recipe-list">
                    <h5>Recipes:</h5>
                    <ul>
                      {meal.recipes.map((recipe, idx) => (
                        <li key={idx}>{recipe.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="meal-actions">
                  <button 
                    className={`action-btn like-btn ${interactions[meal._id]?.liked ? 'active' : ''}`}
                    onClick={() => handleLikeMeal(meal._id)}
                  >
                    {interactions[meal._id]?.liked ? '❤️ Liked' : '🤍 Like'}
                  </button>
                  <button 
                    className={`action-btn save-btn ${interactions[meal._id]?.saved ? 'active' : ''}`}
                    onClick={() => handleSaveMeal(meal)}
                    disabled={interactions[meal._id]?.saved}
                  >
                    {interactions[meal._id]?.saved ? '✅ Saved' : '💾 Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Saved Meals Section */}
      {savedMeals.length > 0 && (
        <div className="saved-meals">
          <h3>Your Saved Meals</h3>
          <div className="meal-cards">
            {savedMeals.map((meal, index) => (
              <div key={index} className="meal-card saved">
                <h4>{meal.title}</h4>
                <p>{meal.description}</p>
                {meal.recipes && meal.recipes.length > 0 && (
                  <div className="recipe-list">
                    <h5>Recipes:</h5>
                    <ul>
                      {meal.recipes.map((recipe, idx) => (
                        <li key={idx}>{recipe.title}</li>
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
