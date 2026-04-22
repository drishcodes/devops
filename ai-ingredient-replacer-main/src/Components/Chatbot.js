import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chatbot.css';
import { getCurrentAIConfig, extractAIResponse, SYSTEM_PROMPTS } from '../config/aiConfig';

const FoodChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hi! I\'m your FoodFit assistant. Ask me about recipes, ingredients, dietary advice, or cooking tips!'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserMessage = async () => {
    if (!userInput.trim() || loading) return;

    const userMsg = userInput.trim();
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userMsg },
      { sender: 'bot', text: 'Thinking... 🤔' }
    ]);
    setUserInput('');
    setLoading(true);

    try {
      const config = getCurrentAIConfig();
      
      const messagesForAPI = [
        { role: 'system', content: SYSTEM_PROMPTS.CHATBOT },
        ...messages.filter(m => m.sender !== 'bot' || m.text !== 'Thinking... 🤔').map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: userMsg }
      ];

      const response = await fetch(config.BASE_URL, {
        method: 'POST',
        headers: config.HEADERS,
        body: JSON.stringify({
          model: config.MODEL,
          messages: messagesForAPI,
          temperature: 0.7,
          max_tokens: 1000,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API Error:', errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const reply = extractAIResponse(data);

      if (reply) {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { sender: 'bot', text: reply }
        ]);
      } else {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { sender: 'bot', text: 'Sorry, I couldn\'t generate a response. Please try again.' }
        ]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: 'I\'m having trouble connecting right now. Please check your internet connection and try again. 🔄' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: '👋 Hi! I\'m your FoodFit AI assistant. Ask me about recipes, ingredients, dietary advice, or cooking tips!'
      }
    ]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <span className="chatbot-emoji">🍽️</span>
          <h2>FoodFit Assistant</h2>
        </div>
        <button onClick={clearChat} className="clear-chat-btn">
          🔄 New Chat
        </button>
      </div>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <div className="message-content">
              {msg.text.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about recipes, ingredients, dietary advice..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()}
          disabled={loading}
        />
        <button 
          onClick={handleUserMessage} 
          disabled={loading || !userInput.trim()}
          className={loading ? 'loading' : ''}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default FoodChatAssistant;
