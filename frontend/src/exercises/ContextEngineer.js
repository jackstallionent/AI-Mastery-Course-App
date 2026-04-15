import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '../components/SectionHeader';

const SCENARIOS = [
  { id: 1, name: 'Customer Support Bot', layers: { identity: 'Friendly support agent for SaaS company', behavioral: 'Always empathize first, then solve', knowledge: 'Product features, pricing tiers, known bugs', task: 'Handle subscription cancellation request', output: '3-step response: acknowledge, offer solution, confirm action' } },
  { id: 2, name: 'Legal Document Reviewer', layers: { identity: 'Cautious paralegal with contract expertise', behavioral: 'Flag risks, never give legal advice', knowledge: 'Standard contract clauses, red flag patterns', task: 'Review NDA for problematic clauses', output: 'Clause-by-clause risk assessment table' } },
  { id: 3, name: 'Content Strategist', layers: { identity: 'Creative director for B2B tech brand', behavioral: 'On-brand voice, data-driven decisions', knowledge: 'Brand guidelines, target persona, competitors', task: 'Create Q4 content calendar', output: '12-week calendar with themes, formats, channels' } },
];

export default function ContextEngineer({ updateScore, markComplete }) {
  const [scenario, setScenario] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) { endGame(); return; }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameState]);

  const startGame = () => {
    const s = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    setScenario(s);
    setAnswers({});
    setTimeLeft(60);
    setGameState('playing');
    setScore(null);
  };

  const endGame = useCallback(() => {
    setGameState('done');
    const layers = ['identity', 'behavioral', 'knowledge', 'task', 'output'];
    let pts = 0;
    layers.forEach(l => { if ((answers[l] || '').trim().length > 10) pts += 20; });
    setScore(pts);
    if (updateScore) updateScore('context-engineer', pts);
    if (pts === 100 && markComplete) markComplete('context-engineer');
  }, [answers, updateScore, markComplete]);

  const layers = ['identity', 'behavioral', 'knowledge', 'task', 'output'];
  const layerLabels = { identity: 'Identity', behavioral: 'Behavioral', knowledge: 'Knowledge', task: 'Task', output: 'Output' };

  return (
    <div className="space-y-6" data-testid="context-engineer-exercise">
      <SectionHeader eyebrow="TIER 3 — DIRECTOR'S BUNDLE" title="The Context Engineer" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>60-second timed challenge: set up a complete 5-layer context system for a given scenario. Scored on completeness.</p>
      {gameState === 'ready' && <button onClick={startGame} className="jse-btn-gold" data-testid="challenge-start-button">Start Challenge</button>}
      {gameState === 'playing' && scenario && (
        <>
          <div className="flex items-center justify-between">
            <div className="mono-label" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>SCENARIO: {scenario.name.toUpperCase()}</div>
            <div className="timer-display" style={{ color: timeLeft < 10 ? 'var(--jse-gold)' : 'var(--jse-teal)', fontSize: '1.5rem' }} data-testid="challenge-timer">{timeLeft}s</div>
          </div>
          <div className="jse-progress"><div className="jse-progress-fill" style={{ width: `${(timeLeft / 60) * 100}%`, background: timeLeft < 10 ? 'var(--jse-gold)' : 'var(--jse-teal)' }} /></div>
          <div className="space-y-3">
            {layers.map(l => (
              <div key={l}>
                <label className="mono-label block mb-1" style={{ color: 'var(--jse-teal)', fontSize: '0.55rem' }}>{layerLabels[l].toUpperCase()}</label>
                <input type="text" value={answers[l] || ''} onChange={e => setAnswers(prev => ({...prev, [l]: e.target.value}))} placeholder={`Define the ${layerLabels[l]} layer...`} className="jse-input" />
              </div>
            ))}
          </div>
          <button onClick={endGame} className="jse-btn-teal" data-testid="primary-action-button">Submit Early</button>
        </>
      )}
      {gameState === 'done' && (
        <div className="space-y-4">
          <div className="exercise-card text-center" style={{ border: '1px solid var(--jse-gold-dark)' }}>
            <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>YOUR SCORE</div>
            <div className="jse-score score-bump" style={{ color: score === 100 ? 'var(--jse-gold)' : 'var(--jse-teal)' }} data-testid="challenge-score">{score}/100</div>
            {score === 100 && <div className="mono-label mt-1" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>✨ PERFECT CONTEXT SYSTEM ✨</div>}
          </div>
          {scenario && (
            <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}>
              <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>IDEAL ANSWER</div>
              {layers.map(l => <div key={l} className="mb-2"><span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.5rem' }}>{layerLabels[l].toUpperCase()}:</span><p className="text-xs" style={{ color: 'var(--jse-text)' }}>{scenario.layers[l]}</p></div>)}
            </div>
          )}
          <button onClick={startGame} className="jse-btn-teal" data-testid="challenge-start-button">Try Again</button>
        </div>
      )}
    </div>
  );
}
