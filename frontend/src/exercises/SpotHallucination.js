import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const PARAGRAPHS = [
  {
    id: 1,
    text: 'Large language models process text by breaking it into tokens, which are roughly four characters each. The model then uses statistical probability to predict the most likely next token based on patterns learned during training.',
    hallucinations: [],
    explanation: 'This paragraph is entirely accurate. LLMs do process text as tokens and use statistical prediction.'
  },
  {
    id: 2,
    text: 'According to a 2024 Stanford study, AI systems can now achieve 99.7% accuracy in medical diagnoses, outperforming human doctors in every specialty. The FDA has approved over 200 fully autonomous AI diagnostic systems for independent clinical use.',
    hallucinations: [0, 1],
    explanation: 'Both sentences are hallucinated. While AI shows promise in diagnostics, no study shows 99.7% across all specialties, and the FDA has not approved 200 fully autonomous diagnostic systems.'
  },
  {
    id: 3,
    text: 'OpenAI was founded in 2015 as a non-profit AI research lab. The transformer architecture, which powers modern language models, was introduced in the 2017 paper "Attention Is All You Need" by researchers at Google.',
    hallucinations: [],
    explanation: 'Both facts are accurate. OpenAI was founded in December 2015, and the transformer paper was published by Google researchers in 2017.'
  },
  {
    id: 4,
    text: 'The European Union\'s AI Act, passed in 2024, requires all AI companies to open-source their training data by 2026. Companies failing to comply face automatic shutdown of their AI services and criminal prosecution of their CEOs.',
    hallucinations: [0, 1],
    explanation: 'Hallucinated. The EU AI Act does not require open-sourcing training data, nor does it mandate automatic shutdowns or criminal prosecution of CEOs. It imposes fines and compliance requirements.'
  },
  {
    id: 5,
    text: 'Prompt engineering involves crafting precise instructions to get better outputs from AI. Techniques like providing role context, specifying output format, and adding constraints can dramatically improve the quality and relevance of AI responses.',
    hallucinations: [],
    explanation: 'Entirely accurate. These are well-established prompt engineering principles that genuinely improve AI output quality.'
  },
];

export default function SpotHallucination({ updateScore, markComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const current = PARAGRAPHS[currentIdx];
  const sentences = current.text.split('. ').filter(Boolean).map((s, i) => s.endsWith('.') ? s : s + '.');

  const toggleSentence = (idx) => {
    if (revealed) return;
    setSelected(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const checkAnswer = () => {
    const correctlyIdentified = current.hallucinations.every(h => selected.includes(h));
    const noFalsePositives = selected.every(s => current.hallucinations.includes(s));
    const isCorrect = correctlyIdentified && noFalsePositives;
    setRevealed(true);
    setResults(prev => [...prev, isCorrect]);
  };

  const nextParagraph = () => {
    if (currentIdx < PARAGRAPHS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected([]);
      setRevealed(false);
    } else {
      setFinished(true);
      const totalCorrect = [...results].filter(Boolean).length;
      if (updateScore) updateScore('spot-hallucination', totalCorrect);
      if (totalCorrect === PARAGRAPHS.length && markComplete) markComplete('spot-hallucination');
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelected([]);
    setRevealed(false);
    setResults([]);
    setFinished(false);
  };

  const totalCorrect = results.filter(Boolean).length;

  return (
    <div className="space-y-6" data-testid="spot-hallucination-exercise">
      <SectionHeader eyebrow="TIER 0 — FREE PREVIEW" title="Spot the Hallucination" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>
        Read each AI-generated paragraph. Tap the sentences you think are hallucinated (factually wrong).
        Some paragraphs may have no hallucinations at all.
      </p>

      {!finished ? (
        <>
          {/* Progress */}
          <div className="flex items-center justify-between">
            <span className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>
              PARAGRAPH {currentIdx + 1} OF {PARAGRAPHS.length}
            </span>
            <span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>
              SCORE: {totalCorrect}/{results.length}
            </span>
          </div>
          <div className="jse-progress">
            <div className="jse-progress-fill" style={{ width: `${((currentIdx) / PARAGRAPHS.length) * 100}%`, background: 'var(--jse-teal)' }} />
          </div>

          {/* Paragraph Card */}
          <div className="exercise-card">
            <div className="space-y-3">
              {sentences.map((sentence, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleSentence(idx)}
                  className="w-full text-left p-3 rounded-lg transition-colors duration-150"
                  style={{
                    background: revealed
                      ? current.hallucinations.includes(idx)
                        ? 'rgba(220,50,50,0.15)'
                        : selected.includes(idx)
                          ? 'rgba(220,50,50,0.08)'
                          : 'rgba(0,180,196,0.08)'
                      : selected.includes(idx)
                        ? 'rgba(201,168,76,0.15)'
                        : 'var(--jse-bg)',
                    border: `1px solid ${revealed
                      ? current.hallucinations.includes(idx) ? 'rgba(220,50,50,0.4)' : 'rgba(0,180,196,0.2)'
                      : selected.includes(idx) ? 'var(--jse-gold-dark)' : 'rgba(255,255,255,0.05)'
                    }`,
                  }}
                >
                  <span className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{sentence}</span>
                  {revealed && current.hallucinations.includes(idx) && (
                    <span className="mono-label ml-2" style={{ color: '#dc3232', fontSize: '0.55rem' }}>HALLUCINATED</span>
                  )}
                </button>
              ))}
            </div>

            {current.hallucinations.length === 0 && !revealed && (
              <p className="text-xs mt-3" style={{ color: 'var(--jse-muted)' }}>
                Hint: Not every paragraph contains hallucinations. If none seem wrong, submit with nothing selected.
              </p>
            )}
          </div>

          {/* Explanation */}
          {revealed && (
            <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}>
              <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>EXPLANATION</div>
              <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{current.explanation}</p>
            </div>
          )}

          <div className="flex gap-3">
            {!revealed && <button onClick={checkAnswer} className="jse-btn-teal" data-testid="primary-action-button">Check Answer</button>}
            {revealed && <button onClick={nextParagraph} className="jse-btn-gold" data-testid="primary-action-button">{currentIdx < PARAGRAPHS.length - 1 ? 'Next Paragraph' : 'See Results'}</button>}
          </div>
        </>
      ) : (
        <div className="exercise-card text-center" style={{ border: '1px solid var(--jse-gold-dark)' }}>
          <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>FINAL SCORE</div>
          <div className="jse-score score-bump" style={{ color: totalCorrect === PARAGRAPHS.length ? 'var(--jse-gold)' : 'var(--jse-teal)' }} data-testid="challenge-score">
            {totalCorrect}/{PARAGRAPHS.length}
          </div>
          {totalCorrect === PARAGRAPHS.length && (
            <div className="mono-label mt-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>✨ PERFECT — YOUR HALLUCINATION RADAR IS SHARP ✨</div>
          )}
          <button onClick={handleReset} className="jse-btn-teal mt-4">Try Again</button>
        </div>
      )}
    </div>
  );
}
