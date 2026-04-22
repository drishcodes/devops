import React, { useEffect, useState } from 'react';
import '../styles/Recipes.css';
import { searchRecipes, RECIPES } from '../data/foodData';
import { getCurrentAIConfig, extractAIResponse, SYSTEM_PROMPTS } from '../config/aiConfig';

const Recipes = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dietFilter, setDietFilter] = useState('');
  const [aiRecipe, setAiRecipe] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  useEffect(() => {
    // Load all recipes on mount
    const allRecipes = searchRecipes('');
    setRecipes(allRecipes);

    const voiceQuery = localStorage.getItem('voiceSearch');
    if (voiceQuery) {
      setQuery(voiceQuery);
      handleSearch(voiceQuery);
      localStorage.removeItem('voiceSearch');
    }
  }, []);

  const handleSearch = (searchQuery) => {
    const q = searchQuery || query;
    setLoading(true);
    setTimeout(() => {
      let results = searchRecipes(q);
      if (dietFilter) {
        results = results.filter(r => r.tags.includes(dietFilter));
      }
      setRecipes(results.length > 0 ? results : []);
      setLoading(false);
    }, 200);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (!e.target.value.trim()) {
      setRecipes(searchRecipes(''));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDietFilter = (filter) => {
    setDietFilter(filter);
    setLoading(true);
    setTimeout(() => {
      let results = searchRecipes(query);
      if (filter) {
        results = results.filter(r => r.tags.includes(filter));
      }
      setRecipes(results);
      setLoading(false);
    }, 200);
  };

  const generateAIRecipe = async () => {
    if (!aiPrompt.trim() || aiLoading) return;

    setAiLoading(true);
    setAiRecipe({ name: 'Generating...', ingredients: [], steps: [] });

    try {
      const config = getCurrentAIConfig();
      const dietText = dietFilter ? `Dietary requirements: ${dietFilter}.` : '';
      const prompt = `Generate a detailed recipe based on this request: ${aiPrompt}. ${dietText}
      Provide the response in this exact JSON format:
      {
        "name": "Recipe Name",
        "time": "Prep time",
        "difficulty": "Difficulty level",
        "ingredients": ["ingredient1", "ingredient2", ...],
        "steps": ["step1", "step2", ...],
        "tags": ["tag1", "tag2", ...]
      }
      Make sure the JSON is valid and complete.`;

      const response = await fetch(config.BASE_URL, {
        method: 'POST',
        headers: config.HEADERS,
        body: JSON.stringify({
          model: config.MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPTS.RECIPES },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const reply = extractAIResponse(data);

      if (reply) {
        try {
          const jsonMatch = reply.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const recipeData = JSON.parse(jsonMatch[0]);
            setAiRecipe(recipeData);
          } else {
            setAiRecipe(null);
            alert('Could not parse recipe from AI response. Please try again.');
          }
        } catch (e) {
          console.error('JSON parse error:', e);
          setAiRecipe(null);
          alert('Could not parse recipe from AI response. Please try again.');
        }
      }
    } catch (error) {
      console.error('AI Recipe error:', error);
      setAiRecipe(null);
      alert('Unable to connect to AI service. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  if (selectedRecipe || aiRecipe) {
    const recipe = selectedRecipe || aiRecipe;
    return (
      <div className="recipes-container">
        <button
          onClick={() => {
            setSelectedRecipe(null);
            setAiRecipe(null);
          }}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            background: '#00c896',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Recipes
        </button>
        <div className="recipe-card" style={{ padding: '20px' }}>
          {aiRecipe && (
            <div style={{
              marginBottom: '15px',
              padding: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              🍳 Custom Recipe
            </div>
          )}
          <h2>{recipe.name}</h2>
          <div style={{ margin: '10px 0', color: '#666' }}>
            ⏱ {recipe.time} &nbsp;|&nbsp; 📊 {recipe.difficulty}
            &nbsp;|&nbsp; 🏷 {recipe.tags ? recipe.tags.join(', ') : ''}
          </div>
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients && recipe.ingredients.map((ing, i) => (
              <li key={i} style={{ marginBottom: '4px' }}>{ing}</li>
            ))}
          </ul>
          <h3>Instructions:</h3>
          <ol>
            {recipe.steps && recipe.steps.map((step, i) => (
              <li key={i} style={{ marginBottom: '8px', lineHeight: '1.6' }}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="recipes-container">
      <h2>📖 Recipe Collection</h2>
      <p className="subheading">
        Browse our curated recipes — works completely offline!
      </p>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search recipes... (e.g. stir fry, salad, curry)"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="recipe-search"
          style={{ minWidth: '200px', flex: 1 }}
        />
        <select
          value={dietFilter}
          onChange={(e) => handleDietFilter(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        >
          <option value="">All Diets</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="gluten-free">Gluten-Free</option>
          <option value="quick">Quick (&lt;15 min)</option>
        </select>
        <button
          onClick={() => handleSearch()}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            background: '#00c896',
            color: '#fff',
            border: 'none',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '1em',
            height: '36px'
          }}
        >
          Search
        </button>
      </div>

      {/* Custom Recipe Generation */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f0fe 100%)',
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid #e0e7ff'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#667eea', fontSize: '16px' }}>🍳 Custom Recipe Generator</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Describe what you want to cook... (e.g., 'healthy breakfast with eggs')"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateAIRecipe()}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
          <button
            onClick={generateAIRecipe}
            disabled={aiLoading || !aiPrompt.trim()}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: aiLoading ? '#999' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              fontWeight: 500,
              cursor: aiLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {aiLoading ? 'Generating...' : 'Generate Recipe'}
          </button>
        </div>
        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
          Describe any dish you want and get a custom recipe created for you!
        </p>
      </div>

      {loading ? (
        <p>Searching recipes...</p>
      ) : recipes.length > 0 ? (
        <div className="recipe-cards" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {recipes.map((recipe) => (
            <div
              className="recipe-card"
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3>{recipe.name}</h3>
              <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>
                ⏱ {recipe.time} &nbsp;|&nbsp; 📊 {recipe.difficulty}
              </div>
              <div style={{ marginBottom: '8px' }}>
                {recipe.tags.map(tag => (
                  <span key={tag} style={{
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    marginRight: '4px'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.4' }}>
                {recipe.ingredients.slice(0, 3).join(', ')}...
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          No recipes found. Try a different search term or filter.
        </p>
      )}
    </div>
  );
};

export default Recipes;
