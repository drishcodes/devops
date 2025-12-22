const MoodMeal = require('../models/MoodMeal');
const Recipe = require('../models/Recipe');
const { logActivity } = require('./activityLogController');

// Create a new mood meal
exports.createMoodMeal = async (req, res) => {
  try {
    const { mood, title, description, recipeIds } = req.body;
    
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }
    
    // Verify all recipe IDs exist
    if (recipeIds && recipeIds.length > 0) {
      const recipes = await Recipe.find({ _id: { $in: recipeIds } });
      if (recipes.length !== recipeIds.length) {
        return res.status(400).json({ message: 'One or more recipe IDs are invalid' });
      }
    }
    
    const newMoodMeal = new MoodMeal({
      mood,
      title: title || `${mood} Meal`,
      description: description || `A meal suggestion for when you're feeling ${mood.toLowerCase()}`,
      recipes: recipeIds || [],
    });
    
    await newMoodMeal.save();
    
    // Log this activity
    if (req.user) {
      await logActivity(req.user.id, 'Mood Meal Created', `Created a new ${mood} meal suggestion`);
    }
    
    res.status(201).json({
      success: true,
      moodMeal: newMoodMeal
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all mood meals
exports.getAllMoodMeals = async (req, res) => {
  try {
    const moodMeals = await MoodMeal.find()
      .sort({ createdAt: -1 })
      .populate('recipes');
    
    res.json(moodMeals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get mood meals by mood
exports.getMoodMealsByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    
    const moodMeals = await MoodMeal.find({ mood: { $regex: new RegExp(mood, 'i') } })
      .sort({ createdAt: -1 })
      .populate('recipes');
    
    res.json(moodMeals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create default mood meals if none exist (for seeding purposes)
exports.createDefaultMoodMeals = async () => {
  try {
    const moodsToSeed = [
      {
        mood: 'Happy',
        title: 'Celebration Meal',
        description: 'A bright and colorful meal to celebrate your good mood!',
        recipes: [
            { title: 'Rainbow Quinoa Salad', description: 'Colorful salad with fresh veggies', ingredients: ['Quinoa', 'Bell Peppers', 'Lemon'], steps: ['Cook quinoa', 'Chop veggies', 'Mix everything'] },
            { title: 'Grilled Salmon with Mango Salsa', description: 'Fresh and vibrant flavors', ingredients: ['Salmon', 'Mango', 'Cilantro'], steps: ['Grill salmon', 'Make salsa', 'Serve together'] },
            { title: 'Chicken Tikka Masala', description: 'Rich, creamy and celebratory', ingredients: ['Chicken', 'Yogurt', 'Spices', 'Tomato Sauce'], steps: ['Marinate chicken', 'Cook sauce', 'Simmer chicken in sauce'] },
            { title: 'Fruit Tart', description: 'Sweet celebration dessert', ingredients: ['Pastry Crust', 'Custard', 'Fresh Berries'], steps: ['Bake crust', 'Fill with custard', 'Decorate with fruit'] }
        ]
      },
      {
        mood: 'Tired', // Maps to 'Low Energy' in frontend
        title: 'Energy Boost',
        description: 'Quick and nutritious recipes to help you regain energy.',
        recipes: [
            { title: 'Superfood Smoothie Bowl', description: 'Packed with antioxidants', ingredients: ['Acai', 'Banana', 'Granola'], steps: ['Blend fruits', 'Pour in bowl', 'Add toppings'] },
            { title: 'Chicken & Avocado Wrap', description: 'High protein and healthy fats', ingredients: ['Chicken', 'Avocado', 'Whole Wheat Wrap'], steps: ['Slice chicken', 'Mash avocado', 'Wrap it up'] },
            { title: 'Espresso Energy Balls', description: 'Quick caffeine kick', ingredients: ['Oats', 'Espresso Powder', 'Dates', 'Almonds'], steps: ['Blend ingredients', 'Roll into balls', 'Chill'] },
            { title: 'Lentil Soup', description: 'Iron-rich energy booster', ingredients: ['Lentils', 'Carrots', 'Spinach', 'Broth'], steps: ['Sauté veggies', 'Add lentils and broth', 'Simmer'] }
        ]
      },
      {
        mood: 'Stressed',
        title: 'Comfort Food',
        description: 'Soothing recipes to help you relax and unwind.',
        recipes: [
            { title: 'Creamy Mushroom Risotto', description: 'Warm and comforting', ingredients: ['Arborio Rice', 'Mushrooms', 'Parmesan'], steps: ['Sauté mushrooms', 'Cook rice slowly', 'Stir in cheese'] },
            { title: 'Chamomile Honey Tea & Oatmeal Cookies', description: 'Relaxing treat', ingredients: ['Oats', 'Honey', 'Chamomile Tea'], steps: ['Bake cookies', 'Brew tea', 'Enjoy'] },
            { title: 'Macaroni and Cheese', description: 'Ultimate comfort classic', ingredients: ['Macaroni', 'Cheddar Cheese', 'Milk', 'Butter'], steps: ['Cook pasta', 'Make cheese sauce', 'Combine and bake'] },
            { title: 'Tomato Basil Soup & Grilled Cheese', description: 'Warm hug in a bowl', ingredients: ['Tomatoes', 'Basil', 'Bread', 'Cheese'], steps: ['Simmer soup', 'Grill sandwich', 'Dip and enjoy'] }
        ]
      },
      {
        mood: 'Workout',
        title: 'Post-Workout Recovery',
        description: 'High protein meals to aid muscle recovery.',
        recipes: [
             { title: 'Protein-Packed Turkey Chili', description: 'Great for muscle recovery', ingredients: ['Turkey', 'Beans', 'Tomatoes'], steps: ['Brown turkey', 'Add veggies', 'Simmer'] },
             { title: 'Grilled Chicken & Sweet Potato', description: 'Lean protein and complex carbs', ingredients: ['Chicken Breast', 'Sweet Potato', 'Broccoli'], steps: ['Roast veggies', 'Grill chicken', 'Serve hot'] },
             { title: 'Tuna Salad on Crackers', description: 'Quick protein snack', ingredients: ['Canned Tuna', 'Greek Yogurt', 'Whole Grain Crackers'], steps: ['Mix tuna and yogurt', 'Season', 'Serve on crackers'] },
             { title: 'Protein Pancakes', description: 'Breakfast for gains', ingredients: ['Oats', 'Protein Powder', 'Banana', 'Eggs'], steps: ['Blend batter', 'Cook on griddle', 'Top with syrup'] }
        ]
      },
      {
        mood: 'Sad',
        title: 'Mood Lifting Meal',
        description: 'Foods rich in omega-3s and magnesium to help lift spirits.',
        recipes: [
             { title: 'Dark Chocolate & Berry Oatmeal', description: 'Mood boosting antioxidants', ingredients: ['Oats', 'Dark Chocolate', 'Berries'], steps: ['Cook oats', 'Stir in chocolate', 'Top with berries'] },
             { title: 'Spinach & Walnut Salad', description: 'Rich in magnesium', ingredients: ['Spinach', 'Walnuts', 'Feta'], steps: ['Wash spinach', 'Toast walnuts', 'Toss with dressing'] },
             { title: 'Baked Salmon with Asparagus', description: 'High in Omega-3 for brain health', ingredients: ['Salmon Fillet', 'Asparagus', 'Lemon', 'Dill'], steps: ['Season salmon and veggies', 'Bake until tender', 'Serve'] },
             { title: 'Banana Nut Bread', description: 'Comforting and contains tryptophan', ingredients: ['Bananas', 'Walnuts', 'Flour', 'Sugar'], steps: ['Mash bananas', 'Mix batter', 'Bake loaf'] }
        ]
      }
    ];

    for (const data of moodsToSeed) {
        let moodMeal = await MoodMeal.findOne({ mood: data.mood });
        
        // If it doesn't exist, or has fewer than 4 recipes (our new target), update it
        if (!moodMeal || moodMeal.recipes.length < 4) {
            console.log(`Seeding/Updating recipes for: ${data.mood}`);
            
            // To avoid duplicates, we could check if titles exist, but for simplicity in this seed script,
            // we will just create the new ones. Ideally we check title existence.
            // Let's check for each recipe title before inserting.
            const recipeIds = [];
            for (const r of data.recipes) {
                let textRecipe = await Recipe.findOne({ title: r.title });
                if (!textRecipe) {
                     textRecipe = await Recipe.create(r);
                }
                recipeIds.push(textRecipe._id);
            }

            if (moodMeal) {
                // Update existing
                moodMeal.recipes = recipeIds;
                moodMeal.title = data.title;
                moodMeal.description = data.description;
                await moodMeal.save();
                console.log(`✅ Updated mood meal for: ${data.mood} with ${recipeIds.length} recipes`);
            } else {
                // Create new
                await MoodMeal.create({
                    mood: data.mood,
                    title: data.title,
                    description: data.description,
                    recipes: recipeIds
                });
                console.log(`✅ Created mood meal for: ${data.mood}`);
            }
        }
    }
    console.log('Mood meal seeding check complete');

  } catch (err) {
    console.error('Error creating default mood meals:', err);
  }
};