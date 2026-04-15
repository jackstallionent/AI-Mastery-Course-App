import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const CONSTRAINT_LIBRARY = [
  'Do NOT use jargon or buzzwords',
  'Do NOT exceed 300 words',
  'Do NOT use bullet points — use prose',
  'Do NOT fabricate statistics',
  'Do NOT use passive voice',
  'Do NOT start sentences with "It is"',
  'Do NOT use the word "synergy"',
  'Do NOT add information not in the source',
  'Do NOT use exclamation marks',
  'Do NOT mention competitors by name',
  'Do NOT use first person',
  'Do NOT include disclaimers',
  'Do NOT repeat the question in the answer',
  'Do NOT use filler phrases like "It\'s worth noting"',
  'Do NOT use more than 2 adjectives per sentence',
  'Do NOT use emojis',
  'Do NOT start paragraphs with the same word',
  'Do NOT use rhetorical questions',
  'Do NOT include a conclusion section',
  'Do NOT use the phrase "best practices"',
];

export default function NegativeConstraints({ updateScore, markComplete }) {
  const [prompt, setPrompt] = useState('');
  const [activeConstraints, setActiveConstraints] = useState([]);
  const baseScore = 25;
  const scorePerConstraint = 12;
  const score = Math.min(100, baseScore + activeConstraints.length * scorePerConstraint);

  const addConstraint = (constraint) => {
    if (!activeConstraints.includes(constraint)) {
      setActiveConstraints(prev => [...prev, constraint]);
    }
  };

  const removeConstraint = (constraint) => {
    setActiveConstraints(prev => prev.filter(c => c !== constraint));
  };

  const handleComplete = () => {
    if (updateScore) updateScore('negative-constraints', score);
    if (activeConstraints.length >= 5 && markComplete) markComplete('negative-constraints');
  };

  return (
    <div className="space-y-6" data-testid="negative-constraints-exercise">
      <SectionHeader eyebrow="TIER 1 — PROMPT MASTERY" title="Negative Constraint Workshop" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Write a prompt, then add negative constraints to improve quality. Watch the score climb with each constraint.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="mono-label block mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>YOUR PROMPT</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Write your base prompt here..." className="jse-textarea" rows={4} data-testid="prompt-input" />
          </div>
          <div>
            <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>ACTIVE CONSTRAINTS ({activeConstraints.length})</div>
            {activeConstraints.length === 0 && <p className="text-xs" style={{ color: 'var(--jse-muted)' }}>Click constraints from the library below to add them</p>}
            <div className="space-y-1">
              {activeConstraints.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--jse-bg)', border: '1px solid var(--jse-gold-dark)' }}>
                  <span className="text-xs" style={{ color: 'var(--jse-gold)' }}>{c}</span>
                  <button onClick={() => removeConstraint(c)} className="text-xs px-2 py-0.5 rounded hover:bg-white/5" style={{ color: 'var(--jse-muted)' }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="exercise-card text-center">
            <div className="mono-label mb-2" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>QUALITY SCORE</div>
            <div className="jse-score score-bump" style={{ color: score >= 80 ? 'var(--jse-gold)' : 'var(--jse-teal)' }} data-testid="challenge-score">{score}/100</div>
            <div className="jse-progress mt-3"><div className="jse-progress-fill" style={{ width: `${score}%`, background: score >= 80 ? 'var(--jse-gold)' : 'var(--jse-teal)' }} /></div>
            {score >= 80 && <button onClick={handleComplete} className="jse-btn-gold mt-3 text-xs">Mark Complete</button>}
          </div>
          <div>
            <div className="mono-label mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>CONSTRAINT LIBRARY</div>
            <div className="flex flex-wrap gap-2">
              {CONSTRAINT_LIBRARY.filter(c => !activeConstraints.includes(c)).map((c, i) => (
                <button key={i} onClick={() => addConstraint(c)} className="px-3 py-1.5 rounded-lg text-xs transition-colors duration-150 hover:bg-white/5 cursor-pointer" style={{ background: 'var(--jse-card)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--jse-text)', fontFamily: 'var(--font-body)' }} data-testid="dnd-draggable-item">{c}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
