# Gemini API Setup Guide

## Overview
This project has been updated to use Google's Gemini API instead of OpenRouter. All prompts, instructions, and functionality remain the same - only the underlying AI provider has changed.

## Setup Instructions

### 1. Get a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Update the Configuration
1. Open `src/config/apiConfig.js`
2. Replace the API key in two places:

```javascript
GEMINI: {
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  API_KEY: 'your-actual-gemini-api-key-here', // Replace this
  MODEL: 'gemini-2.0-flash',
  HEADERS: {
    'Content-Type': 'application/json',
    'X-goog-api-key': 'your-actual-gemini-api-key-here' // Replace this too
  }
}
```

**Note:** The API key is automatically copied to the header by the configuration helper, so you only need to update the `API_KEY` field.

**Note:** The API key is automatically copied to the header by the configuration helper, so you only need to update the `API_KEY` field.

### 3. Test the Application
1. Start the development server: `npm start`
2. Test the following features:
   - Chatbot (ask food-related questions)
   - Recipe search (search for any dish)
   - Ingredient replacer (enter a recipe and select dietary preferences)

## What Changed
- **Chatbot.js**: Now uses Gemini API for chat completions
- **Recipes.js**: Now uses Gemini API for recipe generation  
- **Replacer.js**: Now uses Gemini API for ingredient replacement
- **apiConfig.js**: New centralized configuration file

## Switching Back to OpenRouter
If you want to switch back to OpenRouter:
1. Update `CURRENT_PROVIDER` in `src/config/apiConfig.js` to `'OPENROUTER'`
2. Replace `YOUR_OPENROUTER_API_KEY_HERE` with your OpenRouter API key

## Features Unchanged
- All prompts and instructions remain exactly the same
- All UI components and styling unchanged
- All functionality preserved
- All dietary preference options maintained
- All error handling and user experience preserved

## Notes
- Gemini API responses may be slightly different in tone/style compared to the previous model
- The API structure is different but the functionality is identical
- No changes needed to any other parts of the application
