import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceSearch = ({ isLoggedIn, onLoginPrompt }) => {
  const [listening, setListening] = useState(false);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  const navigate = useNavigate();

  recognition.lang = 'en-US';
  recognition.interimResults = false;

  const handleVoiceSearch = () => {
    if (!isLoggedIn) {
      if (onLoginPrompt) onLoginPrompt();
      return;
    }
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      localStorage.setItem('voiceSearch', transcript);
      navigate('/recipes');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  };

  return (
    <>
      {listening && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem 2.5rem',
            borderRadius: '18px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            textAlign: 'center',
            minWidth: '220px',
            fontSize: '1.2em',
            color: '#00c896',
            fontWeight: 600
          }}>
            <span role="img" aria-label="microphone" style={{fontSize: '2.2em', display: 'block', marginBottom: '0.5em'}}>🎤</span>
            Listening...<br/>
            <span style={{fontSize: '0.9em', color: '#555'}}>Please speak your recipe or dish name</span>
          </div>
        </div>
      )}
      <button
        onClick={handleVoiceSearch}
        style={{
          ...styles.button,
          opacity: isLoggedIn ? 1 : 0.6,
          cursor: isLoggedIn ? 'pointer' : 'not-allowed',
        }}
        disabled={!isLoggedIn}
        title={isLoggedIn ? 'Voice Search' : 'Login to use voice commands'}
      >
         {listening ? 'Listening...' : 'Voice Search'}
      </button>
    </>
  );
};

const styles = {
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#00c896',
    color: '#fff',
    fontWeight: 'bold',
  }
};

export default VoiceSearch;
