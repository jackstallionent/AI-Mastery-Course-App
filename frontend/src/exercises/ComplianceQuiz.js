import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const QUESTIONS = [
  { id: 1, scenario: 'An employee uses ChatGPT to draft a client proposal and includes the client\'s confidential revenue projections in the prompt.', q: 'What is the primary compliance risk?', options: ['Copyright infringement', 'Data privacy violation', 'Trademark violation', 'No risk'], correct: 1, explanation: 'Sharing confidential client data with an external AI tool constitutes a data privacy violation. This data may be used for training, stored on external servers, and could be exposed in future outputs.' },
  { id: 2, scenario: 'Your marketing team uses AI to generate customer emails. The AI is trained on historical data that primarily contains interactions with English-speaking customers.', q: 'What type of bias risk does this present?', options: ['Recency bias', 'Linguistic and cultural bias', 'Confirmation bias', 'Selection bias'], correct: 1, explanation: 'AI trained predominantly on one language group will produce culturally biased outputs that may not resonate with or could offend diverse customer segments. This is both an ethical and business risk.' },
  { id: 3, scenario: 'A startup uses an AI model to screen job applications. The model was trained on data from the past 10 years of successful hires, who were predominantly male engineers.', q: 'Under the EU AI Act, how is this system classified?', options: ['Minimal risk', 'Limited risk', 'High risk', 'Unacceptable risk'], correct: 2, explanation: 'Employment and recruitment AI is classified as High Risk under the EU AI Act. It requires conformity assessment, transparency to applicants, human oversight, and bias testing before deployment.' },
  { id: 4, scenario: 'Your organization deploys an AI chatbot for customer support. A customer asks the chatbot for medical advice, and it provides a detailed diagnosis.', q: 'What should your organization do FIRST?', options: ['Improve the chatbot\'s medical knowledge', 'Add a disclaimer to responses', 'Implement scope constraints to prevent medical advice', 'Sue the AI vendor'], correct: 2, explanation: 'The immediate action is implementing behavioral constraints that prevent the AI from operating outside its intended scope. "I\'m not qualified to provide medical advice" should be a hard constraint, not just a disclaimer.' },
  { id: 5, scenario: 'An executive asks you to implement AI that monitors employee emails for productivity metrics without informing employees.', q: 'Which regulation is most directly relevant?', options: ['GDPR/Privacy laws', 'EU AI Act only', 'SOX compliance', 'No regulation applies'], correct: 0, explanation: 'Covert employee surveillance violates GDPR (and most privacy laws) which require transparency about data collection. Under the EU AI Act, this could approach prohibited practices if used for social scoring in the workplace.' },
  { id: 6, scenario: 'Your team wants to use an AI tool that processes data on servers in multiple countries, including some without adequacy decisions under GDPR.', q: 'What is required before proceeding?', options: ['Nothing — cloud is global', 'A data processing impact assessment and appropriate safeguards', 'Just a vendor contract', 'Government approval'], correct: 1, explanation: 'Cross-border data transfers require appropriate safeguards (Standard Contractual Clauses, adequacy decisions, or binding corporate rules). A Data Protection Impact Assessment (DPIA) should be conducted first.' },
  { id: 7, scenario: 'A vendor offers an AI tool that they claim is "fully compliant with the EU AI Act." They refuse to share their conformity assessment documentation.', q: 'What is the appropriate response?', options: ['Trust the vendor claim', 'Request documentation or decline the vendor', 'Wait for EU enforcement', 'Proceed with internal monitoring'], correct: 1, explanation: 'Compliance claims without documentation are red flags. Under the EU AI Act, deployers have obligations too. You must verify compliance — vendor refusal to share documentation should disqualify them from consideration.' },
  { id: 8, scenario: 'Your AI system makes a recommendation that leads to a significant financial loss for a client. The client demands accountability.', q: 'Under most frameworks, who bears primary liability?', options: ['The AI itself', 'The AI vendor', 'Your organization (the deployer)', 'No one — AI isn\'t regulated yet'], correct: 2, explanation: 'Deployers bear primary liability for AI-assisted decisions. The organization chose to implement the AI, chose how to use it, and bears responsibility for adequate human oversight. "The AI did it" is not a legal defense.' },
  { id: 9, scenario: 'You discover that 68% of employees are using personal AI tool subscriptions to do company work, bypassing approved tools.', q: 'What is this phenomenon called, and what\'s the biggest risk?', options: ['AI overuse — productivity loss', 'Shadow AI — uncontrolled data exposure', 'Tool sprawl — wasted budget', 'AI democratization — no risk'], correct: 1, explanation: 'Shadow AI is the #1 enterprise AI compliance risk in 2026. Employees using unauthorized tools means company data flows through uncontrolled channels with unknown data handling, retention, and training policies.' },
  { id: 10, scenario: 'Your company wants to fine-tune a language model on proprietary customer support data to create a specialized support chatbot.', q: 'What must be verified FIRST?', options: ['Model accuracy', 'Whether customers consented to their data being used for AI training', 'The AI vendor\'s stock price', 'Whether the model supports fine-tuning'], correct: 1, explanation: 'Customer data consent is the foundational requirement. If customers didn\'t consent to their data being used for AI model training, fine-tuning on their data likely violates privacy laws regardless of how good the resulting model is.' },
];

