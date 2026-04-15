import React, { useState, useCallback } from 'react';
import SectionHeader from '../components/SectionHeader';

const CLAIMS = [
  { id: 1, text: 'AI understands what it is saying', answer: false, explanation: 'AI predicts the next word based on patterns. It has no understanding, consciousness, or awareness of meaning.' },
  { id: 2, text: 'AI will replace all jobs', answer: false, explanation: 'AI automates tasks, not entire roles. It transforms jobs rather than eliminating them entirely.' },
  { id: 3, text: 'AI can create images it has never seen', answer: true, explanation: 'Generative AI can combine learned patterns to produce entirely novel images it was never trained on.' },
  { id: 4, text: 'AI is always accurate', answer: false, explanation: 'AI hallucinations are a fundamental feature of prediction-based systems. AI can be confidently wrong.' },
  { id: 5, text: 'AI is only for tech companies', answer: false, explanation: '72% of small businesses now use AI tools. AI is industry-agnostic and accessible to all.' },
  { id: 6, text: 'AI learns from examples, not experience', answer: true, explanation: 'AI recognizes patterns from training data but lacks curiosity, feeling, or lived experience.' },
  { id: 7, text: 'More constraints make AI output worse', answer: false, explanation: 'Constraint Satisfaction is the most powerful concept: more constraints = dramatically better output.' },
  { id: 8, text: 'AI can generate human-like text', answer: true, explanation: 'Modern LLMs can produce text that is often indistinguishable from human writing.' },
];

