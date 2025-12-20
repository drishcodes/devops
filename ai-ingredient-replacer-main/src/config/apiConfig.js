// API Configuration for AI services
// This file centralizes API settings to make it easy to switch between providers

export const API_CONFIG = {
  // Gemini API Configuration
  GEMINI: {
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    API_KEY: 'AIzaSyBqFpJHY9AVcMg05ECQiAk-jzM5qArEepM', // Replace with your actual Gemini API key
    MODEL: 'gemini-2.0-flash',
    HEADERS: {
      'Content-Type': 'application/json',
      'X-goog-api-key': 'AIzaSyBqFpJHY9AVcMg05ECQiAk-jzM5qArEepM'
    }
  },
  
  // OpenRouter API Configuration (for reference)
  OPENROUTER: {
    BASE_URL: 'https://openrouter.ai/api/v1/chat/completions',
    API_KEY: 'YOUR_OPENROUTER_API_KEY_HERE',
    MODEL: 'deepseek/deepseek-chat-v3-0324:free',
    HEADERS: {
      'Content-Type': 'application/json',
    }
  }
};

// Current provider - change this to switch between providers
export const CURRENT_PROVIDER = 'GEMINI';

// Helper function to get current provider config
export const getCurrentProviderConfig = () => {
  const config = API_CONFIG[CURRENT_PROVIDER];
  
  // For Gemini, ensure the API key is in both places for convenience
  if (CURRENT_PROVIDER === 'GEMINI') {
    config.HEADERS['X-goog-api-key'] = config.API_KEY;
  }
  
  return config;
};

// Helper function to format messages for different providers
export const formatMessagesForProvider = (messages, provider = CURRENT_PROVIDER) => {
  if (provider === 'GEMINI') {
    // Convert OpenRouter format to Gemini format
    return {
      contents: messages.map(msg => ({
        parts: [{
          text: msg.content
        }]
      }))
    };
  } else if (provider === 'OPENROUTER') {
    // OpenRouter format
    return {
      messages: messages
    };
  }
  return messages;
};

// Helper function to create Gemini request body
export const createGeminiRequest = (prompt, systemPrompt = null) => {
  // Combine system prompt and user prompt into a single message
  const fullPrompt = systemPrompt 
    ? `${systemPrompt}\n\nUser: ${prompt}`
    : prompt;
  
  return {
    contents: [{
      parts: [{ text: fullPrompt }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };
};

// Helper function to extract response content from different providers
export const extractResponseContent = (response, provider = CURRENT_PROVIDER) => {
  if (provider === 'GEMINI') {
    return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else if (provider === 'OPENROUTER') {
    return response.choices?.[0]?.message?.content || '';
  }
  return '';
};
