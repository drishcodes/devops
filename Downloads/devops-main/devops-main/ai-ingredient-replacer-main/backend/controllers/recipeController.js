const Recipe = require('../models/Recipe');
const { logActivity } = require('./activityLogController');

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecipeCount = async (req, res) => {
  try {
    const count = await Recipe.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps } = req.body;
    const recipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      createdBy: req.user.id
    });
    await recipe.save();
    
    // Log this activity
    await logActivity(req.user.id, 'Recipe Created', `Created a new recipe: ${title}`);
    
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if the user is the owner of the recipe
    if (recipe.createdBy && recipe.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this recipe' });
    }
    
    await Recipe.findByIdAndDelete(req.params.id);
    
    // Log this activity
    await logActivity(req.user.id, 'Recipe Deleted', `Deleted recipe: ${recipe.title}`);
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps } = req.body;
    
    // Find the recipe
    let recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check if the user is the owner of the recipe
    if (recipe.createdBy && recipe.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this recipe' });
    }
    
    const oldTitle = recipe.title;
    
    // Update the recipe
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.steps = steps || recipe.steps;
    
    await recipe.save();
    
    // Log this activity
    await logActivity(req.user.id, 'Recipe Updated', `Updated recipe: ${oldTitle}`);
    
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};