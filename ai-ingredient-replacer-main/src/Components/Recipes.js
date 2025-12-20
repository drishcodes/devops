import React, { useEffect, useState } from 'react';
import '../styles/Recipes.css'; // 
import { getCurrentProviderConfig, extractResponseContent, createGeminiRequest } from '../config/apiConfig';


const defaultRecipes = [
  {
    name: 'Vegan Pancakes',
    description: 'Fluffy pancakes made with almond milk and flaxseed.',
  },
  {
    name: 'Gluten-Free Pasta',
    description: 'Delicious rice flour pasta served with veggie sauce.',
  },
  {
    name: 'Nut-Free Brownies',
    description: 'Chocolatey brownies using sunflower seed butter.',
  },
];

const Recipes = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState(defaultRecipes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const voiceQuery = localStorage.getItem('voiceSearch');
    if (voiceQuery) {
      setQuery(voiceQuery);
      fetchRecipes(voiceQuery);
      localStorage.removeItem('voiceSearch');
    }
  }, []);

  const fetchRecipes = async (dishName) => {
    if (!dishName.trim()) return;
    setLoading(true);
    try {
      const config = getCurrentProviderConfig();
      
      const prompt = `Give me a detailed recipe for ${dishName}. Only return the recipe in short format with title and ingredients.`;
      
      const response = await fetch(config.BASE_URL, {
        method: 'POST',
        headers: config.HEADERS,
        body: JSON.stringify(createGeminiRequest(prompt))
      });

      if (response.status === 429) {
        setRecipes([{ name: 'API call limit exceeded', description: 'You have reached the daily limit for API calls. Please try again tomorrow.' }]);
        return;
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API response:', data);

      const content = extractResponseContent(data) || 'No recipe found';

      setRecipes([
        {
          name: dishName.charAt(0).toUpperCase() + dishName.slice(1),
          description: content,
        },
      ]);
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setRecipes([{ name: 'Error', description: 'Failed to fetch recipe.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Only update query on change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchRecipes(query);
    }
  };

  // Search on button click
  const handleSearchClick = () => {
    fetchRecipes(query);
  };

  return (
    <div className="recipes-container">
      
      {/* Section Header */}
      <h2>Featured Recipes</h2>
      <p className="subheading">
        Explore healthy, allergy-safe, and AI-optimized recipes
      </p>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search for any dish..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="recipe-search"
        />
        <button 
          onClick={handleSearchClick}
          style={{ 
            padding: '6px 14px', 
            borderRadius: '6px', 
            background: '#00c896', 
            color: '#fff', 
            border: 'none', 
            fontWeight: 500, 
            cursor: 'pointer', 
            fontSize: '1em',
            height: '36px',
            alignSelf: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
          }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading recipe from AI...</p>
      ) : (
        <div className="recipe-cards">
          {recipes.map((recipe, index) => (
            <div className="recipe-card" key={index}>
              <h3>{recipe.name}</h3>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{recipe.description}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
