const express = require('express');
const router = express.Router();
const { 
  trackMoodSelection, 
  updateMoodMealInteraction, 
  getUserMoodStats, 
  getUserSavedMeals,
  getMoodAnalytics 
} = require('../controllers/moodMealStatsController');
const auth = require('../middleware/auth');

// Track mood selection (requires authentication)
router.post('/track', auth, trackMoodSelection);

// Update meal interaction - like/save (requires authentication)
router.put('/interaction', auth, updateMoodMealInteraction);

// Get user's mood stats (requires authentication)
router.get('/stats', auth, getUserMoodStats);

// Get user's saved meals (requires authentication)
router.get('/saved', auth, getUserSavedMeals);

// Get mood analytics for dashboard (requires authentication)
router.get('/analytics', auth, getMoodAnalytics);

module.exports = router;