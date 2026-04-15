import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const SAMPLE_CONTENT = 'AI is transforming how businesses operate. Companies that adopt AI see significant improvements in efficiency and revenue. The technology is becoming more accessible every day, making it possible for even small businesses to leverage its power.';
const PASSES = [
  { id: 1, criteria: 'Accuracy', color: 'var(--jse-teal)', feedback: 'Claims lack specific data. "Significant improvements" needs quantification. "More accessible" needs evidence.', improved: 'AI is transforming how businesses operate. Organizations that strategically implement AI report 20-30% efficiency gains in automated workflows (McKinsey, 2025). While enterprise AI tools once required six-figure budgets, platforms like Claude Projects and Custom GPTs now enable capable AI deployment for under $50/month.' },
  { id: 2, criteria: 'Clarity', color: 'var(--jse-gold)', feedback: 'Opening is generic. "Leverage its power" is jargon. Sentences lack specificity.', improved: 'AI is reshaping business operations in three measurable ways: automating repetitive tasks, accelerating decision-making, and enabling personalized customer experiences. Organizations that strategically implement AI report 20-30% efficiency gains in automated workflows (McKinsey, 2025). The barrier to entry has dropped dramatically — platforms like Claude Projects and Custom GPTs enable capable AI deployment for under $50/month, putting sophisticated tools within reach of businesses at every scale.' },
  { id: 3, criteria: 'Completeness', color: 'var(--jse-teal)', feedback: 'Missing: specific examples, call to action, acknowledgment of challenges. Needs a balanced view.', improved: 'AI is reshaping business operations in three measurable ways: automating repetitive tasks, accelerating decision-making, and enabling personalized customer experiences. Organizations that strategically implement AI report 20-30% efficiency gains in automated workflows (McKinsey, 2025). The barrier to entry has dropped dramatically — platforms like Claude Projects and Custom GPTs enable capable AI deployment for under $50/month.\n\nHowever, adoption without strategy is a recipe for wasted investment. The 88% of companies that adopt AI but only 6% that see meaningful returns (McKinsey) tells a clear story: the tool matters less than the implementation plan. Start with one high-value workflow, measure results for 30 days, then scale what works.' },
];

export default function RSIPSimulator({ markComplete }) {
  const [activePass, setActivePass] = useState(0);

  return (
    <div className="space-y-6" data-testid="rsip-simulator-exercise">
      <SectionHeader eyebrow="TIER 3 — DIRECTOR'S BUNDLE" title="RSIP Simulator" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Watch content improve through 3 iterative passes with rotating evaluation criteria. Each pass deepens quality.</p>
      <div className="flex gap-2">
        <button onClick={() => setActivePass(0)} className="px-4 py-2 rounded-xl mono-label text-xs" style={{ background: activePass === 0 ? 'var(--jse-card)' : 'transparent', border: `1px solid ${activePass === 0 ? 'var(--jse-teal)' : 'rgba(255,255,255,0.05)'}`, color: activePass === 0 ? 'var(--jse-teal)' : 'var(--jse-muted)' }}>Original</button>
        {PASSES.map((p, i) => (
          <button key={p.id} onClick={() => setActivePass(i + 1)} className="px-4 py-2 rounded-xl mono-label text-xs" style={{ background: activePass === i + 1 ? 'var(--jse-card)' : 'transparent', border: `1px solid ${activePass === i + 1 ? p.color : 'rgba(255,255,255,0.05)'}`, color: activePass === i + 1 ? p.color : 'var(--jse-muted)' }}>Pass {p.id}: {p.criteria}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="exercise-card">
          <div className="mono-label mb-2" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>{activePass === 0 ? 'ORIGINAL CONTENT' : `AFTER PASS ${activePass}`}</div>
          <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--jse-text)', lineHeight: 1.8 }}>{activePass === 0 ? SAMPLE_CONTENT : PASSES[activePass - 1].improved}</p>
        </div>
        {activePass > 0 && (
          <div className="exercise-card" style={{ borderLeft: `3px solid ${PASSES[activePass - 1].color}` }}>
            <div className="mono-label mb-2" style={{ color: PASSES[activePass - 1].color, fontSize: '0.6rem' }}>PASS {activePass} CRITIQUE ({PASSES[activePass - 1].criteria.toUpperCase()})</div>
            <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{PASSES[activePass - 1].feedback}</p>
          </div>
        )}
      </div>
      {activePass > 0 && (
        <div className="exercise-card" style={{ background: 'rgba(201,168,76,0.08)' }}>
          <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>✦ RSIP PRINCIPLE</div>
          <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>Generate → Critique (rotating criteria) → Improve → Repeat. The rotation prevents fixating on surface issues and forces deeper structural improvement. Each pass addresses: Pass 1 = Accuracy, Pass 2 = Clarity, Pass 3 = Completeness.</p>
        </div>
      )}
    </div>
  );
}
