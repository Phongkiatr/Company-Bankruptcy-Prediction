import React, { useState } from 'react';

function App() {
  const [numbers, setNumbers] = useState(Array(14).fill(''));
  const [result, setResult] = useState(null);
  const [resultColor, setResultColor] = useState('#6200ea');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleChange = (e, index) => {
    const newNumbers = [...numbers];
    newNumbers[index] = e.target.value;
    setNumbers(newNumbers);
  };

  const predict = async () => {
    if (numbers.some(num => num === '')) {
      setResult('กรุณากรอกให้ครบ');
      setResultColor('#a78bfa');
      return;
    }

    if (numbers.some(num => isNaN(num) || num === '' || num.trim() === '')) {
      setResult('กรุณากรอกข้อมูลที่เป็นตัวเลขเท่านั้น');
      setResultColor('#a78bfa');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers: numbers.map(num => parseFloat(num)) })
      });

      const data = await response.json();
      const prediction = data.prediction;

      if (prediction === 'Alive') {
        setResult(`Prediction: ${prediction}`);
        setResultColor('#34d399');
      } else if (prediction === 'Bankrupt') {
        setResult(`Prediction: ${prediction}`);
        setResultColor('#f87171');
      } else {
        setResult(`Prediction: ${prediction}`);
        setResultColor('#a78bfa');
      }
    } catch (err) {
      setResult('Connection error');
      setResultColor('#f87171');
    } finally {
      setIsLoading(false);
    }
  };

  const inputLabels = [
    'Year of establishment (AD)',
    "Current assets ($)",
    "EBITDA ($)",
    "Total Receivables ($)",
    "Market value ($)",
    "Net sales ($)",
    "Total assets ($)",
    "Total Long-term debt ($)",
    "EBIT ($)",
    "Gross Profit ($)",
    "Total Current Liabilities ($)",
    "Retained Earnings ($)",
    "Total Revenue ($)",
    "Total Liabilities ($)"
  ];

  const filledCount = numbers.filter(n => n !== '').length;
  const progress = (filledCount / 14) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080c14;
          min-height: 100vh;
        }

        .app-root {
          min-height: 100vh;
          background: #080c14;
          background-image:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,60,180,0.18) 0%, transparent 70%),
            linear-gradient(180deg, #080c14 0%, #0d1220 100%);
          font-family: 'IBM Plex Mono', monospace;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 24px 64px;
        }

        .top-bar {
          width: 100%;
          max-width: 960px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 48px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon svg {
          width: 18px;
          height: 18px;
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        .status-badge {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #34d399;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .hero {
          width: 100%;
          max-width: 960px;
          margin-bottom: 40px;
        }

        .hero-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7c3aed;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }

        .hero-title span {
          background: linear-gradient(90deg, #a78bfa, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          line-height: 1.7;
          max-width: 480px;
        }

        .progress-bar-wrap {
          width: 100%;
          max-width: 960px;
          margin-bottom: 32px;
        }

        .progress-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .progress-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .progress-count {
          font-size: 11px;
          color: #a78bfa;
          font-weight: 500;
        }

        .progress-track {
          width: 100%;
          height: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #818cf8);
          border-radius: 2px;
          transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
        }

        .grid {
          width: 100%;
          max-width: 960px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 32px;
        }

        @media (max-width: 640px) {
          .grid { grid-template-columns: 1fr; }
        }

        .field {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 14px 16px;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }

        .field::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(124,58,237,0.06), transparent);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }

        .field.focused {
          border-color: rgba(124,58,237,0.5);
          background: rgba(124,58,237,0.05);
        }

        .field.focused::before {
          opacity: 1;
        }

        .field.filled {
          border-color: rgba(255,255,255,0.1);
        }

        .field-index {
          font-size: 9px;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.2);
          font-weight: 500;
          margin-bottom: 4px;
        }

        .field-label {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 8px;
          line-height: 1.4;
          font-family: 'Syne', sans-serif;
          font-weight: 400;
        }

        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          font-weight: 500;
          color: #e2e8f0;
          caret-color: #a78bfa;
        }

        .field-input::placeholder {
          color: rgba(255,255,255,0.12);
          font-size: 12px;
          font-weight: 300;
        }

        .field-input::-webkit-inner-spin-button,
        .field-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }

        .actions {
          width: 100%;
          max-width: 960px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-predict {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border: none;
          border-radius: 10px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 0 0 rgba(124,58,237,0);
        }

        .btn-predict:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(124,58,237,0.4);
        }

        .btn-predict:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-predict:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-predict .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .btn-reset {
          padding: 14px 20px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          letter-spacing: 0.06em;
          transition: border-color 0.2s, color 0.2s;
        }

        .btn-reset:hover {
          border-color: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.6);
        }

        .result-card {
          margin-top: 28px;
          width: 100%;
          max-width: 960px;
          animation: fadeUp 0.4s cubic-bezier(0.4,0,0.2,1);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-inner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          border-radius: 12px;
          border: 1px solid;
        }

        .result-inner.alive {
          background: rgba(52,211,153,0.06);
          border-color: rgba(52,211,153,0.2);
        }

        .result-inner.bankrupt {
          background: rgba(248,113,113,0.06);
          border-color: rgba(248,113,113,0.2);
        }

        .result-inner.neutral {
          background: rgba(167,139,250,0.06);
          border-color: rgba(167,139,250,0.2);
        }

        .result-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          animation: pulse 1.8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        .result-dot.alive { background: #34d399; box-shadow: 0 0 10px rgba(52,211,153,0.6); }
        .result-dot.bankrupt { background: #f87171; box-shadow: 0 0 10px rgba(248,113,113,0.6); }
        .result-dot.neutral { background: #a78bfa; box-shadow: 0 0 10px rgba(167,139,250,0.6); }

        .result-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 3px;
          font-family: 'IBM Plex Mono', monospace;
        }

        .result-value {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .result-value.alive { color: #34d399; }
        .result-value.bankrupt { color: #f87171; }
        .result-value.neutral { color: #a78bfa; }
      `}</style>

      <div className="app-root">

        {/* Top Bar */}
        <div className="top-bar">
          <div className="logo-area">
            <div className="logo-icon">
              <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 14L7 9L10 12L14 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="14" cy="6" r="1.5" fill="white"/>
              </svg>
            </div>
            <span className="logo-text">FinRisk Analytics</span>
          </div>
          <div className="status-badge">● Model Active</div>
        </div>

        {/* Hero */}
        <div className="hero">
          <div className="hero-label">// Predictive Financial Analysis</div>
          <h1 className="hero-title">Bankruptcy<br /><span>Prediction</span></h1>
          <p className="hero-sub">
            Enter 14 financial indicators below to run the ML model and assess corporate insolvency risk.
          </p>
        </div>

        {/* Progress */}
        <div className="progress-bar-wrap">
          <div className="progress-meta">
            <span className="progress-label">Input Completion</span>
            <span className="progress-count">{filledCount} / 14 fields</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Grid of inputs */}
        <div className="grid">
          {numbers.map((num, index) => (
            <div
              key={index}
              className={`field ${focusedIndex === index ? 'focused' : ''} ${num !== '' ? 'filled' : ''}`}
            >
              <div className="field-index">FIELD {String(index + 1).padStart(2, '0')}</div>
              <div className="field-label">{inputLabels[index]}</div>
              <input
                className="field-input"
                type="number"
                value={num}
                onChange={(e) => handleChange(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                placeholder="—"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="btn-predict" onClick={predict} disabled={isLoading}>
            {isLoading ? <span className="spinner" /> : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 7L7 13M1 7H13" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {isLoading ? 'Analyzing...' : 'Run Prediction'}
          </button>
          <button
            className="btn-reset"
            onClick={() => { setNumbers(Array(14).fill('')); setResult(null); }}
          >
            ↺ Clear fields
          </button>
        </div>

        {/* Result */}
        {result && (() => {
          const isAlive = result.includes('Alive');
          const isBankrupt = result.includes('Bankrupt');
          const cls = isAlive ? 'alive' : isBankrupt ? 'bankrupt' : 'neutral';
          const label = isAlive ? 'Company Status' : isBankrupt ? 'Company Status' : 'System Message';
          return (
            <div className="result-card">
              <div className={`result-inner ${cls}`}>
                <div className={`result-dot ${cls}`} />
                <div>
                  <div className="result-label">{label}</div>
                  <div className={`result-value ${cls}`}>{result}</div>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </>
  );
}

export default App;