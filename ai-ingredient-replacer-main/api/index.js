const express = require("express");
const connectDB = require("../backend/config/db");
const authRoutes = require("../backend/routes/authRoutes");
const cors = require("cors");
const recipeRoutes = require('../backend/routes/recipeRoutes');
const User = require('../backend/models/User');
const dashboardRoutes = require('../backend/routes/dashboardRoutes');
const activityLogRoutes = require('../backend/routes/activityLogRoutes');
const suggestionRoutes = require('../backend/routes/suggestionRoutes');
const moodMealRoutes = require('../backend/routes/moodMealRoutes');
const moodMealStatsRoutes = require('../backend/routes/moodMealStatsRoutes');
const { createDefaultSuggestion } = require('../backend/controllers/suggestionController');
const { createDefaultMoodMeals } = require('../backend/controllers/moodMealController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activity', activityLogRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/mood-meals', moodMealRoutes);
app.use('/api/mood-stats', moodMealStatsRoutes);
app.use('/api/community', require('../backend/routes/communityRoutes'));

// User count endpoint
app.get('/api/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect to MongoDB
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  
  try {
    await connectDB();
    isConnected = true;
    console.log('Database connected successfully');
    
    // Create default data if none exists
    await createDefaultSuggestion();
    await createDefaultMoodMeals();
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// Export as Vercel serverless function
module.exports = (req, res) => {
  // Connect to database before handling request
  connectToDatabase().then(() => {
    app(req, res);
  }).catch(err => {
    console.error('Database connection error:', err);
    res.status(500).json({ message: 'Server error' });
  });
};

// Also export the app for local testing
module.exports.app = app;
