// API Configuration for AI services
// This file centralizes API settings to make it easy to switch between providers

export const API_CONFIG = {
  // Mock API Configuration (For testing when real APIs fail)
  MOCK: {
    BASE_URL: 'mock://api',
    API_KEY: 'mock',
    MODEL: 'mock',
    HEADERS: {
      'Content-Type': 'application/json'
    }
  },
  
  // OpenRouter API Configuration (for reference)
  OPENROUTER: {
    BASE_URL: 'https://openrouter.ai/api/v1/chat/completions',
    API_KEY: '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',
    MODEL: '',
    HEADERS: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    }
  }
};

// Current provider - change this to switch between providers
export const CURRENT_PROVIDER = 'MOCK';

// Helper function to get current provider config
export const getCurrentProviderConfig = () => {
  const config = API_CONFIG[CURRENT_PROVIDER];
  
  // For Gemini, ensure the API key is in both places for convenience
  if (CURRENT_PROVIDER === 'GEMINI') {
    config.HEADERS['X-goog-api-key'] = config.API_KEY;
  } else if (CURRENT_PROVIDER === 'OPENROUTER') {
    config.HEADERS['Authorization'] = `Bearer ${config.API_KEY}`;
  }
  // Mock API doesn't need special headers
  
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
  } else if (provider === 'MOCK') {
    return response; // Mock returns direct text
  }
  return '';
};
