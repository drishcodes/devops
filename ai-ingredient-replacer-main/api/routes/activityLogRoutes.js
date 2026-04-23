const express = require('express');
const router = express.Router();
const { createActivityLog, getRecentActivity } = require('../controllers/activityLogController');
const auth = require('../middleware/auth');

// Create a new activity log (requires authentication)
router.post('/', auth, createActivityLog);

// Get recent activity logs
router.get('/recent', getRecentActivity);

module.exports = router;