import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const QUESTIONS = [
  { id: 1, q: 'Do employees use AI tools that IT has not approved?', weight: 3, options: ['Not at all', 'Rarely', 'Sometimes', 'Frequently', 'We don\'t know'] },
  { id: 2, q: 'Is there a formal policy governing AI use in your organization?', weight: 2, options: ['Comprehensive policy', 'Basic guidelines', 'Informal rules', 'No policy', 'We\'re working on it'] },
  { id: 3, q: 'Do employees input sensitive data (customer info, financials) into AI tools?', weight: 3, options: ['Never', 'Rarely', 'Sometimes', 'Frequently', 'We don\'t track this'] },
  { id: 4, q: 'Is there a designated person/team responsible for AI governance?', weight: 2, options: ['Dedicated team', 'Part of IT\'s role', 'Informal responsibility', 'No one', 'Under discussion'] },
  { id: 5, q: 'How are AI-generated outputs verified before external use?', weight: 3, options: ['Formal review process', 'Peer review', 'Self-review', 'No verification', 'Varies by team'] },
  { id: 6, q: 'Are employees trained on responsible AI use?', weight: 2, options: ['Comprehensive training', 'Basic training', 'Self-directed learning', 'No training', 'Planned'] },
  { id: 7, q: 'How is AI tool access managed?', weight: 2, options: ['Centralized management', 'Team-level control', 'Individual choice', 'No management', 'Mixed'] },
  { id: 8, q: 'Is AI usage logged and auditable?', weight: 3, options: ['Full logging', 'Partial logging', 'No logging', 'Only for some tools', 'We don\'t know'] },
  { id: 9, q: 'How quickly could you respond to an AI-related security incident?', weight: 2, options: ['< 1 hour', '1-24 hours', '1-7 days', 'We have no plan', 'Unclear'] },
  { id: 10, q: 'Are vendor AI agreements reviewed for data handling terms?', weight: 2, options: ['Always reviewed', 'Sometimes', 'Rarely', 'Never', 'We don\'t know'] },
];

export default function ShadowAIAuditor({ updateScore, markComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;

  const calculateRisk = () => {
    let riskScore = 0; let maxScore = 0;
    QUESTIONS.forEach(q => { maxScore += q.weight * 4; const idx = q.options.indexOf(answers[q.id]); riskScore += q.weight * Math.min(idx, 4); });
    return Math.round((riskScore / maxScore) * 100);
  };

  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: 'var(--jse-teal)', tier: 'Tier 1 — Standard tools with monitoring', actions: ['Formalize existing practices', 'Schedule quarterly reviews', 'Document approved tool list'] };
    if (score < 60) return { level: 'Medium', color: 'var(--jse-gold)', tier: 'Tier 2 — Enhanced controls needed', actions: ['Implement AI use policy within 30 days', 'Deploy AI usage monitoring', 'Mandatory training for all employees', 'Audit current tool usage immediately'] };
    return { level: 'High', color: '#dc3232', tier: 'Tier 3 — Immediate intervention required', actions: ['Emergency policy deployment this week', 'Restrict unapproved AI tool access', 'Conduct full data exposure audit', 'Appoint AI governance lead', 'Brief executive team on risk exposure'] };
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = 100 - calculateRisk();
    if (updateScore) updateScore('shadow-ai-auditor', score);
    if (markComplete) markComplete('shadow-ai-auditor');
  };

  const risk = submitted ? getRiskLevel(calculateRisk()) : null;

  return (
    <div className="space-y-6" data-testid="shadow-ai-auditor-exercise">
      <SectionHeader eyebrow="TIER 4 — ENTERPRISE" title="Shadow AI Auditor" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Answer 10 questions about your organization's AI usage. Get a risk score and prioritized action plan.</p>
      {!submitted ? (
        <>
          <div className="flex items-center gap-3"><div className="jse-progress flex-1"><div className="jse-progress-fill" style={{ width: `${(answered / 10) * 100}%`, background: 'var(--jse-teal)' }} /></div><span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.65rem' }}>{answered}/10</span></div>
          <div className="space-y-4">
            {QUESTIONS.map(q => (
              <div key={q.id} className="exercise-card">
                <div className="flex items-start gap-2 mb-3"><span className="mono-label" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>Q{q.id}</span><p className="text-sm" style={{ color: 'var(--jse-text)' }}>{q.q}</p></div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt, i) => (
                    <button key={i} onClick={() => setAnswers(prev => ({...prev, [q.id]: opt}))} className="px-3 py-1.5 rounded-lg text-xs transition-colors" style={{ background: answers[q.id] === opt ? 'var(--jse-teal-deep)' : 'var(--jse-bg)', border: `1px solid ${answers[q.id] === opt ? 'var(--jse-teal)' : 'rgba(255,255,255,0.05)'}`, color: answers[q.id] === opt ? 'var(--jse-teal)' : 'var(--jse-text)' }}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={answered < 10} className="jse-btn-gold" data-testid="primary-action-button">Generate Risk Assessment</button>
        </>
      ) : (
        <div className="space-y-4 card-reveal">
          <div className="exercise-card text-center" style={{ border: `1px solid ${risk.color}` }}>
            <div className="mono-label mb-2" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>SHADOW AI RISK SCORE</div>
            <div className="jse-score score-bump" style={{ color: risk.color }}>{calculateRisk()}%</div>
            <div className="mono-label mt-1" style={{ color: risk.color, fontSize: '0.6rem' }}>RISK LEVEL: {risk.level.toUpperCase()}</div>
          </div>
          <div className="exercise-card" style={{ borderLeft: `3px solid ${risk.color}` }}>
            <div className="mono-label mb-2" style={{ color: risk.color, fontSize: '0.6rem' }}>CLASSIFICATION</div>
            <p className="text-sm" style={{ color: 'var(--jse-text)' }}>{risk.tier}</p>
          </div>
          <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}>
            <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>PRIORITIZED ACTIONS</div>
            {risk.actions.map((a, i) => <div key={i} className="flex items-start gap-2 mb-2"><span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.55rem' }}>{i + 1}.</span><p className="text-sm" style={{ color: 'var(--jse-text)' }}>{a}</p></div>)}
          </div>
          <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="jse-btn-teal">Retake Assessment</button>
        </div>
      )}
    </div>
  );
}
