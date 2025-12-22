const express = require('express');
const router = express.Router();
const { createMoodMeal, getAllMoodMeals, getMoodMealsByMood } = require('../controllers/moodMealController');
const auth = require('../middleware/auth');

// Create a new mood meal (requires authentication)
router.post('/', auth, createMoodMeal);

// Get all mood meals
router.get('/', getAllMoodMeals);

// Get mood meals by mood
router.get('/mood/:mood', getMoodMealsByMood);

module.exports = router;