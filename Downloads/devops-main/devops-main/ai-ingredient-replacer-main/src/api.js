import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const AUTH_URL = `${BASE_URL}/auth`;
const RECIPES_URL = `${BASE_URL}/recipes`;
const DASHBOARD_URL = `${BASE_URL}/dashboard`;
const ACTIVITY_URL = `${BASE_URL}/activity`;
const SUGGESTIONS_URL = `${BASE_URL}/suggestions`;
const MOOD_MEALS_URL = `${BASE_URL}/mood-meals`;
const MOOD_STATS_URL = `${BASE_URL}/mood-stats`;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Auth endpoints
export const registerUser = async (userData) => {
  try {
    const response = await api.post(`${AUTH_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post(`${AUTH_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get(`${AUTH_URL}/me`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Dashboard endpoints
export const getDashboardMetrics = async () => {
  try {
    const response = await api.get(`${DASHBOARD_URL}/metrics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Recipe endpoints
export const getAllRecipes = async () => {
  try {
    const response = await api.get(RECIPES_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getRecipeCount = async () => {
  try {
    const response = await api.get(`${RECIPES_URL}/count`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addRecipe = async (recipeData) => {
  try {
    const response = await api.post(RECIPES_URL, recipeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteRecipe = async (recipeId) => {
  try {
    const response = await api.delete(`${RECIPES_URL}/${recipeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete recipe' };
  }
};

export const updateRecipe = async (recipeId, recipeData) => {
  try {
    const response = await api.put(`${RECIPES_URL}/${recipeId}`, recipeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update recipe' };
  }
};

// User count endpoint
export const getUserCount = async () => {
  try {
    const response = await api.get(`${BASE_URL}/users/count`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Activity log endpoints
export const getRecentActivity = async () => {
  try {
    const response = await api.get(`${ACTIVITY_URL}/recent`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createActivityLog = async (activityData) => {
  try {
    const response = await api.post(ACTIVITY_URL, activityData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Suggestion endpoints
export const getAllSuggestions = async () => {
  try {
    const response = await api.get(SUGGESTIONS_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getDailySuggestion = async () => {
  try {
    const response = await api.get(`${SUGGESTIONS_URL}/daily`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createSuggestion = async (suggestionData) => {
  try {
    const response = await api.post(SUGGESTIONS_URL, suggestionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mood Meal endpoints
export const getAllMoodMeals = async () => {
  try {
    const response = await api.get(MOOD_MEALS_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMoodMealsByMood = async (mood) => {
  try {
    const response = await api.get(`${MOOD_MEALS_URL}/mood/${mood}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createMoodMeal = async (moodMealData) => {
  try {
    const response = await api.post(MOOD_MEALS_URL, moodMealData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mood Meal Stats endpoints
export const trackMoodSelection = async (moodData) => {
  try {
    const response = await api.post(`${MOOD_STATS_URL}/track`, moodData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateMoodMealInteraction = async (interactionData) => {
  try {
    const response = await api.put(`${MOOD_STATS_URL}/interaction`, interactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserMoodStats = async () => {
  try {
    const response = await api.get(`${MOOD_STATS_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserSavedMeals = async () => {
  try {
    const response = await api.get(`${MOOD_STATS_URL}/saved`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMoodAnalytics = async () => {
  try {
    const response = await api.get(`${MOOD_STATS_URL}/analytics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
  