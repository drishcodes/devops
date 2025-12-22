import React, { useEffect, useState, useContext } from 'react';
import '../styles/HeroSection.css';
import '../styles/MoodAnalytics.css';
import { 
  getDashboardMetrics, 
  getRecipeCount, 
  getUserCount, 
  addRecipe, 
  deleteRecipe, 
  updateRecipe, 
  getAllRecipes,
  getRecentActivity,
  getDailySuggestion,
  getAllMoodMeals
} from '../api';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';
import MoodAnalytics from './MoodAnalytics';

const API_BASE = 'http://localhost:5000/api'; // Change if needed
const DASHBOARD_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80'; // Cooking/ingredients bg

const cardIcons = [
  '🍲', // Recipes
  '🎉', // Mood Meals
  '👥', // Users
  '💡', // Suggestions
];

const DIETARY_OPTIONS = [
  { key: 'vegan', label: 'Vegan' },
  { key: 'nutFree', label: 'Nut-Free' },
  { key: 'glutenFree', label: 'Gluten-Free' },
  { key: 'dairyFree', label: 'Dairy-Free' },
  { key: 'eggFree', label: 'Egg-Free' },
  { key: 'sugarFree', label: 'Sugar-Free' },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [recipeCount, setRecipeCount] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem('dietaryPreferences');
    return stored ? JSON.parse(stored) : {
      vegan: false,
      nutFree: false,
      glutenFree: false,
      dairyFree: false,
      eggFree: false,
      sugarFree: false,
    };
  });
  const [prefSaved, setPrefSaved] = useState(false);
  // Fetch recent activity from localStorage
  const [recentSaved, setRecentSaved] = useState([]);
  const [recentReplaced, setRecentReplaced] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editRecipeIdx, setEditRecipeIdx] = useState(null);
  const [recipeForm, setRecipeForm] = useState({ title: '', ingredients: '', instructions: '' });
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [dailySuggestion, setDailySuggestion] = useState(null);
  const [suggestionLoading, setSuggestionLoading] = useState(true);
  const [moodMeals, setMoodMeals] = useState([]);
  const [moodMealsLoading, setMoodMealsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Save myRecipes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('myRecipes', JSON.stringify(myRecipes));
  }, [myRecipes]);

  const handleRecipeFormSubmit = async (e) => {
    e.preventDefault();
    if (!recipeForm.title.trim()) return;
    
    setSubmitting(true);
    
    try {
      // Parse ingredients and instructions into arrays
      const ingredientsArray = recipeForm.ingredients
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
        
      const stepsArray = recipeForm.instructions
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      // Prepare recipe data
      const recipeData = {
        title: recipeForm.title,
        description: `Created by ${user.fullName}`,
        ingredients: ingredientsArray,
        steps: stepsArray
      };
      
      if (editRecipeIdx !== null) {
        const recipe = myRecipes[editRecipeIdx];
        
        // If recipe has an _id, update it in the backend
        if (recipe._id) {
          await updateRecipe(recipe._id, recipeData);
        }
        
        // Update in local state
        const updated = [...myRecipes];
        updated[editRecipeIdx] = { 
          ...recipe, // Keep the _id if it exists
          ...recipeForm,
          // Store the parsed arrays for consistency
          ingredientsArray,
          stepsArray
        };
        setMyRecipes(updated);
      } else {
        // Add new recipe to backend
        const savedRecipe = await addRecipe(recipeData);
        
        // Add to local state with the _id from backend
        setMyRecipes([{ 
          ...recipeForm, 
          _id: savedRecipe._id,
          ingredientsArray,
          stepsArray
        }, ...myRecipes]);
        
        // Refresh recipe count
        const countData = await getRecipeCount();
        setRecipeCount(countData.count);
      }
      
      setShowRecipeForm(false);
      setEditRecipeIdx(null);
      setRecipeForm({ title: '', ingredients: '', instructions: '' });
    } catch (err) {
      console.error('Failed to save recipe:', err);
      alert('Failed to save recipe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRecipe = (idx) => {
    setEditRecipeIdx(idx);
    setRecipeForm(myRecipes[idx]);
    setShowRecipeForm(true);
  };

  const handleDeleteRecipe = async (idx) => {
    if (window.confirm('Delete this recipe?')) {
      try {
        setSubmitting(true);
        const recipe = myRecipes[idx];
        
        // If recipe has an _id, it's from the backend and needs to be deleted there
        if (recipe._id) {
          await deleteRecipe(recipe._id);
          // Refresh recipe count after deletion
          const countData = await getRecipeCount();
          setRecipeCount(countData.count);
        }
        
        // Remove from local state regardless of backend status
        setMyRecipes(myRecipes.filter((_, i) => i !== idx));
      } catch (err) {
        console.error('Failed to delete recipe:', err);
        alert('Failed to delete recipe. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch recipe count using the API
        const recipeData = await getRecipeCount();
        setRecipeCount(recipeData.count);

        // Fetch user count using the API
        const userCountData = await getUserCount();
        setUserCount(userCountData.count);

        // Fetch user's recipes from the backend
        try {
          const response = await getAllRecipes();
          if (response && response.recipes) {
            // Filter recipes created by the current user
            const userRecipes = response.recipes
              .filter(recipe => recipe.createdBy === user?._id)
              .map(recipe => ({
                _id: recipe._id,
                title: recipe.title,
                ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients,
                instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions,
                synced: true // Mark as synced with backend
              }));
            
            // Get local recipes that might not be synced yet
            const savedRecipes = localStorage.getItem('myRecipes');
            let localRecipes = [];
            if (savedRecipes) {
              localRecipes = JSON.parse(savedRecipes)
                .filter(recipe => !recipe._id) // Only include recipes without an ID (not synced)
                .map(recipe => ({ ...recipe, synced: false }));
            }
            
            // Combine backend and local recipes
            setMyRecipes([...userRecipes, ...localRecipes]);
          }
        } catch (recipeErr) {
          console.error('Error fetching user recipes:', recipeErr);
          // Fall back to local storage if API fails
          const localRecipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
          setMyRecipes(localRecipes);
        }

        // Fetch recent saved recipes from localStorage
        const saved = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        setRecentSaved(saved.slice(-3).reverse());
        
        // Fetch recent replaced recipes from localStorage
        const replaced = JSON.parse(localStorage.getItem('replacerHistory')) || [];
        setRecentReplaced(replaced.slice(-3).reverse());
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message || 'Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      setMetricsError('');
      
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
        setMetricsError('Failed to load dashboard metrics');
      } finally {
        setMetricsLoading(false);
      }
    };
    
    const fetchRecentActivity = async () => {
      setActivityLoading(true);
      
      try {
        const data = await getRecentActivity();
        setRecentActivity(data);
      } catch (err) {
        console.error('Error loading recent activity:', err);
      } finally {
        setActivityLoading(false);
      }
    };
    
    const fetchDailySuggestion = async () => {
      setSuggestionLoading(true);
      
      try {
        const data = await getDailySuggestion();
        setDailySuggestion(data);
      } catch (err) {
        console.error('Error loading daily suggestion:', err);
      } finally {
        setSuggestionLoading(false);
      }
    };
    
    const fetchMoodMeals = async () => {
      setMoodMealsLoading(true);
      
      try {
        const data = await getAllMoodMeals();
        setMoodMeals(data);
      } catch (err) {
        console.error('Error loading mood meals:', err);
      } finally {
        setMoodMealsLoading(false);
      }
    };
    
    fetchMetrics();
    fetchRecentActivity();
    fetchDailySuggestion();
    fetchMoodMeals();
  }, []);

  return (
    <section
      className="hero-container"
      style={{
        backgroundImage: `linear-gradient(rgba(20,24,28,0.95), rgba(20,24,28,0.98)), url(${DASHBOARD_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        height: 'auto',
        padding: 0,
        overflowY: 'auto',
      }}
    >
      <div className="overlay" style={{ minHeight: '100vh', alignItems: 'flex-start', paddingTop: 48, overflowY: 'auto', width: '100%' }}>
        <div
          className="hero-text"
          style={{
            maxWidth: 1100,
            width: '100%',
            margin: '0 auto',
            background: 'rgba(24,28,34,0.92)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            borderRadius: 24,
            padding: '2.5rem 2.5rem 2.5rem 2.5rem',
            animation: 'fadeIn 1.2s ease-in-out',
            minHeight: 'calc(100vh - 96px)',
            overflow: 'visible',
            color: '#f3f6fa',
          }}
        >
          {/* Animated, bold dashboard heading without block */}
          <h1 className="dashboard-animated-title" style={{ fontSize: '2.7rem', color: '#00e6a2', marginBottom: 24, letterSpacing: 1 }}>Welcome to Your Dashboard</h1>
          <hr style={{ border: 'none', borderTop: '2px solid #222', margin: '0 0 32px 0', opacity: 0.18 }} />
          {loading || metricsLoading ? (
            <p style={{ color: '#fff' }}>Loading...</p>
          ) : error || metricsError ? (
            <p style={{ color: '#ffb3b3' }}>{error || metricsError}</p>
          ) : (
            <>
              {/* User Greeting */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 36 }}>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=00c896&color=fff&size=80`}
                  alt="User Avatar"
                  style={{ borderRadius: '50%', width: 80, height: 80, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
                <div>
                  <h3 style={{ color: '#00e6a2', margin: 0, fontSize: '1.7rem', fontWeight: 700 }}>
                    Hello, {user.fullName || 'User'}!
                  </h3>
                  <p style={{ color: '#b0b8c1', margin: 0, fontSize: '1.1rem' }}>
                    Here’s your personalized dashboard.
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 36 }}>
                {/* Dietary Preferences Section */}
                <div style={{
                  background: 'linear-gradient(120deg, #232b33 0%, #1a232a 100%)',
                  borderRadius: 14,
                  padding: '1.2rem 1.5rem',
                  color: '#e0f7f1',
                  boxShadow: '0 2px 8px rgba(0,200,150,0.07)',
                  fontSize: '1.08rem',
                  fontWeight: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  maxWidth: 500,
                  border: '1px solid #222',
                }}>
                  <span role="img" aria-label="preferences" style={{ fontSize: '1.7rem', marginBottom: 6 }}>🥗</span>
                  <span style={{ fontWeight: 600, color: '#00e6a2', marginBottom: 6 }}>Your Dietary Preferences</span>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      localStorage.setItem('dietaryPreferences', JSON.stringify(preferences));
                      setPrefSaved(true);
                      setTimeout(() => setPrefSaved(false), 2000);
                    }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}
                  >
                    {DIETARY_OPTIONS.map(opt => (
                      <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
                        <input
                          type="checkbox"
                          checked={preferences[opt.key]}
                          onChange={e => setPreferences(p => ({ ...p, [opt.key]: e.target.checked }))}
                        />
                        {opt.label}
                      </label>
                    ))}
                    <button type="submit" className="btn green" style={{ marginLeft: 12, padding: '6px 18px', fontSize: '1em' }}>Save</button>
                    {prefSaved && <span style={{ color: '#00e6a2', marginLeft: 10 }}>Preferences saved!</span>}
                  </form>
                  <span style={{ fontSize: '0.98em', color: '#b0b8c1', marginTop: 4 }}>
                    (These will be used to filter recipes and suggestions in the future.)
                  </span>
                </div>
                {/* My Recipes Section */}
                <div style={{
                  background: 'linear-gradient(120deg, #232b33 0%, #1a232a 100%)',
                  borderRadius: 14,
                  padding: '1.2rem 1.5rem',
                  color: '#e0f7f1',
                  boxShadow: '0 2px 8px rgba(0,200,150,0.07)',
                  fontSize: '1.08rem',
                  fontWeight: 500,
                  maxWidth: 700,
                  border: '1px solid #222',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#00e6a2', fontSize: '1.15em' }}>🍳 My Recipes</span>
                    <button 
                      className="btn green" 
                      style={{ padding: '6px 18px', fontSize: '1em' }} 
                      onClick={() => { 
                        setShowRecipeForm(true); 
                        setEditRecipeIdx(null); 
                        setRecipeForm({ title: '', ingredients: '', instructions: '' }); 
                      }}
                      disabled={submitting}
                    >
                      Add Recipe
                    </button>
                  </div>
                  
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div className="spinner-small" style={{ margin: '0 auto' }}></div>
                      <p style={{ marginTop: 10, color: '#b0b8c1' }}>Loading your recipes...</p>
                    </div>
                  ) : myRecipes.length === 0 ? (
                    <div style={{ color: '#888', margin: '8px 0', textAlign: 'center', padding: '20px 0' }}>
                      No recipes yet. Add your first recipe!
                    </div>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {myRecipes.map((rec, idx) => (
                        <li key={idx} style={{ background: '#232b33', borderRadius: 10, marginBottom: 12, padding: '1rem', boxShadow: '0 1px 6px rgba(0,200,150,0.07)', color: '#e0f7f1' }}>
                          <div style={{ fontWeight: 600, color: '#00e6a2', fontSize: '1.08em', marginBottom: 4 }}>{rec.title}</div>
                          <div style={{ fontSize: '0.98em', color: '#b0b8c1', marginBottom: 4 }}><b>Ingredients:</b> {rec.ingredients}</div>
                          <div style={{ fontSize: '0.98em', color: '#b0b8c1', marginBottom: 4 }}><b>Instructions:</b> {rec.instructions}</div>
                          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                            <button 
                              className="btn yellow" 
                              style={{ padding: '4px 14px', fontSize: '0.95em' }} 
                              onClick={() => handleEditRecipe(idx)}
                              disabled={submitting}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn red" 
                              style={{ padding: '4px 14px', fontSize: '0.95em' }} 
                              onClick={() => handleDeleteRecipe(idx)}
                              disabled={submitting}
                            >
                              {submitting ? (
                                <div className="spinner-small" style={{ width: '14px', height: '14px', margin: '0 auto' }}></div>
                              ) : 'Delete'}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Recipe Form Modal */}
                  {showRecipeForm && (
                    <div style={{
                      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 3000,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <form onSubmit={handleRecipeFormSubmit} style={{ background: '#232b33', borderRadius: 16, padding: '2rem 2.5rem', minWidth: 320, maxWidth: '90vw', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', color: '#e0f7f1', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', border: '1px solid #222' }}>
                        <button 
                          type="button" 
                          onClick={() => setShowRecipeForm(false)} 
                          disabled={submitting}
                          style={{ position: 'absolute', top: 10, right: 18, background: 'none', border: 'none', fontSize: '1.5rem', color: '#00e6a2', cursor: submitting ? 'not-allowed' : 'pointer' }}
                        >
                          &times;
                        </button>
                        <h3 style={{ color: '#00e6a2', marginBottom: 8 }}>{editRecipeIdx !== null ? 'Edit Recipe' : 'Add Recipe'}</h3>
                        <input 
                          type="text" 
                          placeholder="Title" 
                          value={recipeForm.title} 
                          onChange={e => setRecipeForm(f => ({ ...f, title: e.target.value }))} 
                          required 
                          disabled={submitting}
                          style={{ padding: '10px', borderRadius: 8, border: '1px solid #222', fontSize: '1em', background: '#1a232a', color: '#e0f7f1' }} 
                        />
                        <textarea 
                          placeholder="Ingredients (one per line)" 
                          value={recipeForm.ingredients} 
                          onChange={e => setRecipeForm(f => ({ ...f, ingredients: e.target.value }))} 
                          rows={3} 
                          required 
                          disabled={submitting}
                          style={{ padding: '10px', borderRadius: 8, border: '1px solid #222', fontSize: '1em', background: '#1a232a', color: '#e0f7f1' }} 
                        />
                        <textarea 
                          placeholder="Instructions (one step per line)" 
                          value={recipeForm.instructions} 
                          onChange={e => setRecipeForm(f => ({ ...f, instructions: e.target.value }))} 
                          rows={4} 
                          required 
                          disabled={submitting}
                          style={{ padding: '10px', borderRadius: 8, border: '1px solid #222', fontSize: '1em', background: '#1a232a', color: '#e0f7f1' }} 
                        />
                        <button 
                          type="submit" 
                          className="btn green" 
                          disabled={submitting}
                          style={{ fontSize: '1em', position: 'relative' }}
                        >
                          {submitting ? (
                            <>
                              <span style={{ visibility: 'hidden' }}>{editRecipeIdx !== null ? 'Save Changes' : 'Add Recipe'}</span>
                              <div className="spinner-small" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                            </>
                          ) : (
                            editRecipeIdx !== null ? 'Save Changes' : 'Add Recipe'
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '2px solid #222', margin: '36px 0 32px 0', opacity: 0.18 }} />
              {/* Activity Summary */}
              <div style={{
                background: 'linear-gradient(120deg, #232b33 0%, #1a232a 100%)',
                borderRadius: 14,
                padding: '1.2rem 1.5rem',
                marginBottom: 32,
                color: '#e0f7f1',
                boxShadow: '0 2px 8px rgba(0,200,150,0.07)',
                fontSize: '1.08rem',
                fontWeight: 500,
                border: '1px solid #222',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 12 }}>
                  <span role="img" aria-label="activity" style={{ fontSize: '1.7rem' }}>📊</span>
                  <span style={{ fontWeight: 600, color: '#00e6a2' }}>Recent Activity</span>
                </div>
                
                {activityLoading ? (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div className="spinner-small" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: 10, color: '#b0b8c1' }}>Loading activity...</p>
                  </div>
                ) : recentActivity.length === 0 ? (
                  <p style={{ color: '#b0b8c1', fontStyle: 'italic' }}>No recent activity yet. Start creating recipes and exploring the app!</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {recentActivity.map((activity, idx) => (
                      <li key={idx} style={{ marginBottom: 8, padding: '8px 12px', background: '#1a232a', borderRadius: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>
                            <span style={{ color: '#00e6a2', fontWeight: 600 }}>{activity.type}</span>: {activity.details}
                          </span>
                          <span style={{ fontSize: '0.85em', color: '#b0b8c1' }}>
                            {new Date(activity.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {activity.user && (
                          <div style={{ fontSize: '0.9em', color: '#b0b8c1', marginTop: 4 }}>
                            by {activity.user.fullName}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <hr style={{ border: 'none', borderTop: '2px solid #222', margin: '0 0 32px 0', opacity: 0.18 }} />
              {/* Summary Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 32,
                  marginBottom: 40,
                }}
              >
                <div className="card teal" style={{ ...cardStyle, background: '#232b33', color: '#e0f7f1', border: '1px solid #222' }}>
                  <span style={iconStyle}>{cardIcons[0]}</span>
                  <h3>Total Recipes</h3>
                  <p style={countStyle}>{metricsLoading ? '...' : metrics?.totalRecipes ?? '-'}</p>
                </div>
                <div className="card yellow" style={{ ...cardStyle, background: '#232b33', color: '#e0f7f1', border: '1px solid #222', cursor: 'pointer' }} onClick={() => window.location.href = '/moodmeals'}>
                  <span style={iconStyle}>{cardIcons[1]}</span>
                  <h3>Mood Meals</h3>
                  <p style={countStyle}>{moodMealsLoading ? '...' : moodMeals?.length ?? '-'}</p>
                </div>
                <div className="card blue" style={{ ...cardStyle, background: '#232b33', color: '#e0f7f1', border: '1px solid #222' }}>
                  <span style={iconStyle}>{cardIcons[2]}</span>
                  <h3>Users</h3>
                  <p style={countStyle}>{metricsLoading ? '...' : metrics?.totalUsers ?? '-'}</p>
                </div>
                <div className="card red" style={{ ...cardStyle, background: '#232b33', color: '#e0f7f1', border: '1px solid #222' }}>
                  <span style={iconStyle}>{cardIcons[3]}</span>
                  <h3>Suggestions</h3>
                  <p style={countStyle}>{metricsLoading ? '...' : metrics?.suggestions ?? '-'}</p>
                </div>
              </div>
              {/* AI Suggestion of the Day, Recent Activity, Mini Calendar */}
              {/* Mood Analytics Section */}
              <div style={{ marginBottom: 32 }}>
                <MoodAnalytics />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, paddingBottom: 32 }}>
                {/* AI Suggestion of the Day */}
                <div className="suggestions-box" style={{ ...boxStyle, background: 'linear-gradient(120deg, #00c896 0%, #00e6a2 100%)', color: '#fff', boxShadow: '0 4px 24px rgba(0,200,150,0.13)', border: '1px solid #00e6a2' }}>
                  <h4 style={{ ...sectionTitleStyle, color: '#fff' }}>🤖 AI Suggestion of the Day</h4>
                  {suggestionLoading ? (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                      <div className="spinner-small" style={{ margin: '0 auto', borderColor: '#fff', borderTopColor: 'transparent' }}></div>
                      <p style={{ marginTop: 10, color: '#fff', opacity: 0.8 }}>Loading suggestion...</p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '1.15rem', fontWeight: 500 }}>
                      {dailySuggestion?.text || 'No suggestions yet.'}
                    </p>
                  )}
                </div>
                {/* Mood Meals */}
                <div className="activity-box" style={{ ...boxStyle, background: 'linear-gradient(120deg, #232b33 0%, #1a232a 100%)', color: '#e0f7f1', border: '1px solid #222' }}>
                  <h4 style={sectionTitleStyle}>🍲 Mood Meals</h4>
                  {moodMealsLoading ? (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                      <div className="spinner-small" style={{ margin: '0 auto' }}></div>
                      <p style={{ marginTop: 10, color: '#b0b8c1' }}>Loading mood meals...</p>
                    </div>
                  ) : moodMeals.length === 0 ? (
                    <p style={{ color: '#b0b8c1', fontStyle: 'italic' }}>No mood meals available yet.</p>
                  ) : (
                    <ul style={{ color: '#e0f7f1', fontSize: '1.05rem', margin: 0, paddingLeft: 18 }}>
                      {moodMeals.slice(0, 3).map((meal, idx) => (
                        <li key={idx} style={{ marginBottom: 8 }}>
                          <div style={{ fontWeight: 600, color: '#00e6a2' }}>{meal.mood} Mood</div>
                          <div>{meal.title}</div>
                          <div style={{ fontSize: '0.9em', color: '#b0b8c1' }}>{meal.description}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Mini Calendar */}
                <div className="calendar-box" style={{ ...boxStyle, background: 'linear-gradient(120deg, #232b33 0%, #1a232a 100%)', color: '#e0f7f1', border: '1px solid #222' }}>
                  <h4 style={sectionTitleStyle}>📅 Mini Calendar</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#00e6a2', marginBottom: 8 }}>
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#b0b8c1' }}>
                      {new Date().toLocaleDateString('en-US', { year: 'numeric' })}
                    </div>
                    <button 
                      className="btn green" 
                      style={{ marginTop: 16, padding: '6px 18px', fontSize: '0.9em' }}
                      onClick={() => window.alert('Calendar feature coming soon!')}
                    >
                      Plan Meals
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// Card and box styles
const cardStyle = {
  background: 'rgba(255,255,255,0.18)',
  borderRadius: 18,
  boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
  padding: '2rem 1.5rem 1.5rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.2s',
  color: '#222',
  position: 'relative',
  minHeight: 150,
};
const iconStyle = {
  fontSize: '2.2rem',
  marginBottom: 8,
  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))',
};
const countStyle = {
  fontSize: '2.1rem',
  fontWeight: 700,
  color: '#00c896',
  margin: 0,
};
const boxStyle = {
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
  padding: '1.5rem 1.2rem',
  minHeight: 120,
  marginBottom: 0,
};
const sectionTitleStyle = {
  color: '#00c896',
  fontWeight: 700,
  marginBottom: 12,
  fontSize: '1.15rem',
};

export default Dashboard;
