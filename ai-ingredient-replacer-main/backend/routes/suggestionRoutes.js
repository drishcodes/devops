const express = require('express');
const router = express.Router();
const { createSuggestion, getAllSuggestions, getSuggestionOfTheDay } = require('../controllers/suggestionController');
const auth = require('../middleware/auth');

// Create a new suggestion (requires authentication)
router.post('/', auth, createSuggestion);

// Get all suggestions
router.get('/', getAllSuggestions);

// Get suggestion of the day
router.get('/daily', getSuggestionOfTheDay);

module.exports = router;