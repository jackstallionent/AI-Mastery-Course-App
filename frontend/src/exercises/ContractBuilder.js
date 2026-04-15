import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Copy, CheckCircle2, Info } from 'lucide-react';

const SECTIONS = [
  { key: 'role', label: 'ROLE', color: 'var(--jse-teal)', tooltip: 'One line. Who the AI is. Specific expertise, experience level, and audience awareness.', placeholder: 'e.g., You are a warm, authoritative expert in AI strategy with 10 years of consulting experience...' },
  { key: 'success', label: 'SUCCESS CRITERIA', color: 'var(--jse-gold)', tooltip: 'What "done" looks like. The most underused element. Define what makes the output usable without editing.', placeholder: 'e.g., Success = a deliverable I can send to the client without revisions...' },
  { key: 'constraints', label: 'CONSTRAINTS', color: 'var(--jse-teal)', tooltip: 'Always do / never do rules. Include negative constraints. 3-5 minimum.', placeholder: 'Always: cite sources, use data. Never: use jargon, fabricate statistics, exceed 500 words...' },
  { key: 'uncertainty', label: 'UNCERTAINTY HANDLING', color: 'var(--jse-gold)', tooltip: 'How to behave when unsure. "If uncertain, say so explicitly. Never guess."', placeholder: 'e.g., If the answer depends on specific regulations, say so. Never guess at legal requirements...' },
  { key: 'output', label: 'OUTPUT FORMAT', color: 'var(--jse-teal)', tooltip: 'Structure, length, tone, and examples of good output. Be relentlessly specific.', placeholder: 'e.g., Three sections: Summary (50 words), Analysis (200 words), Recommendation (100 words). Tone: authoritative but warm...' },
];

export default function ContractBuilder({ markComplete }) {
  const [values, setValues] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);
  const [copied, setCopied] = useState(false);
  const filledCount = SECTIONS.filter(s => (values[s.key] || '').trim().length > 10).length;
  const progress = (filledCount / SECTIONS.length) * 100;
  const assembled = SECTIONS.filter(s => values[s.key]?.trim()).map(s => `## ${s.label}\n${values[s.key].trim()}`).join('\n\n');

  const handleCopy = () => { navigator.clipboard.writeText(assembled); setCopied(true); setTimeout(() => setCopied(false), 2000); if (filledCount === 5 && markComplete) markComplete('contract-builder'); };

  return (
    <div className="space-y-6" data-testid="contract-builder-exercise">
      <SectionHeader eyebrow="TIER 3 — DIRECTOR'S BUNDLE" title="The Contract Builder" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Build a complete 5-section Contract format system prompt. The most effective prompt structure in 2026.</p>
      <div className="flex items-center gap-3"><div className="jse-progress flex-1"><div className="jse-progress-fill" style={{ width: `${progress}%`, background: 'var(--jse-gold)' }} /></div><span className="mono-label" style={{ color: 'var(--jse-gold)', fontSize: '0.65rem' }}>{filledCount}/5</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {SECTIONS.map(s => (
            <div key={s.key}>
              <div className="flex items-center gap-2 mb-2">
                <label className="mono-label" style={{ color: s.color, fontSize: '0.6rem' }}>{s.label}</label>
                <button onClick={() => setShowTooltip(showTooltip === s.key ? null : s.key)} className="hover:bg-white/5 rounded p-0.5"><Info size={12} style={{ color: 'var(--jse-muted)' }} /></button>
              </div>
              {showTooltip === s.key && <div className="mb-2 p-2 rounded-lg text-xs" style={{ background: 'var(--jse-elev)', color: 'var(--jse-gold)', border: '1px solid var(--jse-gold-dark)' }}>{s.tooltip}</div>}
              <textarea value={values[s.key] || ''} onChange={e => setValues(prev => ({ ...prev, [s.key]: e.target.value }))} placeholder={s.placeholder} className="jse-textarea" rows={3} />
            </div>
          ))}
        </div>
        <div>
          <div className="mono-label mb-3" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>GENERATED CONTRACT</div>
          <div className="exercise-card min-h-[400px]" style={{ background: 'var(--jse-bg)' }}>
            {assembled ? <pre className="text-sm whitespace-pre-wrap" style={{ color: 'var(--jse-text)', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>{assembled}</pre> : <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Start filling in the sections to see your Contract build here...</p>}
          </div>
          {assembled && <button onClick={handleCopy} className="jse-btn-gold mt-3 flex items-center gap-2" data-testid="primary-action-button">{copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy Contract</>}</button>}
        </div>
      </div>
    </div>
  );
}
