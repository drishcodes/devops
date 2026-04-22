import React, { useState } from 'react';
import '../styles/Replacer.css';
import { SUBSTITUTIONS, findSubstitutions } from '../data/foodData';
import { getCurrentAIConfig, extractAIResponse, SYSTEM_PROMPTS } from '../config/aiConfig';

const Replacer = () => {
  const [recipe, setRecipe] = useState('');
  const [preferences, setPreferences] = useState({
    dairyFree: false,
    glutenFree: false,
    eggFree: false,
    sugarFree: false,
    nutFree: false,
    vegan: false,
  });

  const [output, setOutput] = useState('');
  const [explanations, setExplanations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleCheckboxChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.checked,
    });
  };

  // Map checkbox names to substitution database keys
  const prefToCategory = {
    dairyFree: 'dairy',
    glutenFree: 'gluten',
    eggFree: 'egg',
    sugarFree: 'sugar',
    nutFree: 'nut',
    vegan: 'dairy', // vegan includes dairy-free
  };

  const handleReplace = () => {
    if (!recipe.trim()) {
      setOutput('Please enter a recipe.');
      setExplanations([]);
      return;
    }

    setLoading(true);
    setOutput('');
    setExplanations([]);

    // Simulate a small delay
    setTimeout(() => {
      const activePrefs = Object.entries(preferences)
        .filter(([_, checked]) => checked)
        .map(([key]) => key);

      if (activePrefs.length === 0) {
        setOutput(recipe);
        setExplanations(['No dietary restrictions selected — recipe unchanged.']);
        setLoading(false);
        return;
      }

      let modifiedRecipe = recipe;
      const replacementsMade = [];

      // Process each active dietary preference
      for (const pref of activePrefs) {
        const category = prefToCategory[pref];
        if (!category || !SUBSTITUTIONS[category]) continue;

        const categorySubs = SUBSTITUTIONS[category];

        for (const [ingredient, subs] of Object.entries(categorySubs)) {
          // Check if the ingredient appears in the recipe
          const ingredientRegex = new RegExp(`\\b${ingredient}\\b`, 'gi');
          if (ingredientRegex.test(modifiedRecipe)) {
            const bestSub = subs[0]; // Use the first (best) substitution
            modifiedRecipe = modifiedRecipe.replace(ingredientRegex, bestSub.sub);
            replacementsMade.push(
              `${ingredient} → ${bestSub.sub} (${bestSub.ratio}) — ${bestSub.tip}`
            );
          }
        }

        // Vegan also needs egg substitutions
        if (pref === 'vegan' && SUBSTITUTIONS.egg) {
          for (const [ingredient, subs] of Object.entries(SUBSTITUTIONS.egg)) {
            const ingredientRegex = new RegExp(`\\b${ingredient}\\b`, 'gi');
            if (ingredientRegex.test(modifiedRecipe)) {
              const bestSub = subs[0];
              modifiedRecipe = modifiedRecipe.replace(ingredientRegex, bestSub.sub);
              replacementsMade.push(
                `${ingredient} → ${bestSub.sub} (${bestSub.ratio}) — ${bestSub.tip}`
              );
            }
          }
        }
      }

      setOutput(modifiedRecipe);
      setExplanations(replacementsMade);

      // Track in localStorage
      const replacerHistory = JSON.parse(localStorage.getItem('replacerHistory')) || [];
      const newEntry = {
        title: modifiedRecipe.split('\n')[0] || 'Untitled Recipe',
        date: new Date().toISOString(),
      };
      const updatedHistory = [newEntry, ...replacerHistory].slice(0, 10);
      localStorage.setItem('replacerHistory', JSON.stringify(updatedHistory));

      setLoading(false);
    }, 500);
  };

  const saveRecipeToLocalStorage = () => {
    if (!output) {
      alert("Please generate a modified recipe first.");
      return;
    }
    const saved = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const newRecipe = {
      id: Date.now(),
      title: output.split('\n')[0] || 'Untitled Recipe',
      description: explanations.join(', ') || 'No explanation provided.',
      content: output,
    };
    saved.push(newRecipe);
    localStorage.setItem('savedRecipes', JSON.stringify(saved));
    alert('Recipe saved!');
  };

  const getAIReplacement = async () => {
    if (!recipe.trim() || aiLoading) return;

    const activePrefs = Object.entries(preferences)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);

    if (activePrefs.length === 0) {
      setAiResponse('Please select at least one dietary preference.');
      return;
    }

    setAiLoading(true);
    setAiResponse('Thinking... 🤔');

    try {
      const config = getCurrentAIConfig();
      const prefText = activePrefs.map(p => p.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ');
      const prompt = `I have a recipe that needs ingredient substitutions for the following dietary restrictions: ${prefText}.

Recipe:
${recipe}

Please:
1. Identify ingredients that need substitution
2. Suggest appropriate substitutions with ratios
3. Explain why each substitution works
4. Provide the complete modified recipe
5. Add tips for best results

Be specific about ratios and cooking adjustments. Use emojis for better readability. Format the response clearly with sections for substitutions, modified recipe, and tips. Do not use asterisks or markdown formatting.`;

      const response = await fetch(config.BASE_URL, {
        method: 'POST',
        headers: config.HEADERS,
        body: JSON.stringify({
          model: config.MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPTS.REPLACER },
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
      const cleanedReply = reply ? reply.replace(/\*/g, '') : '';

      if (cleanedReply) {
        setAiResponse(cleanedReply);
      } else {
        setAiResponse('Could not generate replacement. Please try again.');
      }
    } catch (error) {
      console.error('AI Replacement error:', error);
      setAiResponse('Unable to connect to AI service. Using local replacement only.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveMeal = () => {
    if (!aiResponse.trim()) return;

    const savedRecipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    const newRecipe = {
      title: `AI Generated Recipe - ${new Date().toLocaleDateString()}`,
      ingredients: recipe,
      instructions: aiResponse,
      createdAt: new Date().toISOString(),
      fromReplacer: true,
      synced: false
    };
    savedRecipes.unshift(newRecipe);
    localStorage.setItem('myRecipes', JSON.stringify(savedRecipes));
    alert('Recipe saved to dashboard!');
  };

  const sampleRecipesLeft = [
    {
      name: 'Classic Pancakes',
      text: `Classic Pancakes\n\nIngredients:\n- 1 cup flour\n- 2 tbsp sugar\n- 1 cup milk\n- 1 egg\n- 2 tbsp butter\n- 1 tsp baking powder\n- Pinch of salt\n\nInstructions:\n1. Mix dry ingredients.\n2. Add wet ingredients and whisk.\n3. Cook on a hot griddle until golden.`
    },
    {
      name: 'Spaghetti Carbonara',
      text: `Spaghetti Carbonara\n\nIngredients:\n- 200g spaghetti\n- 100g pancetta\n- 2 eggs\n- 50g parmesan cheese\n- 1 clove garlic\n- Salt & pepper\n\nInstructions:\n1. Cook spaghetti.\n2. Fry pancetta with garlic.\n3. Mix eggs and cheese.\n4. Combine all and season.`
    },
    {
      name: 'Banana Bread',
      text: `Banana Bread\n\nIngredients:\n- 3 ripe bananas\n- 1/3 cup melted butter\n- 1 cup sugar\n- 1 egg\n- 1 tsp vanilla\n- 1 tsp baking soda\n- Pinch of salt\n- 1.5 cups flour\n\nInstructions:\n1. Mash bananas.\n2. Mix in butter, sugar, egg, vanilla.\n3. Add dry ingredients.\n4. Bake at 350°F for 1 hour.`
    }
  ];

  const sampleRecipesRight = [
    {
      name: 'Vegetable Stir Fry',
      text: `Vegetable Stir Fry\n\nIngredients:\n- 1 cup broccoli florets\n- 1 bell pepper, sliced\n- 1 carrot, julienned\n- 2 tbsp soy sauce\n- 1 tbsp olive oil\n- 1 clove garlic, minced\n- 1 tsp ginger, grated\n\nInstructions:\n1. Heat oil in a pan.\n2. Add garlic and ginger, sauté.\n3. Add vegetables and stir fry.\n4. Add soy sauce and cook until veggies are tender.`
    },
    {
      name: 'Chicken Caesar Salad',
      text: `Chicken Caesar Salad\n\nIngredients:\n- 2 cups romaine lettuce\n- 1 grilled chicken breast, sliced\n- 1/4 cup parmesan cheese\n- 1/2 cup croutons\n- Caesar dressing\n\nInstructions:\n1. Toss lettuce with dressing.\n2. Top with chicken, cheese, and croutons.`
    },
    {
      name: 'Tomato Soup',
      text: `Tomato Soup\n\nIngredients:\n- 4 ripe tomatoes, chopped\n- 1 onion, chopped\n- 2 cloves garlic, minced\n- 2 cups vegetable broth\n- 1 tbsp olive oil\n- Salt & pepper\n\nInstructions:\n1. Sauté onion and garlic.\n2. Add tomatoes and cook.\n3. Add broth, simmer 20 min.\n4. Blend and season.`
    }
  ];

  return (
    <>
      <div className="floating-recipes-bar left">
        <span>Try a sample recipe:</span>
        {sampleRecipesLeft.map((rec, idx) => (
          <button
            key={idx}
            className="sample-recipe-btn"
            onClick={() => setRecipe(rec.text)}
            type="button"
          >
            {rec.name}
          </button>
        ))}
      </div>

      <div className="floating-recipes-bar right">
        <span>Try a sample recipe:</span>
        {sampleRecipesRight.map((rec, idx) => (
          <button
            key={idx}
            className="sample-recipe-btn"
            onClick={() => setRecipe(rec.text)}
            type="button"
          >
            {rec.name}
          </button>
        ))}
      </div>

      <div className="replacer-container">
        <h2>🔄 Ingredient Replacer</h2>

        <textarea
          placeholder="Paste your recipe here..."
          rows={8}
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
        />

        <div className="checkboxes">
          {Object.entries(preferences).map(([key, value]) => (
            <label key={key}>
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleCheckboxChange}
              />
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
          ))}
        </div>

        <button onClick={getAIReplacement} disabled={aiLoading || !recipe.trim()}>
          {aiLoading ? '🤔 Analyzing...' : '🤖 Smart Replacement'}
        </button>

        {output && (
          <div className="output-box">
            <h3>Modified Recipe:</h3>
            <pre>{output}</pre>
            <button onClick={saveRecipeToLocalStorage}>Save Recipe</button>
          </div>
        )}

        {explanations.length > 0 && (
          <div className="explanation-box">
            <h3>Replacements Made:</h3>
            <ul>
              {explanations.map((exp, idx) => (
                <li key={idx}>{exp}</li>
              ))}
            </ul>
          </div>
        )}

        {aiResponse && (
          <div style={{
            marginTop: '25px',
            padding: '25px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 15px rgba(44, 82, 130, 0.08)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c5282', fontSize: '1.2rem', fontWeight: '600' }}>
              🤖 Smart Replacement
            </h3>
            <div style={{
              whiteSpace: 'pre-line',
              lineHeight: '1.7',
              color: '#1a202c',
              fontSize: '14px',
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              {aiResponse}
            </div>
            <button
              onClick={handleSaveMeal}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #3182ce, #38b2ac)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              💾 Save to Dashboard
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Replacer;