export default function ComplianceQuiz({ updateScore, markComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[currentIdx];
  const totalCorrect = results.filter(Boolean).length;

  const handleCheck = () => {
    const isCorrect = selected === current.correct;
    setResults(prev => [...prev, isCorrect]);
    setRevealed(true);
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) { setCurrentIdx(prev => prev + 1); setSelected(null); setRevealed(false); }
    else {
      setFinished(true);
      const finalCorrect = [...results].filter(Boolean).length;
      if (updateScore) updateScore('compliance-quiz', finalCorrect * 10);
      if (finalCorrect >= 7 && markComplete) markComplete('compliance-quiz');
    }
  };

  const handleReset = () => { setCurrentIdx(0); setSelected(null); setRevealed(false); setResults([]); setFinished(false); };

  return (
    <div className="space-y-6" data-testid="compliance-quiz-exercise">
      <SectionHeader eyebrow="TIER 4 — ENTERPRISE" title="Compliance Quiz" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>10 scenario-based questions about AI compliance. Each answer reveals the regulatory context.</p>
      {!finished ? (
        <>
          <div className="flex items-center justify-between">
            <span className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>QUESTION {currentIdx + 1} OF {QUESTIONS.length}</span>
            <span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>SCORE: {totalCorrect}/{results.length}</span>
          </div>
          <div className="jse-progress"><div className="jse-progress-fill" style={{ width: `${((currentIdx) / QUESTIONS.length) * 100}%`, background: 'var(--jse-teal)' }} /></div>
          <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}>
            <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>SCENARIO</div>
            <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{current.scenario}</p>
          </div>
          <div className="exercise-card">
            <p className="text-sm font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>{current.q}</p>
            <div className="space-y-2">
              {current.options.map((opt, i) => (
                <button key={i} onClick={() => !revealed && setSelected(i)} className="w-full text-left p-3 rounded-lg text-sm transition-colors" style={{
                  background: revealed ? i === current.correct ? 'rgba(0,180,196,0.15)' : i === selected ? 'rgba(220,50,50,0.15)' : 'var(--jse-bg)' : selected === i ? 'var(--jse-teal-deep)' : 'var(--jse-bg)',
                  border: `1px solid ${revealed ? i === current.correct ? 'var(--jse-teal)' : i === selected ? 'rgba(220,50,50,0.5)' : 'rgba(255,255,255,0.05)' : selected === i ? 'var(--jse-teal)' : 'rgba(255,255,255,0.05)'}`,
                  color: 'var(--jse-text)'
                }}>{opt}{revealed && i === current.correct && ' ✓'}</button>
              ))}
            </div>
          </div>
          {revealed && (
            <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-teal)' }}>
              <div className="mono-label mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.55rem' }}>REGULATORY CONTEXT</div>
              <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{current.explanation}</p>
            </div>
          )}
          <div className="flex gap-3">
            {!revealed && <button onClick={handleCheck} disabled={selected === null} className="jse-btn-teal" data-testid="primary-action-button">Check Answer</button>}
            {revealed && <button onClick={handleNext} className="jse-btn-gold" data-testid="primary-action-button">{currentIdx < QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}</button>}
          </div>
        </>
      ) : (
        <div className="exercise-card text-center" style={{ border: '1px solid var(--jse-gold-dark)' }}>
          <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>FINAL SCORE</div>
          <div className="jse-score score-bump" style={{ color: totalCorrect >= 7 ? 'var(--jse-gold)' : 'var(--jse-teal)' }} data-testid="challenge-score">{totalCorrect}/{QUESTIONS.length}</div>
          {totalCorrect === QUESTIONS.length && <div className="mono-label mt-2" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>✨ PERFECT — COMPLIANCE MASTER ✨</div>}
          <button onClick={handleReset} className="jse-btn-teal mt-4">Try Again</button>
        </div>
      )}
    </div>
  );
}
