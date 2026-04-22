// Local food database - works completely offline

export const SUBSTITUTIONS = {
  dairy: {
    milk: [
      { sub: 'Almond milk', ratio: '1:1', tip: 'Best for baking and cereals 🌰' },
      { sub: 'Oat milk', ratio: '1:1', tip: 'Creamy texture, great for coffee 🌾' },
      { sub: 'Coconut milk', ratio: '1:1', tip: 'Great for curries and soups 🥥' },
      { sub: 'Soy milk', ratio: '1:1', tip: 'High protein, good for smoothies 🫘' },
    ],
    butter: [
      { sub: 'Coconut oil', ratio: '1:1', tip: 'Great for baking and sautéing 🥥' },
      { sub: 'Olive oil', ratio: '3/4:1', tip: 'Heart-healthy, use less 🫒' },
      { sub: 'Applesauce', ratio: '1:1', tip: 'Reduces fat in baking 🍎' },
      { sub: 'Vegan butter', ratio: '1:1', tip: 'Closest match for taste 🧈' },
    ],
    cheese: [
      { sub: 'Nutritional yeast', ratio: '2 tbsp:1/4 cup', tip: 'Adds cheesy flavor to sauces ✨' },
      { sub: 'Cashew cream', ratio: '1:1', tip: 'Blend soaked cashews for creamy texture 🥜' },
      { sub: 'Tofu (firm)', ratio: '1:1', tip: 'Press and crumble for salads 🧱' },
    ],
    cream: [
      { sub: 'Coconut cream', ratio: '1:1', tip: 'Full-fat coconut milk, chill first 🥥' },
      { sub: 'Cashew cream', ratio: '1:1', tip: 'Blend soaked cashews with water 🥜' },
      { sub: 'Silken tofu', ratio: '1:1', tip: 'Blend until smooth, add lemon for tang 🧱' },
    ],
    yogurt: [
      { sub: 'Coconut yogurt', ratio: '1:1', tip: 'Creamy and dairy-free 🥥' },
      { sub: 'Almond yogurt', ratio: '1:1', tip: 'Light and tangy 🌰' },
      { sub: 'Silken tofu', ratio: '1:1', tip: 'Blend with lemon juice 🧱' },
    ],
  },
  gluten: {
    flour: [
      { sub: 'Almond flour', ratio: '1:1', tip: 'Great for cakes and cookies, add extra egg 🥜' },
      { sub: 'Rice flour', ratio: '1:1', tip: 'Light texture, good for coating 🍚' },
      { sub: 'Oat flour', ratio: '1:1', tip: 'Hearty, great for pancakes 🌾' },
      { sub: 'Coconut flour', ratio: '1/3:1', tip: 'Very absorbent, use much less 🥥' },
      { sub: 'Cassava flour', ratio: '1:1', tip: 'Most similar to wheat flour 🌿' },
    ],
    pasta: [
      { sub: 'Rice pasta', ratio: '1:1', tip: 'Naturally gluten-free 🍚' },
      { sub: 'Zucchini noodles', ratio: '1:1', tip: 'Use spiralizer, low-carb 🥒' },
      { sub: 'Chickpea pasta', ratio: '1:1', tip: 'High protein, holds shape well 🫘' },
      { sub: 'Lentil pasta', ratio: '1:1', tip: 'Protein-rich, earthy flavor 🟤' },
    ],
    bread: [
      { sub: 'Gluten-free bread', ratio: '1:1', tip: 'Toast for best texture 🍞' },
      { sub: 'Lettuce wraps', ratio: '2:1', tip: 'Fresh, low-carb option 🥬' },
      { sub: 'Corn tortillas', ratio: '1:1', tip: 'Naturally gluten-free 🌽' },
    ],
    'soy sauce': [
      { sub: 'Tamari', ratio: '1:1', tip: 'Gluten-free soy sauce alternative 🍶' },
      { sub: 'Coconut aminos', ratio: '1:1', tip: 'Soy-free, slightly sweeter 🥥' },
    ],
  },
  egg: {
    egg: [
      { sub: 'Flax egg (1 tbsp ground flax + 3 tbsp water)', ratio: '1:1', tip: 'Best for binding in baking 🌱' },
      { sub: 'Chia egg (1 tbsp chia + 3 tbsp water)', ratio: '1:1', tip: 'Similar to flax, works well 🌱' },
      { sub: 'Applesauce (1/4 cup)', ratio: '1/4 cup:1 egg', tip: 'Adds moisture, great for cakes 🍎' },
      { sub: 'Mashed banana (1/2 banana)', ratio: '1/2:1 egg', tip: 'Sweet, good for pancakes 🍌' },
      { sub: 'Silken tofu (1/4 cup blended)', ratio: '1/4 cup:1 egg', tip: 'Neutral taste, good for savory 🧱' },
    ],
  },
  sugar: {
    sugar: [
      { sub: 'Maple syrup', ratio: '3/4:1', tip: 'Reduce other liquids slightly 🍁' },
      { sub: 'Honey', ratio: '1/2:1', tip: 'Sweeter than sugar, browns faster 🍯' },
      { sub: 'Coconut sugar', ratio: '1:1', tip: 'Low glycemic, caramel flavor 🥥' },
      { sub: 'Stevia', ratio: '1 tsp:1 cup sugar', tip: 'Much sweeter, use sparingly 🌿' },
      { sub: 'Date paste', ratio: '1:1', tip: 'Natural sweetness, adds moisture 🌴' },
    ],
  },
  nut: {
    'peanut butter': [
      { sub: 'Sunflower seed butter', ratio: '1:1', tip: 'Nut-free, similar texture 🌻' },
      { sub: 'Tahini', ratio: '1:1', tip: 'Sesame-based, good for savory 🫘' },
      { sub: 'Soy butter', ratio: '1:1', tip: 'Soy-based alternative 🫘' },
    ],
    almonds: [
      { sub: 'Sunflower seeds', ratio: '1:1', tip: 'Nut-free crunch 🌻' },
      { sub: 'Pumpkin seeds', ratio: '1:1', tip: 'Nut-free, high zinc 🎃' },
      { sub: 'Coconut flakes', ratio: '1:1', tip: 'Different texture but tasty 🥥' },
    ],
  },
};

