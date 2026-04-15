import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Identify the Claim', desc: 'Start with a specific factual claim from AI output that needs verification.', task: 'Enter an AI-generated claim to fact-check:', placeholder: 'e.g., "According to a 2024 Stanford study, 72% of small businesses use AI tools."' },
  { id: 2, title: 'Source Verification', desc: 'Check if the claimed source actually exists and contains the referenced information.', task: 'What would you search for to verify this claim?', placeholder: 'e.g., Stanford 2024 AI small business study, McKinsey AI adoption report...' },
  { id: 3, title: 'Cross-Reference', desc: 'Find at least 2 independent sources that confirm or deny the claim.', task: 'List 2 sources you would check:', placeholder: 'Source 1: ... Source 2: ...' },
  { id: 4, title: 'Assess Confidence', desc: 'Rate your confidence in the claim based on your research.', task: 'Rate confidence (1-10) and explain:', placeholder: 'Confidence: 7/10. The statistic is close to verified numbers but the exact study cited may not exist...' },
  { id: 5, title: 'Document Result', desc: 'Record whether the claim is Verified, Partially True, or Hallucinated.', task: 'What is your verdict?', placeholder: 'VERDICT: Partially True. The percentage is approximately correct per McKinsey data, but the specific Stanford study does not appear to exist...' },
];

export default function FactChecker({ markComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const completed = Object.keys(answers).length;

  const handleSubmitStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
    else if (markComplete) markComplete('fact-checker');
  };

  return (
    <div className="space-y-6" data-testid="fact-checker-exercise">
      <SectionHeader eyebrow="TIER 2 — DEMYSTIFYING AI" title="Fact-Checker Workflow" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Complete each step of the grounding workflow. This is how professionals verify AI output.</p>
      <div className="jse-progress"><div className="jse-progress-fill" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%`, background: 'var(--jse-teal)' }} /></div>
      {/* Step indicators */}
      <div className="flex gap-2 flex-wrap">
        {STEPS.map((s, i) => (
          <button key={s.id} onClick={() => i <= completed && setCurrentStep(i)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: i === currentStep ? 'var(--jse-teal-deep)' : i < completed ? 'rgba(201,168,76,0.1)' : 'var(--jse-card)', border: `1px solid ${i === currentStep ? 'var(--jse-teal)' : i < completed ? 'var(--jse-gold-dark)' : 'rgba(255,255,255,0.05)'}`, color: i === currentStep ? 'var(--jse-teal)' : 'var(--jse-text)', fontFamily: 'var(--font-mono)' }}>
            {i < completed ? <CheckCircle2 size={12} style={{ color: 'var(--jse-gold)' }} /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>
      {/* Current Step */}
      <div className="exercise-card">
        <div className="mono-label mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>STEP {STEPS[currentStep].id}: {STEPS[currentStep].title.toUpperCase()}</div>
        <p className="text-sm mb-4" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{STEPS[currentStep].desc}</p>
        <label className="mono-label block mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>{STEPS[currentStep].task}</label>
        <textarea value={answers[currentStep] || ''} onChange={e => setAnswers(prev => ({ ...prev, [currentStep]: e.target.value }))} placeholder={STEPS[currentStep].placeholder} className="jse-textarea" rows={3} data-testid="prompt-input" />
      </div>
      <button onClick={handleSubmitStep} disabled={!(answers[currentStep]?.length > 5)} className="jse-btn-teal" data-testid="primary-action-button">
        {currentStep < STEPS.length - 1 ? 'Next Step' : 'Complete Workflow'}
      </button>
    </div>
  );
}
