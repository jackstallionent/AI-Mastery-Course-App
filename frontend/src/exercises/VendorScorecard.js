import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const CRITERIA = [
  { id: 1, name: 'Data Security', desc: 'How well does the vendor protect your data? Encryption, access controls, certifications.', weight: 2 },
  { id: 2, name: 'Compliance', desc: 'Does the vendor meet regulatory requirements? SOC2, GDPR, HIPAA, EU AI Act readiness.', weight: 2 },
  { id: 3, name: 'Performance', desc: 'How reliable and fast is the service? Uptime SLA, latency, accuracy benchmarks.', weight: 1.5 },
  { id: 4, name: 'Integration', desc: 'How easily does it fit your existing stack? APIs, SSO, data portability, migration tools.', weight: 1 },
  { id: 5, name: 'Cost Transparency', desc: 'Is pricing clear and predictable? Hidden fees, scaling costs, contract flexibility.', weight: 1 },
  { id: 6, name: 'Support & Training', desc: 'What level of support is available? Response times, documentation, training resources.', weight: 0.5 },
];

export default function VendorScorecard({ markComplete }) {
  const [vendorName, setVendorName] = useState('');
  const [scores, setScores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const totalWeight = CRITERIA.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore = CRITERIA.reduce((sum, c) => sum + (scores[c.id] || 0) * c.weight, 0);
  const maxScore = totalWeight * 5;
  const percent = Math.round((weightedScore / maxScore) * 100);

  const getRecommendation = () => {
    if (percent >= 80) return { text: 'STRONG RECOMMEND — This vendor meets or exceeds requirements across all criteria.', color: 'var(--jse-teal)' };
    if (percent >= 60) return { text: 'CONDITIONAL RECOMMEND — Good fit with some gaps. Negotiate improvements in weak areas.', color: 'var(--jse-gold)' };
    if (percent >= 40) return { text: 'PROCEED WITH CAUTION — Significant gaps exist. Consider alternatives or require remediation plan.', color: 'var(--jse-gold-light)' };
    return { text: 'NOT RECOMMENDED — Does not meet minimum requirements. Evaluate alternative vendors.', color: '#dc3232' };
  };

  const handleSubmit = () => { setSubmitted(true); if (markComplete) markComplete('vendor-scorecard'); };
  const allRated = CRITERIA.every(c => scores[c.id] > 0);

  return (
    <div className="space-y-6" data-testid="vendor-scorecard-exercise">
      <SectionHeader eyebrow="TIER 4 — ENTERPRISE" title="Vendor Evaluation Scorecard" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Rate vendors on 6 weighted criteria (1-5 scale). Auto-calculates totals and generates a recommendation.</p>
      <div><label className="mono-label block mb-1" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>VENDOR NAME</label><input type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="e.g., OpenAI, Anthropic, Google Cloud AI" className="jse-input" /></div>
      <div className="space-y-3">
        {CRITERIA.map(c => (
          <div key={c.id} className="exercise-card">
            <div className="flex items-center justify-between mb-2">
              <div><span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</span><span className="mono-label ml-2" style={{ color: 'var(--jse-muted)', fontSize: '0.5rem' }}>WEIGHT: {c.weight}x</span></div>
              <span className="mono-label" style={{ color: scores[c.id] ? 'var(--jse-teal)' : 'var(--jse-muted)', fontSize: '0.7rem' }}>{scores[c.id] || '-'}/5</span>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--jse-muted)' }}>{c.desc}</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setScores(prev => ({...prev, [c.id]: n}))} className="w-10 h-10 rounded-lg mono-label text-sm" style={{ background: scores[c.id] === n ? 'var(--jse-teal)' : 'var(--jse-bg)', color: scores[c.id] === n ? 'var(--jse-bg)' : 'var(--jse-text)', border: `1px solid ${scores[c.id] === n ? 'var(--jse-teal)' : 'rgba(255,255,255,0.08)'}` }}>{n}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!submitted && <button onClick={handleSubmit} disabled={!allRated || !vendorName} className="jse-btn-gold" data-testid="primary-action-button">Generate Evaluation</button>}
      {submitted && (
        <div className="space-y-4 card-reveal">
          <div className="exercise-card text-center" style={{ border: `1px solid ${getRecommendation().color}` }}>
            <div className="mono-label mb-1" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>WEIGHTED SCORE FOR {vendorName.toUpperCase()}</div>
            <div className="jse-score score-bump" style={{ color: getRecommendation().color }} data-testid="challenge-score">{percent}%</div>
          </div>
          <div className="exercise-card" style={{ borderLeft: `3px solid ${getRecommendation().color}` }}>
            <div className="mono-label mb-1" style={{ color: getRecommendation().color, fontSize: '0.6rem' }}>RECOMMENDATION</div>
            <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{getRecommendation().text}</p>
          </div>
          <button onClick={() => { setSubmitted(false); setScores({}); setVendorName(''); }} className="jse-btn-teal">Evaluate Another Vendor</button>
        </div>
      )}
    </div>
  );
}