export const RECIPES = {
  'vegetable stir fry': {
    name: '🥘 Vegetable Stir Fry',
    time: '15 min',
    difficulty: 'Easy',
    tags: ['vegan', 'gluten-free', 'quick'],
    ingredients: ['2 cups mixed vegetables (bell peppers, broccoli, carrots)', '2 tbsp soy sauce (or tamari)', '1 tbsp sesame oil', '2 cloves garlic, minced', '1 tsp ginger, grated', '2 cups cooked rice', 'Green onions', 'Sesame seeds'],
    steps: ['Heat sesame oil in a wok over high heat', 'Add garlic and ginger, stir 30 seconds', 'Add vegetables, stir-fry 3-4 minutes', 'Add soy sauce, toss well', 'Serve over rice with green onions and sesame seeds'],
  },
  'banana pancakes': {
    name: '🥞 Banana Pancakes',
    time: '20 min',
    difficulty: 'Easy',
    tags: ['vegetarian', 'gluten-free option'],
    ingredients: ['2 ripe bananas', '2 eggs (or flax eggs)', '1/2 cup flour (or oat flour)', '1 tsp baking powder', 'Pinch of salt', 'Butter or oil for cooking', 'Maple syrup & berries for serving'],
    steps: ['Mash bananas in a bowl', 'Add eggs, flour, baking powder, and salt', 'Mix until smooth', 'Heat butter in a pan over medium heat', 'Pour 1/4 cup batter per pancake', 'Cook 2-3 min per side until golden', 'Serve with maple syrup and berries'],
  },
  'greek salad': {
    name: '🥗 Greek Salad',
    time: '10 min',
    difficulty: 'Easy',
    tags: ['vegetarian', 'gluten-free', 'quick'],
    ingredients: ['2 cups romaine lettuce', '1 cup cherry tomatoes, halved', '1/2 cucumber, sliced', '1/4 red onion, sliced', '1/2 cup kalamata olives', '1/4 cup feta cheese', '2 tbsp olive oil', '1 tbsp lemon juice', 'Oregano, salt, pepper'],
    steps: ['Chop all vegetables', 'Combine in a large bowl', 'Add olives and feta', 'Drizzle with olive oil and lemon juice', 'Season with oregano, salt, and pepper', 'Toss gently and serve'],
  },
  'chicken curry': {
    name: '🍛 Chicken Curry',
    time: '35 min',
    difficulty: 'Medium',
    tags: ['gluten-free', 'dairy-free option'],
    ingredients: ['1 lb chicken breast, cubed', '1 can coconut milk', '2 tbsp curry paste', '1 onion, diced', '2 cloves garlic', '1 tbsp ginger', '1 cup vegetables (peas, carrots)', 'Rice for serving', 'Fresh cilantro'],
    steps: ['Sauté onion, garlic, and ginger', 'Add curry paste, cook 1 minute', 'Add chicken, cook until browned', 'Pour in coconut milk, stir well', 'Add vegetables, simmer 15 minutes', 'Serve over rice with cilantro'],
  },
  'overnight oats': {
    name: '🥣 Overnight Oats',
    time: '5 min + overnight',
    difficulty: 'Easy',
    tags: ['vegan option', 'vegetarian', 'quick'],
    ingredients: ['1/2 cup rolled oats', '1/2 cup milk (any kind)', '1/2 cup yogurt (or dairy-free)', '1 tbsp chia seeds', '1 tbsp honey or maple syrup', 'Fresh fruits', 'Nuts or granola for topping'],
    steps: ['Combine oats, milk, yogurt, and chia seeds in a jar', 'Add honey or maple syrup', 'Stir well, cover, and refrigerate overnight', 'In the morning, top with fresh fruits and nuts', 'Enjoy cold or heat if preferred'],
  },
  'avocado toast': {
    name: '🥑 Avocado Toast',
    time: '5 min',
    difficulty: 'Easy',
    tags: ['vegan option', 'vegetarian', 'quick'],
    ingredients: ['2 slices bread (or gluten-free)', '1 ripe avocado', 'Lemon juice', 'Salt and pepper', 'Red pepper flakes', 'Optional: egg, tomato, microgreens'],
    steps: ['Toast bread until golden', 'Mash avocado with lemon juice, salt, and pepper', 'Spread avocado on toast', 'Top with red pepper flakes', 'Add optional toppings as desired', 'Serve immediately'],
  },
  'protein smoothie': {
    name: '💪 Protein Smoothie',
    time: '5 min',
    difficulty: 'Easy',
    tags: ['vegan option', 'gluten-free', 'quick'],
    ingredients: ['1 scoop protein powder', '1 banana', '1/2 cup frozen berries', '1 cup milk (any kind)', '1 tbsp nut butter', 'Ice cubes'],
    steps: ['Add all ingredients to blender', 'Blend until smooth', 'Add more liquid if too thick', 'Pour into glass and enjoy'],
  },
  'pasta primavera': {
    name: '🍝 Pasta Primavera',
    time: '25 min',
    difficulty: 'Easy',
    tags: ['vegetarian'],
    ingredients: ['8 oz pasta (or gluten-free)', '2 cups mixed vegetables', '2 cloves garlic', '2 tbsp olive oil', '1/2 cup parmesan (or nutritional yeast)', 'Salt, pepper, Italian herbs', 'Lemon juice'],
    steps: ['Cook pasta according to package', 'Sauté garlic in olive oil', 'Add vegetables, cook 5 minutes', 'Toss with cooked pasta', 'Add cheese, herbs, and lemon juice', 'Season and serve hot'],
  },
};

