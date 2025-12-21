import React, { useState } from 'react';
import '../styles/Chatbot.css'; // Reuse existing chatbot styles
import { getCurrentProviderConfig, extractResponseContent, createGeminiRequest } from '../config/apiConfig';

/**
 * FoodChatAssistant
 * A responsive AI-powered chatbot for dietary and recipe-related queries.
 * Integrates with Gemini API to stream responses.
 */
const FoodChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hi! I’m your AI food assistant. Ask me anything about diet-friendly recipes!'
    }
  ]);

  const [userInput, setUserInput] = useState('');

  const handleUserMessage = async () => {
    if (!userInput.trim()) return;

    const updatedMessages = [
      ...messages,
      { sender: 'user', text: userInput },
      { sender: 'bot', text: 'Thinking... 🤔' }
    ];
    setMessages(updatedMessages);
    setUserInput('');

    try {
      const config = getCurrentProviderConfig();
      
      // Create a simple prompt with system instruction and user input
      const systemPrompt = "You are an expert AI assistant for ingredient replacement and dietary advice. Only answer questions related to food, recipes, ingredient substitutions, allergies, and healthy cooking. If asked about anything else, politely redirect the user to food-related topics. Answer like a human in simple words, use emojis wherever possible.";
      
      const userPrompt = userInput;

      const response = await fetch(config.BASE_URL, {
        method: 'POST',
        headers: config.HEADERS,
        body: JSON.stringify(createGeminiRequest(userPrompt, systemPrompt))
      });

      if (response.status === 429) {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { sender: 'bot', text: '⚠️ API call limit exceeded. Try again later.' }
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const reply = extractResponseContent(data);

      if (reply) {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: 'bot', text: reply };
          return updated;
        });
      } else {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { sender: 'bot', text: '❌ Sorry, I could not generate a response. Please try again.' }
        ]);
      }

    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: '❌ Sorry, something went wrong. Please try again.' }
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <h2>🍽️ Ask Your Recipe Assistant</h2>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask a food-related question..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()}
        />
        <button onClick={handleUserMessage}>Send</button>
      </div>
    </div>
  );
};

export default FoodChatAssistant;
