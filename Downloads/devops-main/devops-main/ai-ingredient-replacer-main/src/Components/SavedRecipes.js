import React, { useEffect, useState } from 'react';
import '../styles/SavedRecipes.css';

/**
 * SavedRecipes
 * Displays recipes saved to localStorage and allows users to remove them.
 */
const SavedRecipes = () => {
  // State to store the list of saved recipes
  const [savedRecipes, setSavedRecipes] = useState([]);

  /**
   * Loads saved recipes from localStorage on initial mount
   */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    setSavedRecipes(stored);
  }, []);

  /**
   * Handles removal of a saved recipe by ID.
   * Updates both state and localStorage.
   */
  const handleRemove = (id) => {
    const updatedRecipes = savedRecipes.filter(recipe => recipe.id !== id);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
  };

  return (
    <div className="saved-recipes-container">
      {/* Section Header */}
      <h2>Your Saved Recipes</h2>

      {/* Recipe List or Empty Message */}
      <div className="recipe-list">
        {savedRecipes.length === 0 ? (
          <p>No saved recipes yet.</p>
        ) : (
          savedRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p><strong>Summary:</strong> {recipe.description}</p>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{recipe.content}</pre>
              <button
                className="btn remove-btn"
                onClick={() => handleRemove(recipe.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
