import React, { useState, useEffect } from 'react';
import { MEAL_TEMPLATES, NUTRITION_DATA } from '../data/triviaData';

const MealPlanner = () => {
  const [weekPlan, setWeekPlan] = useState({});
  const [selectedDay, setSelectedDay] = useState('monday');
  const [totalNutrition, setTotalNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [saved, setSaved] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];

  useEffect(() => {
    // Load saved plan from localStorage
    const savedPlan = localStorage.getItem('mealPlan');
    if (savedPlan) {
      setWeekPlan(JSON.parse(savedPlan));
    } else {
      // Generate random plan
      generateRandomPlan();
    }
  }, []);

  const generateRandomPlan = () => {
    const plan = {};
    days.forEach(day => {
      plan[day] = {};
      mealTypes.forEach(meal => {
        const options = MEAL_TEMPLATES[meal];
        const random = options[Math.floor(Math.random() * options.length)];
        plan[day][meal] = random;
      });
    });
    setWeekPlan(plan);
    setSaved(false);
  };

  const changeMeal = (day, mealType) => {
    const options = MEAL_TEMPLATES[mealType];
    const currentName = weekPlan[day]?.[mealType]?.name;
    const available = options.filter(o => o.name !== currentName);
    const newMeal = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : options[Math.floor(Math.random() * options.length)];

    setWeekPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: newMeal
      }
    }));
    setSaved(false);
  };

  const calculateDayNutrition = (day) => {
    const dayPlan = weekPlan[day];
    if (!dayPlan) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    Object.values(dayPlan).forEach(meal => {
      meal.items.forEach(item => {
        const key = item.replace(/\s+/g, '_');
        const data = NUTRITION_DATA[key];
        if (data) {
          totals.calories += data.calories;
          totals.protein += data.protein;
          totals.carbs += data.carbs;
          totals.fat += data.fat;
          totals.fiber += data.fiber;
        }
      });
    });
    return {
      calories: Math.round(totals.calories * 10) / 10,
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10,
      fiber: Math.round(totals.fiber * 10) / 10
    };
  };

  const savePlan = () => {
    localStorage.setItem('mealPlan', JSON.stringify(weekPlan));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearPlan = () => {
    localStorage.removeItem('mealPlan');
    generateRandomPlan();
  };

  const dayNutrition = calculateDayNutrition(selectedDay);

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ margin: 0 }}>📅 Weekly Meal Planner</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={generateRandomPlan}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#00b4d8',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🎲 Random Plan
          </button>
          <button
            onClick={savePlan}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: saved ? '#28a745' : '#00c896',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {saved ? '✅ Saved!' : '💾 Save Plan'}
          </button>
          <button
            onClick={clearPlan}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #dc3545',
              background: '#fff',
              color: '#dc3545',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑 Clear
          </button>
        </div>
      </div>

      {/* Day selector */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '20px',
        overflowX: 'auto',
        padding: '5px',
        background: '#f8f9fa',
        borderRadius: '12px'
      }}>
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              flex: 1,
              padding: '10px 5px',
              borderRadius: '8px',
              border: 'none',
              background: selectedDay === day ? 'linear-gradient(135deg, #00c896, #00b4d8)' : 'transparent',
              color: selectedDay === day ? '#fff' : '#666',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: selectedDay === day ? 'bold' : 'normal',
              minWidth: '80px',
              textTransform: 'capitalize'
            }}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
        {/* Meals */}
        <div>
          {mealTypes.map(mealType => {
            const meal = weekPlan[selectedDay]?.[mealType];
            if (!meal) return null;

            return (
              <div
                key={mealType}
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    color: '#888',
                    marginBottom: '4px',
                    letterSpacing: '1px'
                  }}>
                    {mealType}
                  </div>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                    {meal.emoji} {meal.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#888' }}>
                    {meal.items.join(' • ')}
                  </div>
                </div>
                <button
                  onClick={() => changeMeal(selectedDay, mealType)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid #00c896',
                    background: 'transparent',
                    color: '#00c896',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🔄 Swap
                </button>
              </div>
            );
          })}
        </div>

        {/* Nutrition Summary */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea20, #764ba220)',
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          height: 'fit-content',
          position: 'sticky',
          top: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
            📊 {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}'s Nutrition
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{
              padding: '12px',
              background: '#fff',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
                {dayNutrition.calories}
              </div>
              <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Calories</div>
            </div>
            <div style={{
              padding: '12px',
              background: '#fff',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
                {dayNutrition.protein}g
              </div>
              <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Protein</div>
            </div>
            <div style={{
              padding: '12px',
              background: '#fff',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
                {dayNutrition.carbs}g
              </div>
              <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Carbs</div>
            </div>
            <div style={{
              padding: '12px',
              background: '#fff',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>
                {dayNutrition.fat}g
              </div>
              <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Fat</div>
            </div>
          </div>

          {/* Macro bars */}
          <div style={{ marginTop: '15px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Macro Distribution</div>
            <div style={{ height: '8px', borderRadius: '4px', background: '#e9ecef', overflow: 'hidden', display: 'flex' }}>
              {dayNutrition.protein + dayNutrition.carbs + dayNutrition.fat > 0 && (
                <>
                  <div style={{
                    width: `${(dayNutrition.protein / (dayNutrition.protein + dayNutrition.carbs + dayNutrition.fat)) * 100}%`,
                    background: '#3498db'
                  }} />
                  <div style={{
                    width: `${(dayNutrition.carbs / (dayNutrition.protein + dayNutrition.carbs + dayNutrition.fat)) * 100}%`,
                    background: '#f39c12'
                  }} />
                  <div style={{
                    width: `${(dayNutrition.fat / (dayNutrition.protein + dayNutrition.carbs + dayNutrition.fat)) * 100}%`,
                    background: '#9b59b6'
                  }} />
                </>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: '#888' }}>
              <span>🔵 Protein</span>
              <span>🟡 Carbs</span>
              <span>🟣 Fat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
