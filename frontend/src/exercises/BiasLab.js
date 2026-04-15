import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const SCENARIOS = [
  { id: 1, prompt: 'Describe a successful CEO', biasType: 'Gender', aiResponseA: 'A successful CEO is typically a decisive man in his 50s who commands respect through his authoritative presence. He graduated from an Ivy League school and built his career through aggressive networking and bold risk-taking.', aiResponseB: 'A successful CEO is a visionary leader who inspires teams through clear communication and strategic thinking. They build inclusive cultures, make data-driven decisions, and adapt quickly to changing markets regardless of their background.', explanation: 'Response A shows gender bias (assumes male), age bias (50s), and educational bias (Ivy League). Response B describes leadership qualities without demographic assumptions.' },
  { id: 2, prompt: 'Write a job description for a nurse', biasType: 'Gender', aiResponseA: 'We are looking for a compassionate and caring woman to join our nursing staff. She should be nurturing, patient, and have excellent bedside manner. The ideal candidate is someone who naturally puts others before herself.', aiResponseB: 'We are seeking a skilled healthcare professional to join our nursing team. The ideal candidate demonstrates clinical expertise, critical thinking under pressure, and effective patient communication. Requirements: BSN or equivalent, current licensure, BLS certification.', explanation: 'Response A assumes nurses are female and emphasizes stereotypically feminine traits. Response B focuses on professional qualifications and skills without gender assumptions.' },
  { id: 3, prompt: 'Describe a typical software engineer', biasType: 'Race & Gender', aiResponseA: 'A typical software engineer is a young Asian or Indian man who studied computer science at a top university. He enjoys coding in his free time, plays video games, and prefers working alone with minimal social interaction.', aiResponseB: 'Software engineers come from diverse backgrounds and work styles. They solve complex problems through code, collaborate with cross-functional teams, and continuously learn new technologies. The field includes people of all ages, backgrounds, and communication styles.', explanation: 'Response A contains racial stereotyping, gender bias, and personality stereotyping. Response B accurately represents the diversity of the profession.' },
];

export default function BiasLab({ markComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedBias, setSelectedBias] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const current = SCENARIOS[currentIdx];

  const handleReveal = () => { setRevealed(true); if (currentIdx === SCENARIOS.length - 1 && markComplete) markComplete('bias-lab'); };
  const handleNext = () => { if (currentIdx < SCENARIOS.length - 1) { setCurrentIdx(prev => prev + 1); setSelectedBias(null); setRevealed(false); } };

  return (
    <div className="space-y-6" data-testid="bias-lab-exercise">
      <SectionHeader eyebrow="TIER 2 — DEMYSTIFYING AI" title="The Bias Lab" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Examine AI responses side by side to identify bias patterns. Select which response shows bias, then reveal the analysis.</p>
      <div className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>SCENARIO {currentIdx + 1} OF {SCENARIOS.length} — {current.biasType.toUpperCase()} BIAS</div>
      <div className="exercise-card"><div className="mono-label mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>PROMPT</div><p className="text-sm" style={{ color: 'var(--jse-text)' }}>"{current.prompt}"</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['A', 'B'].map(letter => (
          <button key={letter} onClick={() => !revealed && setSelectedBias(letter)} className="exercise-card text-left" style={{ borderColor: revealed ? (letter === 'A' ? 'rgba(220,50,50,0.5)' : 'var(--jse-teal)') : selectedBias === letter ? 'var(--jse-gold)' : 'rgba(255,255,255,0.05)' }}>
            <div className="mono-label mb-2" style={{ color: revealed ? (letter === 'A' ? '#dc3232' : 'var(--jse-teal)') : 'var(--jse-muted)', fontSize: '0.6rem' }}>RESPONSE {letter} {revealed && (letter === 'A' ? '— BIASED' : '— BETTER')}</div>
            <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{letter === 'A' ? current.aiResponseA : current.aiResponseB}</p>
          </button>
        ))}
      </div>
      {!revealed && <button onClick={handleReveal} className="jse-btn-teal" disabled={!selectedBias} data-testid="primary-action-button">Reveal Analysis</button>}
      {revealed && (
        <>
          <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}><div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>ANALYSIS</div><p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{current.explanation}</p></div>
          {currentIdx < SCENARIOS.length - 1 && <button onClick={handleNext} className="jse-btn-gold" data-testid="primary-action-button">Next Scenario</button>}
        </>
      )}
    </div>
  );
}
