import React, { useState, useEffect, useRef } from 'react';

const PRESET_TIMERS = [
  { label: 'Soft Boiled Egg', time: 360, emoji: '🥚' },
  { label: 'Hard Boiled Egg', time: 540, emoji: '🥚' },
  { label: 'Pasta Al Dente', time: 480, emoji: '🍝' },
  { label: 'Rice', time: 1200, emoji: '🍚' },
  { label: 'Stir Fry', time: 300, emoji: '🥘' },
  { label: 'Bread Bake', time: 2100, emoji: '🍞' },
  { label: 'Cookies', time: 660, emoji: '🍪' },
  { label: 'Steak Medium', time: 480, emoji: '🥩' },
  { label: 'Soup Simmer', time: 1800, emoji: '🍲' },
  { label: 'Tea Steep', time: 300, emoji: '🍵' },
];

const CookingTimer = () => {
  const [timers, setTimers] = useState([]);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const nextId = useRef(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => prev.map(t => {
        if (t.running && t.remaining > 0) {
          return { ...t, remaining: t.remaining - 1 };
        }
        if (t.remaining === 0 && t.running) {
          return { ...t, running: false, finished: true };
        }
        return t;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Play sound when timer finishes
  useEffect(() => {
    timers.forEach(t => {
      if (t.finished && !t.notified) {
        // Try to play a beep sound
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          gain.gain.value = 0.3;
          osc.start();
          setTimeout(() => { osc.stop(); ctx.close(); }, 500);
        } catch (e) { /* audio not available */ }

        // Browser notification
        if (Notification.permission === 'granted') {
          new Notification('🍳 Timer Done!', { body: `${t.label} is ready!` });
        }

        setTimers(prev => prev.map(timer =>
          timer.id === t.id ? { ...timer, notified: true } : timer
        ));
      }
    });
  }, [timers]);

  const addTimer = (label, seconds) => {
    const newTimer = {
      id: nextId.current++,
      label,
      total: seconds,
      remaining: seconds,
      running: false,
      finished: false,
      notified: false,
    };
    setTimers(prev => [...prev, newTimer]);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const toggleTimer = (id) => {
    setTimers(prev => prev.map(t =>
      t.id === id ? { ...t, running: !t.running } : t
    ));
  };

  const resetTimer = (id) => {
    setTimers(prev => prev.map(t =>
      t.id === id ? { ...t, remaining: t.total, running: false, finished: false, notified: false } : t
    ));
  };

  const removeTimer = (id) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const addCustomTimer = () => {
    const mins = parseInt(customMinutes) || 0;
    const secs = parseInt(customSeconds) || 0;
    const total = mins * 60 + secs;
    if (total <= 0) return;
    addTimer(customLabel || `${mins}m ${secs}s timer`, total);
    setCustomMinutes('');
    setCustomSeconds('');
    setCustomLabel('');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getProgress = (timer) => {
    if (timer.total === 0) return 0;
    return ((timer.total - timer.remaining) / timer.total) * 100;
  };

  const getTimerColor = (timer) => {
    if (timer.finished) return '#28a745';
    if (timer.remaining <= 10 && timer.running) return '#dc3545';
    if (timer.remaining <= 30 && timer.running) return '#ffc107';
    return '#00c896';
  };

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>⏱️ Cooking Timers</h2>

      {/* Preset Timers */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '25px'
      }}>
        {PRESET_TIMERS.map(preset => (
          <button
            key={preset.label}
            onClick={() => addTimer(preset.label, preset.time)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: '1px solid #e9ecef',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#00c896';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = '#00c896';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.borderColor = '#e9ecef';
            }}
          >
            {preset.emoji} {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Timer */}
      <div style={{
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '12px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Custom Timer</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, minWidth: '120px' }}>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Label</label>
            <input
              type="text"
              value={customLabel}
              onChange={e => setCustomLabel(e.target.value)}
              placeholder="My timer..."
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '60px' }}>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Min</label>
            <input
              type="number"
              value={customMinutes}
              onChange={e => setCustomMinutes(e.target.value)}
              placeholder="0"
              min="0"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '60px' }}>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' }}>Sec</label>
            <input
              type="number"
              value={customSeconds}
              onChange={e => setCustomSeconds(e.target.value)}
              placeholder="0"
              min="0"
              max="59"
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
            />
          </div>
          <button
            onClick={addCustomTimer}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: 'none',
              background: '#00c896',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              height: '37px'
            }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Active Timers */}
      {timers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#aaa',
          fontSize: '16px'
        }}>
          ⏱️ No active timers. Add one above!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {timers.map(timer => (
            <div
              key={timer.id}
              style={{
                padding: '20px',
                background: timer.finished ? '#d4edda' : '#fff',
                borderRadius: '12px',
                border: `2px solid ${getTimerColor(timer)}30`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Progress bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '4px',
                width: `${getProgress(timer)}%`,
                background: getTimerColor(timer),
                transition: 'width 1s linear'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {timer.finished ? '✅' : timer.running ? '⏳' : '⏸️'} {timer.label}
                  </div>
                  <div style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    color: getTimerColor(timer),
                    letterSpacing: '2px'
                  }}>
                    {formatTime(timer.remaining)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!timer.finished && (
                    <button
                      onClick={() => toggleTimer(timer.id)}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        border: 'none',
                        background: timer.running ? '#ffc107' : '#00c896',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {timer.running ? '⏸' : '▶'}
                    </button>
                  )}
                  <button
                    onClick={() => resetTimer(timer.id)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      border: '1px solid #ddd',
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    🔄
                  </button>
                  <button
                    onClick={() => removeTimer(timer.id)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      border: '1px solid #dc3545',
                      background: '#fff',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CookingTimer;