export const CHATBOT_RESPONSES = {
  greetings: [
    "👋 Hello! I'm your FoodFit AI assistant. Ask me about recipes, ingredients, or dietary advice!",
    "🍽 Welcome back! What would you like to cook today?",
    "🥗 Hi there! I can help with recipes, substitutions, and meal planning. What do you need?",
  ],
  recipe: [
    "🍳 Great choice! I'd recommend checking out our recipe collection for detailed instructions. Try searching in the Recipes section!",
    "📖 For the best recipes, visit our Recipes page. We have options for every dietary need!",
    "🥘 I can suggest recipes based on your preferences. What ingredients do you have on hand?",
  ],
  substitute: [
    "🔄 Check out our Smart Ingredient Replacer for detailed substitutions! It covers dairy-free, gluten-free, egg-free, and more.",
    "🌱 For ingredient substitutions, use the Replacer tool. It has a comprehensive database of alternatives!",
    "💡 I can help with substitutions! What ingredient do you need to replace and what's your dietary restriction?",
  ],
  vegan: [
    "🌱 Going vegan? Great choice! Replace dairy with plant-based milks, eggs with flax eggs, and honey with maple syrup.",
    "🥥 Vegan cooking tips: Use coconut cream instead of dairy cream, nutritional yeast instead of cheese, and tofu for protein!",
    "🫘 For vegan protein, try lentils, chickpeas, tofu, and tempeh. They're versatile and delicious!",
  ],
  'gluten-free': [
    "🌾 For gluten-free cooking, use rice flour, almond flour, or oat flour instead of wheat flour.",
    "🍚 Gluten-free pasta options include rice pasta, chickpea pasta, and zucchini noodles!",
    "🥥 Coconut flour is great for gluten-free baking, but use 1/3 the amount of regular flour as it's very absorbent.",
  ],
  healthy: [
    "💪 For healthier meals, focus on whole grains, lean proteins, and lots of vegetables!",
    "🥗 Try adding more vegetables to every meal. They're low in calories and high in nutrients!",
    "🫒 Use olive oil instead of butter, and herbs and spices instead of salt for healthier cooking.",
  ],
  default: [
    "🤔 I'm not sure about that specific topic, but I can help with recipes, ingredient substitutions, and dietary advice!",
    "🍽 I specialize in food and cooking! Ask me about recipes, dietary restrictions, or ingredient alternatives.",
    "💡 Try asking about a specific recipe, ingredient substitution, or dietary need. I'm here to help with all things food!",
  ],
};

