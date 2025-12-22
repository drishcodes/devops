import React, { useState, useEffect, useContext } from 'react';
import '../styles/MoodSelector.css';
import { getMoodMealsByMood, trackMoodSelection, updateMoodMealInteraction, getUserSavedMeals } from '../api';
import { AuthContext } from '../context/AuthContext';

/**
 * Fallback mood-based recipes for when backend is unavailable
 */
const fallbackMoodRecipes = {
  happy: [
    {
      _id: 'happy_1',
      title: 'Celebration Pasta',
      description: 'A colorful and joyful pasta dish to lift your spirits',
      recipes: [
        { title: 'Rainbow Vegetable Pasta', ingredients: ['Pasta', 'Bell peppers', 'Broccoli', 'Carrots'], instructions: ['Cook pasta', 'Sauté vegetables', 'Combine and serve'] },
        { title: 'Fruit Tart', ingredients: ['Tart shell', 'Mixed berries', 'Cream'], instructions: ['Fill tart', 'Top with fruits', 'Chill and serve'] }
      ]
    },
    {
      _id: 'happy_2',
      title: 'Sunshine Smoothie Bowl',
      description: 'Bright and energizing to match your happy mood',
      recipes: [
        { title: 'Tropical Smoothie Bowl', ingredients: ['Mango', 'Pineapple', 'Coconut milk', 'Granola'], instructions: ['Blend fruits', 'Pour in bowl', 'Top with granola'] }
      ]
    }
  ],
  stressed: [
    {
      _id: 'stressed_1',
      title: 'Comforting Chicken Soup',
      description: 'Warm and soothing to help you relax',
      recipes: [
        { title: 'Classic Chicken Noodle Soup', ingredients: ['Chicken', 'Noodles', 'Carrots', 'Celery', 'Broth'], instructions: ['Cook chicken', 'Add vegetables', 'Simmer with noodles'] }
      ]
    },
    {
      _id: 'stressed_2',
      title: 'Herbal Tea with Honey',
      description: 'Calming herbal infusion to reduce stress',
      recipes: [
        { title: 'Chamomile Lavender Tea', ingredients: ['Chamomile', 'Lavender', 'Honey', 'Hot water'], instructions: ['Steep herbs', 'Add honey', 'Enjoy warm'] }
      ]
    }
  ],
  low: [
    {
      _id: 'low_1',
      title: 'Energy-Boosting Breakfast',
      description: 'Nutritious meal to restore your energy levels',
      recipes: [
        { title: 'Power Oatmeal Bowl', ingredients: ['Oats', 'Banana', 'Nuts', 'Honey'], instructions: ['Cook oats', 'Top with fruits and nuts', 'Drizzle honey'] },
        { title: 'Green Smoothie', ingredients: ['Spinach', 'Banana', 'Protein powder', 'Almond milk'], instructions: ['Blend all ingredients', 'Serve immediately'] }
      ]
    },
    {
      _id: 'low_2',
      title: 'Iron-Rich Salad',
      description: 'Nutrient-dense to combat fatigue',
      recipes: [
        { title: 'Spinach Power Salad', ingredients: ['Spinach', 'Chickpeas', 'Seeds', 'Lemon dressing'], instructions: ['Combine greens', 'Add protein', 'Toss with dressing'] }
      ]
    }
  ],
  workout: [
    {
      _id: 'workout_1',
      title: 'Protein Power Bowl',
      description: 'High-protein meal for muscle recovery',
      recipes: [
        { title: 'Grilled Chicken Quinoa Bowl', ingredients: ['Chicken breast', 'Quinoa', 'Vegetables', 'Olive oil'], instructions: ['Grill chicken', 'Cook quinoa', 'Combine with vegetables'] },
        { title: 'Protein Smoothie', ingredients: ['Protein powder', 'Banana', 'Peanut butter', 'Milk'], instructions: ['Blend all ingredients', 'Serve immediately'] }
      ]
    },
    {
      _id: 'workout_2',
      title: 'Recovery Wrap',
      description: 'Balanced nutrients for post-exercise recovery',
      recipes: [
        { title: 'Turkey Avocado Wrap', ingredients: ['Turkey', 'Whole wheat tortilla', 'Avocado', 'Vegetables'], instructions: ['Layer ingredients', 'Roll wrap', 'Serve fresh'] }
      ]
    }
  ],
  sad: [
    {
      _id: 'sad_1',
      title: 'Comfort Mac and Cheese',
      description: 'Creamy and comforting classic comfort food',
      recipes: [
        { title: 'Baked Macaroni and Cheese', ingredients: ['Macaroni', 'Cheddar cheese', 'Milk', 'Butter'], instructions: ['Cook pasta', 'Make cheese sauce', 'Bake until golden'] }
      ]
    },
    {
      _id: 'sad_2',
      title: 'Warm Chocolate Cake',
      description: 'Sweet treat to brighten your mood',
      recipes: [
        { title: 'Chocolate Lava Cake', ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Flour'], instructions: ['Mix ingredients', 'Bake until edges firm', 'Serve warm'] }
      ]
    }
  ]
};

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
      // Try to fetch mood-based meal recommendations from backend
      const mealData = await getMoodMealsByMood(moodKey);
      
      if (mealData && mealData.length > 0) {
        setRecommendations(mealData);
      } else {
        // Use fallback recipes if no data from backend
        const fallbackRecipes = fallbackMoodRecipes[moodKey] || [];
        setRecommendations(fallbackRecipes);
      }
      
      // Try to track this mood selection (don't fail if backend is down)
      try {
        const trackData = await trackMoodSelection({
          mood: moodKey,
          mealId: mealData && mealData.length > 0 ? mealData[0]._id : null
        });
        
        // Save the stat ID for later interactions
        if (trackData && trackData.moodStat) {
          setCurrentStatId(trackData.moodStat._id);
        }
      } catch (trackErr) {
        console.log('Backend tracking unavailable, using fallback mode');
        // Don't set error, just continue without tracking
      }
      
    } catch (err) {
      console.error('Backend unavailable, using fallback recipes:', err);
      // Use fallback recipes when backend fails
      const fallbackRecipes = fallbackMoodRecipes[moodKey] || [];
      setRecommendations(fallbackRecipes);
      setError(null); // Clear any error since we have fallback data
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
          // If no specific meals found, create default recommendations with recipes
          setRecommendations([{
            _id: `custom_${mood}`,
            mood: mood,
            title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Mood Meal`,
            description: `A balanced meal for when you're feeling ${mood}.`,
            recipes: [
              { 
                title: 'Comfort Rice Bowl', 
                ingredients: ['Rice', 'Mixed vegetables', 'Soy sauce', 'Egg'], 
                instructions: ['Cook rice', 'Sauté vegetables', 'Add egg', 'Season and serve'] 
              },
              { 
                title: 'Simple Soup', 
                ingredients: ['Vegetable broth', 'Carrots', 'Celery', 'Onions'], 
                instructions: ['Chop vegetables', 'Simmer in broth', 'Serve hot'] 
              }
            ]
          }]);
        }
        
        // Try to track this mood selection (don't fail if backend is down)
        try {
          const trackData = await trackMoodSelection({
            mood: mood,
            mealId: mealData && mealData.length > 0 ? mealData[0]._id : null
          });
          
          // Save the stat ID for later interactions
          if (trackData && trackData.moodStat) {
            setCurrentStatId(trackData.moodStat._id);
          }
        } catch (trackErr) {
          console.log('Backend tracking unavailable, using fallback mode');
          // Don't set error, just continue without tracking
        }
        
      } catch (err) {
        console.error('Backend unavailable, using fallback recipes:', err);
        // Use fallback recipes when backend fails
        setRecommendations([{
          _id: `custom_${mood}`,
          mood: mood,
          title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Mood Meal`,
          description: `A balanced meal for when you're feeling ${mood}.`,
          recipes: [
            { 
              title: 'Comfort Rice Bowl', 
              ingredients: ['Rice', 'Mixed vegetables', 'Soy sauce', 'Egg'], 
              instructions: ['Cook rice', 'Sauté vegetables', 'Add egg', 'Season and serve'] 
            },
            { 
              title: 'Simple Soup', 
              ingredients: ['Vegetable broth', 'Carrots', 'Celery', 'Onions'], 
              instructions: ['Chop vegetables', 'Simmer in broth', 'Serve hot'] 
            }
          ]
        }]);
        setError(null); // Clear any error since we have fallback data
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
                    {meal.recipes.map((recipe, idx) => (
                      <div key={idx} className="recipe-item">
                        <h6>{recipe.title}</h6>
                        {recipe.ingredients && (
                          <div className="recipe-ingredients">
                            <strong>Ingredients:</strong>
                            <ul>
                              {recipe.ingredients.map((ingredient, i) => (
                                <li key={i}>{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {recipe.instructions && (
                          <div className="recipe-instructions">
                            <strong>Instructions:</strong>
                            <ol>
                              {recipe.instructions.map((instruction, i) => (
                                <li key={i}>{instruction}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
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
                    {meal.recipes.map((recipe, idx) => (
                      <div key={idx} className="recipe-item">
                        <h6>{recipe.title}</h6>
                        {recipe.ingredients && (
                          <div className="recipe-ingredients">
                            <strong>Ingredients:</strong>
                            <ul>
                              {recipe.ingredients.map((ingredient, i) => (
                                <li key={i}>{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {recipe.instructions && (
                          <div className="recipe-instructions">
                            <strong>Instructions:</strong>
                            <ol>
                              {recipe.instructions.map((instruction, i) => (
                                <li key={i}>{instruction}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
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
