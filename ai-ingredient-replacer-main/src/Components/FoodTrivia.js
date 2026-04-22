import React, { useState, useEffect } from 'react';
import { TRIVIA_QUESTIONS } from '../data/triviaData';

const FoodTrivia = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    // Shuffle questions on mount
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled.slice(0, 10)); // 10 questions per game
  }, []);

  const handleAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === shuffledQuestions[currentQuestion].answer;
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) setBestStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= shuffledQuestions.length) {
      setGameOver(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowFunFact(false);
    }
  };

  const restartGame = () => {
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled.slice(0, 10));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowFunFact(false);
    setGameOver(false);
    setStreak(0);
  };

  if (shuffledQuestions.length === 0) return null;

  const question = shuffledQuestions[currentQuestion];

  const getScoreEmoji = () => {
    const pct = score / shuffledQuestions.length;
    if (pct >= 0.9) return "🏆";
    if (pct >= 0.7) return "🌟";
    if (pct >= 0.5) return "👍";
    return "💪";
  };

  const getScoreMessage = () => {
    const pct = score / shuffledQuestions.length;
    if (pct >= 0.9) return "Food Genius! You know your stuff!";
    if (pct >= 0.7) return "Great job! Almost a food expert!";
    if (pct >= 0.5) return "Not bad! Keep learning about food!";
    return "Keep exploring! Food is fascinating!";
  };

  if (gameOver) {
    return (
      <div style={{
        maxWidth: '500px',
        margin: '40px auto',
        padding: '30px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '10px' }}>{getScoreEmoji()}</div>
        <h2>Game Over!</h2>
        <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>
          {score}/{shuffledQuestions.length}
        </div>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>{getScoreMessage()}</p>
        <p style={{ opacity: 0.8 }}>🔥 Best Streak: {bestStreak}</p>
        <button
          onClick={restartGame}
          style={{
            marginTop: '20px',
            padding: '12px 30px',
            fontSize: '16px',
            borderRadius: '30px',
            border: 'none',
            background: '#fff',
            color: '#764ba2',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          Play Again 🔄
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '30px auto',
      padding: '30px',
      borderRadius: '16px',
      background: '#fff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px 15px',
        background: 'linear-gradient(135deg, #00c896, #00b4d8)',
        borderRadius: '12px',
        color: '#fff'
      }}>
        <span>🧠 Food Trivia</span>
        <span>Score: {score} | 🔥 {streak}</span>
        <span>Q{currentQuestion + 1}/{shuffledQuestions.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '6px',
        background: '#e9ecef',
        borderRadius: '3px',
        marginBottom: '25px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%`,
          background: 'linear-gradient(90deg, #00c896, #00b4d8)',
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Question */}
      <h3 style={{
        fontSize: '20px',
        lineHeight: '1.5',
        marginBottom: '25px',
        color: '#333'
      }}>
        {question.question}
      </h3>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {question.options.map((option, index) => {
          let bg = '#f8f9fa';
          let border = '2px solid #e9ecef';
          let color = '#333';

          if (showResult) {
            if (index === question.answer) {
              bg = '#d4edda';
              border = '2px solid #28a745';
              color = '#155724';
            } else if (index === selectedAnswer && index !== question.answer) {
              bg = '#f8d7da';
              border = '2px solid #dc3545';
              color = '#721c24';
            }
          } else if (index === selectedAnswer) {
            bg = '#e3f2fd';
            border = '2px solid #00b4d8';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              style={{
                padding: '14px 18px',
                borderRadius: '10px',
                border,
                background: bg,
                color,
                fontSize: '16px',
                cursor: showResult ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: showResult && index === question.answer ? '#28a745' :
                  showResult && index === selectedAnswer ? '#dc3545' : '#dee2e6',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {showResult && index === question.answer ? '✓' :
                  showResult && index === selectedAnswer ? '✗' :
                    String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Fun Fact */}
      {showResult && (
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowFunFact(!showFunFact)}
            style={{
              background: 'none',
              border: 'none',
              color: '#00b4d8',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '5px 0'
            }}
          >
            {showFunFact ? '🙈 Hide Fun Fact' : '💡 Show Fun Fact'}
          </button>

          {showFunFact && (
            <div style={{
              padding: '15px',
              background: '#fff3cd',
              borderRadius: '10px',
              marginTop: '10px',
              color: '#856404',
              fontSize: '14px',
              lineHeight: '1.5',
              border: '1px solid #ffeaa7'
            }}>
              {question.funFact}
            </div>
          )}

          <button
            onClick={nextQuestion}
            style={{
              display: 'block',
              width: '100%',
              marginTop: '15px',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #00c896, #00b4d8)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {currentQuestion + 1 >= shuffledQuestions.length ? 'See Results 🏆' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodTrivia;
