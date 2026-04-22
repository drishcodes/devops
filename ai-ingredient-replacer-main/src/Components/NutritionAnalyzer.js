import React, { useState } from 'react';
import { NUTRITION_DATA } from '../data/triviaData';
import { getCurrentAIConfig, extractAIResponse, SYSTEM_PROMPTS } from '../config/aiConfig';

const NutritionAnalyzer = () => {
  const [ingredients, setIngredients] = useState('');
  const [results, setResults] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIngredients, setCompareIngredients] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const analyze = () => {
    const items = ingredients.toLowerCase().split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    const analyzed = [];
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    items.forEach(item => {
      const key = item.replace(/\s+/g, '_');
      const data = NUTRITION_DATA[key];
      if (data) {
        analyzed.push({ name: item, ...data });
        totals.calories += data.calories;
        totals.protein += data.protein;
        totals.carbs += data.carbs;
        totals.fat += data.fat;
        totals.fiber += data.fiber;
      } else {
        analyzed.push({ name: item, calories: null, emoji: '❓' });
      }
    });

    setResults({ items: analyzed, totals });
  };

  const compare = () => {
    const items1 = ingredients.toLowerCase().split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    const items2 = compareIngredients.toLowerCase().split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);

    const calcTotals = (items) => {
      const t = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, found: [], notFound: [] };
      items.forEach(item => {
        const key = item.replace(/\s+/g, '_');
        const data = NUTRITION_DATA[key];
        if (data) {
          t.calories += data.calories;
          t.protein += data.protein;
          t.carbs += data.carbs;
          t.fat += data.fat;
          t.fiber += data.fiber;
          t.found.push(item);
        } else {
          t.notFound.push(item);
        }
      });
      return t;
    };

    setResults({
      compare: true,
      set1: { items: items1, totals: calcTotals(items1) },
      set2: { items: items2, totals: calcTotals(items2) }
    });
  };

  const getAIAnalysis = async () => {
    if (!ingredients.trim() || aiLoading) return;

    setAiLoading(true);
    setAiAnalysis('Thinking... 🤔');

    try {
      const config = getCurrentAIConfig();
      const prompt = `Analyze the nutritional value of these ingredients: ${ingredients}.
      Provide:
      1. Overall nutritional assessment
      2. Health benefits
      3. Potential concerns
      4. Suggestions for improvement
      5. Daily value percentages if possible
      Be concise and informative. Use emojis for better readability. Do not use asterisks or markdown formatting.`;

      const response = await fetch(config.BASE_URL, {
        method: 'POST',
        headers: config.HEADERS,
        body: JSON.stringify({
          model: config.MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPTS.CHATBOT },
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
        setAiAnalysis(cleanedReply);
      } else {
        setAiAnalysis('Could not generate analysis. Please try again.');
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      setAiAnalysis('Unable to connect to AI service. Using local analysis only.');
    } finally {
      setAiLoading(false);
    }
  };

  const getAIComparison = async () => {
    if (!ingredients.trim() || !compareIngredients.trim() || aiLoading) return;

    setAiLoading(true);
    setAiAnalysis('Comparing... ⚖️');

    try {
      const config = getCurrentAIConfig();
      const prompt = `Compare the nutritional value of these two sets of ingredients:
      Set A: ${ingredients}
      Set B: ${compareIngredients}

      Provide a detailed comparison including:
      1. Calorie comparison (which set has more/less calories)
      2. Protein comparison and which is better for muscle building
      3. Carbohydrate comparison and which is better for energy
      4. Fat comparison and which is healthier
      5. Fiber comparison and which is better for digestion
      6. Overall health recommendation
      7. Best use case for each set (e.g., pre-workout, post-workout, weight loss, etc.)

      Be concise and informative. Use emojis for better readability. Format as a clear comparison table or list. Do not use asterisks or markdown formatting.`;

      const response = await fetch(config.BASE_URL, {
        method: 'POST',
        headers: config.HEADERS,
        body: JSON.stringify({
          model: config.MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPTS.CHATBOT },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const reply = extractAIResponse(data);
      const cleanedReply = reply ? reply.replace(/\*/g, '') : '';

      if (cleanedReply) {
        setAiAnalysis(cleanedReply);
      } else {
        setAiAnalysis('Could not generate comparison. Please try again.');
      }
    } catch (error) {
      console.error('AI Comparison error:', error);
      setAiAnalysis('Unable to connect to AI service. Using local comparison only.');
    } finally {
      setAiLoading(false);
    }
  };

  const getHealthRating = (totals) => {
    if (!totals || totals.calories === 0) return { rating: 'N/A', color: '#888', emoji: '❓' };
    const proteinRatio = totals.protein * 4 / totals.calories;
    const fatRatio = totals.fat * 9 / totals.calories;
    const fiberPer1000 = totals.fiber / (totals.calories / 1000);

    let score = 0;
    if (proteinRatio > 0.2) score += 2;
    else if (proteinRatio > 0.1) score += 1;
    if (fatRatio < 0.35) score += 2;
    else if (fatRatio < 0.45) score += 1;
    if (fiberPer1000 > 14) score += 2;
    else if (fiberPer1000 > 7) score += 1;
    if (totals.calories < 600) score += 1;

    if (score >= 5) return { rating: 'Excellent', color: '#28a745', emoji: '🌟' };
    if (score >= 3) return { rating: 'Good', color: '#00c896', emoji: '👍' };
    if (score >= 1) return { rating: 'Fair', color: '#ffc107', emoji: '⚡' };
    return { rating: 'Needs Improvement', color: '#dc3545', emoji: '⚠️' };
  };

  const availableFoods = Object.keys(NUTRITION_DATA).map(k => k.replace(/_/g, ' '));

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '10px' }}>🔬 Nutrition Analyzer</h2>
      <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
        Enter ingredients separated by commas to analyze their nutritional value
      </p>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setCompareMode(false)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: !compareMode ? '#00c896' : '#e9ecef',
            color: !compareMode ? '#fff' : '#666',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Analyze
        </button>
        <button
          onClick={() => setCompareMode(true)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: compareMode ? '#00c896' : '#e9ecef',
            color: compareMode ? '#fff' : '#666',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ⚖️ Compare
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
          {compareMode ? 'Set A:' : 'Ingredients:'}
        </label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder={`e.g., ${availableFoods.slice(0, 5).join(', ')}`}
          rows={3}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>

      {compareMode && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Set B:
          </label>
          <textarea
            value={compareIngredients}
            onChange={(e) => setCompareIngredients(e.target.value)}
            placeholder={`e.g., ${availableFoods.slice(5, 10).join(', ')}`}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>
      )}

      <button
        onClick={compareMode ? compare : analyze}
        style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(135deg, #00c896, #00b4d8)',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '10px'
        }}
      >
        {compareMode ? '⚖️ Compare Nutrition' : '🔬 Analyze Nutrition'}
      </button>

      <button
        onClick={compareMode ? getAIComparison : getAIAnalysis}
        disabled={aiLoading || !ingredients.trim() || (compareMode && !compareIngredients.trim())}
        style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          background: aiLoading ? '#999' : 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: aiLoading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '10px'
        }}
      >
        {aiLoading ? '🤔 Analyzing...' : compareMode ? '⚖️ Smart Comparison' : '📊 Get Detailed Analysis'}
      </button>

      {/* Available foods hint */}
      <div style={{
        marginTop: '10px',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#888'
      }}>
        <strong>Available foods:</strong> {availableFoods.join(', ')}
      </div>

      {/* Expert Analysis */}
      {aiAnalysis && (
        <div style={{
          marginTop: '20px',
          padding: '25px',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(44, 82, 130, 0.08)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c5282', fontSize: '1.2rem', fontWeight: '600' }}>
            {compareMode ? '⚖️ Smart Comparison' : '📊 Detailed Analysis'}
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
            {aiAnalysis}
          </div>
        </div>
      )}

      {/* Results */}
      {results && !results.compare && (
        <div style={{ marginTop: '25px' }}>
          {/* Health Rating */}
          <div style={{
            padding: '15px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Health Rating</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: getHealthRating(results.totals).color }}>
                {getHealthRating(results.totals).emoji} {getHealthRating(results.totals).rating}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#888' }}>Total Calories</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
                {results.totals.calories} kcal
              </div>
            </div>
          </div>

          {/* Macro breakdown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '15px'
          }}>
            {[
              { label: 'Protein', value: results.totals.protein, unit: 'g', color: '#3498db' },
              { label: 'Carbs', value: results.totals.carbs, unit: 'g', color: '#f39c12' },
              { label: 'Fat', value: results.totals.fat, unit: 'g', color: '#9b59b6' },
              { label: 'Fiber', value: results.totals.fiber, unit: 'g', color: '#2ecc71' },
            ].map(macro => (
              <div key={macro.label} style={{
                padding: '12px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: macro.color }}>
                  {macro.value}{macro.unit}
                </div>
                <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>
                  {macro.label}
                </div>
              </div>
            ))}
          </div>

          {/* Individual items */}
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Per Ingredient:</h3>
          {results.items.map((item, i) => (
            <div key={i} style={{
              padding: '10px 15px',
              background: item.calories === null ? '#fff3cd' : '#fff',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              marginBottom: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>
                {item.emoji || '🍽'} {item.name}
              </span>
              {item.calories !== null ? (
                <span style={{ color: '#888', fontSize: '13px' }}>
                  {item.calories} kcal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                </span>
              ) : (
                <span style={{ color: '#dc3545', fontSize: '13px' }}>Data not available</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Compare Results */}
      {results && results.compare && (
        <div style={{ marginTop: '25px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            {[
              { label: 'Set A', data: results.set1, color: '#00c896' },
              { label: 'Set B', data: results.set2, color: '#00b4d8' },
            ].map(set => {
              const health = getHealthRating(set.data.totals);
              return (
                <div key={set.label} style={{
                  padding: '20px',
                  background: '#fff',
                  borderRadius: '12px',
                  border: `2px solid ${set.color}30`
                }}>
                  <h3 style={{ color: set.color, margin: '0 0 10px 0' }}>{set.label}</h3>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>
                    {set.data.items.join(', ')}
                  </div>
                  {set.data.totals.notFound && set.data.totals.notFound.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#e74c3c', marginBottom: '10px', background: '#fff3cd', padding: '5px 8px', borderRadius: '4px' }}>
                      ⚠️ Not found in database: {set.data.totals.notFound.join(', ')}
                    </div>
                  )}
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '5px' }}>
                    {set.data.totals.calories} kcal
                  </div>
                  <div style={{ fontSize: '14px', color: health.color, marginBottom: '10px' }}>
                    {health.emoji} {health.rating}
                  </div>
                  {[
                    { label: 'Protein', value: set.data.totals.protein, color: '#3498db' },
                    { label: 'Carbs', value: set.data.totals.carbs, color: '#f39c12' },
                    { label: 'Fat', value: set.data.totals.fat, color: '#9b59b6' },
                    { label: 'Fiber', value: set.data.totals.fiber, color: '#2ecc71' },
                  ].map(m => (
                    <div key={m.label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 0',
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '13px'
                    }}>
                      <span>{m.label}</span>
                      <span style={{ fontWeight: 'bold', color: m.color }}>{m.value}g</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionAnalyzer;
