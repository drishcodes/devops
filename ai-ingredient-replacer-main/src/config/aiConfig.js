// AI API Configuration
// Using DeepSeek API (free tier available)
// Get your API key from: https://platform.deepseek.com/api_keys

const AI_CONFIG = {
  // DeepSeek API Configuration
  DEEPSEEK: {
    BASE_URL: 'https://api.deepseek.com/v1/chat/completions',
    API_KEY: 'sk-f9338ebda4a34e32863f2f3e2018a483',
    MODEL: 'deepseek-chat',
    HEADERS: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer sk-f9338ebda4a34e32863f2f3e2018a483`,
    },
  },

  // Fallback to OpenRouter (supports many models)
  OPENROUTER: {
    BASE_URL: 'https://openrouter.ai/api/v1/chat/completions',
    API_KEY: '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',
    MODEL: 'deepseek/deepseek-chat',
    HEADERS: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer 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`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'FoodFit AI',
    },
  },

  // Current provider
  CURRENT_PROVIDER: 'OPENROUTER',
};

// Get current provider config
export const getCurrentAIConfig = () => {
  return AI_CONFIG[AI_CONFIG.CURRENT_PROVIDER];
};

// Format messages for API
export const formatMessagesForAI = (messages) => {
  return messages.map(msg => ({
    role: msg.role || 'user',
    content: msg.content,
  }));
};

// Extract response content
export const extractAIResponse = (data) => {
  if (!data) return null;
  
  // Handle different API response formats
  if (data.choices && data.choices[0]) {
    return data.choices[0].message?.content || data.choices[0].text;
  }
  
  if (data.message) {
    return data.message.content;
  }
  
  if (data.content) {
    return data.content;
  }
  
  return null;
};

// System prompts for different contexts
export const SYSTEM_PROMPTS = {
  CHATBOT: `You are a friendly and knowledgeable AI food assistant for FoodFit AI. Your role is to help users with:
- Recipe suggestions and cooking tips
- Ingredient substitutions for dietary restrictions (vegan, gluten-free, dairy-free, etc.)
- Nutritional information about foods
- Meal planning advice
- General food and cooking questions

Guidelines:
- Be conversational and friendly
- Use emojis to make responses engaging
- Provide practical, actionable advice
- If a question is not food-related, politely redirect to food topics
- Keep responses concise but informative
- Use simple, easy-to-understand language`,

  RECIPES: `You are an expert recipe generator. Given a dish name or ingredients, provide a complete, easy-to-follow recipe including:
- Title of the dish
- Prep time and cook time
- Difficulty level
- List of ingredients with measurements
- Step-by-step instructions
- Tips for success

Format the response clearly with headings and bullet points. Use emojis to make it engaging.`,

  REPLACER: `You are an expert ingredient substitution specialist. Given a recipe and dietary restrictions, suggest appropriate substitutions. For each substitution, explain:
- What ingredient to replace it with
- The ratio for replacement
- Any tips for best results
- Why this substitution works

Format the response clearly with the modified recipe followed by a list of substitutions made.`,
};

export default AI_CONFIG;