export default function TrainYourIntuition({ updateScore, markComplete }) {
  const [items, setItems] = useState(() => [...CLAIMS].sort(() => Math.random() - 0.5));
  const [trueZone, setTrueZone] = useState([]);
  const [falseZone, setFalseZone] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [activeZone, setActiveZone] = useState(null);

  const score = revealed ? (
    trueZone.filter(c => c.answer === true).length + falseZone.filter(c => c.answer === false).length
  ) : 0;

  const handleDragStart = (id) => setDragId(id);
  
  const handleDrop = useCallback((zone) => {
    if (!dragId) return;
    const claim = items.find(c => c.id === dragId) || trueZone.find(c => c.id === dragId) || falseZone.find(c => c.id === dragId);
    if (!claim) return;
    setItems(prev => prev.filter(c => c.id !== dragId));
    setTrueZone(prev => prev.filter(c => c.id !== dragId));
    setFalseZone(prev => prev.filter(c => c.id !== dragId));
    if (zone === 'true') setTrueZone(prev => [...prev, claim]);
    else setFalseZone(prev => [...prev, claim]);
    setDragId(null);
    setActiveZone(null);
  }, [dragId, items, trueZone, falseZone]);

  const handleReveal = () => {
    setRevealed(true);
    const finalScore = trueZone.filter(c => c.answer === true).length + falseZone.filter(c => c.answer === false).length;
    if (updateScore) updateScore('train-intuition', finalScore);
    if (finalScore === CLAIMS.length && markComplete) markComplete('train-intuition');
  };

  const handleReset = () => {
    setItems([...CLAIMS].sort(() => Math.random() - 0.5));
    setTrueZone([]);
    setFalseZone([]);
    setRevealed(false);
    setDragId(null);
  };

  const handleClickSort = (claim, zone) => {
    setItems(prev => prev.filter(c => c.id !== claim.id));
    setTrueZone(prev => prev.filter(c => c.id !== claim.id));
    setFalseZone(prev => prev.filter(c => c.id !== claim.id));
    if (zone === 'true') setTrueZone(prev => [...prev, claim]);
    else setFalseZone(prev => [...prev, claim]);
  };

  const allSorted = items.length === 0 && (trueZone.length + falseZone.length) === CLAIMS.length;

  return (
    <div className="space-y-6" data-testid="train-intuition-exercise">
      <SectionHeader eyebrow="TIER 0 — FREE PREVIEW" title="Train Your Intuition" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>
        Sort each AI claim as TRUE or FALSE. Drag the cards or click the buttons to categorize them.
      </p>

      {revealed && (
        <div className="exercise-card text-center" style={{ border: '1px solid var(--jse-gold-dark)' }}>
          <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>YOUR SCORE</div>
          <div className="jse-score score-bump" style={{ color: score === CLAIMS.length ? 'var(--jse-gold)' : 'var(--jse-teal)' }} data-testid="challenge-score">
            {score}/{CLAIMS.length}
          </div>
          {score === CLAIMS.length && (
            <div className="mono-label mt-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>
              ✨ PERFECT SCORE ✨
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Unsorted claims */}
        <div>
          <div className="mono-label mb-3" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>UNSORTED CLAIMS ({items.length})</div>
          <div className="space-y-2">
            {items.map(claim => (
              <div
                key={claim.id}
                draggable
                onDragStart={() => handleDragStart(claim.id)}
                className="exercise-card draggable-item"
                data-testid="dnd-draggable-item"
              >
                <p className="text-sm mb-2" style={{ color: 'var(--jse-text)' }}>{claim.text}</p>
                {!revealed && (
                  <div className="flex gap-2">
                    <button onClick={() => handleClickSort(claim, 'true')} className="jse-btn-teal text-xs px-3 py-1">TRUE</button>
                    <button onClick={() => handleClickSort(claim, 'false')} className="jse-btn-secondary text-xs px-3 py-1">FALSE</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TRUE Zone */}
        <div>
          <div className="mono-label mb-3" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>TRUE ({trueZone.length})</div>
          <div
            className={`drop-zone min-h-[200px] space-y-2 ${activeZone === 'true' ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setActiveZone('true'); }}
            onDragLeave={() => setActiveZone(null)}
            onDrop={() => handleDrop('true')}
            data-testid="dnd-dropzone"
          >
            {trueZone.length === 0 && <p className="text-xs text-center py-4" style={{ color: 'var(--jse-muted)' }}>Drop TRUE claims here</p>}
            {trueZone.map(claim => (
              <div key={claim.id} className="exercise-card" style={revealed ? { borderColor: claim.answer === true ? 'var(--jse-teal)' : 'rgba(220,50,50,0.5)' } : {}}>
                <p className="text-sm" style={{ color: 'var(--jse-text)' }}>{claim.text}</p>
                {revealed && (
                  <div className="mt-2 text-xs" style={{ color: claim.answer === true ? 'var(--jse-teal)' : '#dc3232' }}>
                    {claim.answer === true ? '✓ Correct!' : '✗ This is actually FALSE'}
                    <div className="mt-1" style={{ color: 'var(--jse-muted)' }}>{claim.explanation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FALSE Zone */}
        <div>
          <div className="mono-label mb-3" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>FALSE ({falseZone.length})</div>
          <div
            className={`drop-zone min-h-[200px] space-y-2 ${activeZone === 'false' ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setActiveZone('false'); }}
            onDragLeave={() => setActiveZone(null)}
            onDrop={() => handleDrop('false')}
            data-testid="dnd-dropzone"
          >
            {falseZone.length === 0 && <p className="text-xs text-center py-4" style={{ color: 'var(--jse-muted)' }}>Drop FALSE claims here</p>}
            {falseZone.map(claim => (
              <div key={claim.id} className="exercise-card" style={revealed ? { borderColor: claim.answer === false ? 'var(--jse-teal)' : 'rgba(220,50,50,0.5)' } : {}}>
                <p className="text-sm" style={{ color: 'var(--jse-text)' }}>{claim.text}</p>
                {revealed && (
                  <div className="mt-2 text-xs" style={{ color: claim.answer === false ? 'var(--jse-teal)' : '#dc3232' }}>
                    {claim.answer === false ? '✓ Correct!' : '✗ This is actually TRUE'}
                    <div className="mt-1" style={{ color: 'var(--jse-muted)' }}>{claim.explanation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {allSorted && !revealed && <button onClick={handleReveal} className="jse-btn-gold" data-testid="primary-action-button">Reveal Answers</button>}
        {revealed && <button onClick={handleReset} className="jse-btn-teal" data-testid="primary-action-button">Try Again</button>}
      </div>
    </div>
  );
}
