const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const recipeRoutes = require('./routes/recipeRoutes');
const User = require('./models/User');
const dashboardRoutes = require('./routes/dashboardRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');
const moodMealRoutes = require('./routes/moodMealRoutes');
const moodMealStatsRoutes = require('./routes/moodMealStatsRoutes');
const { createDefaultSuggestion } = require('./controllers/suggestionController');
const { createDefaultMoodMeals } = require('./controllers/moodMealController');

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

// User count endpoint
app.get('/api/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DB & Server
connectDB().then(() => {
  // Create default data if none exists
  createDefaultSuggestion();
  createDefaultMoodMeals();
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