export const getChatResponse = (message) => {
  const lower = message.toLowerCase();
  
  if (lower.match(/hi|hello|hey|greetings/)) {
    const arr = CHATBOT_RESPONSES.greetings;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.match(/recipe|cook|make|dish|meal/)) {
    const arr = CHATBOT_RESPONSES.recipe;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.match(/substitut|replace|alternative|instead/)) {
    const arr = CHATBOT_RESPONSES.substitute;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.match(/vegan|plant.based/)) {
    const arr = CHATBOT_RESPONSES.vegan;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.match(/gluten|celiac|wheat/)) {
    const arr = CHATBOT_RESPONSES['gluten-free'];
    return arr[Math.floor(Math.random() * arr.length)];
  }
  if (lower.match(/healthy|nutrition|diet|calorie|weight/)) {
    const arr = CHATBOT_RESPONSES.healthy;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  const arr = CHATBOT_RESPONSES.default;
  return arr[Math.floor(Math.random() * arr.length)];
};

export const searchRecipes = (query) => {
  const lower = query.toLowerCase().trim();
  if (!lower) return Object.values(RECIPES);
  
  return Object.entries(RECIPES).filter(([key, recipe]) => {
    return key.includes(lower) ||
      recipe.name.toLowerCase().includes(lower) ||
      recipe.tags.some(t => t.includes(lower)) ||
      recipe.ingredients.some(i => i.toLowerCase().includes(lower));
  }).map(([key, recipe]) => ({ ...recipe, id: key }));
};

export const findSubstitutions = (ingredient, restriction) => {
  const ing = ingredient.toLowerCase().trim();
  const rest = restriction.toLowerCase().trim();
  
  if (!ing || !rest) return [];
  
  const category = SUBSTITUTIONS[rest];
  if (!category) return [];
  
  for (const [key, subs] of Object.entries(category)) {
    if (key.includes(ing) || ing.includes(key)) {
      return subs;
    }
  }
  return [];
};
