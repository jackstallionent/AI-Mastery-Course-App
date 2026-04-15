import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Copy, CheckCircle2 } from 'lucide-react';

export default function RaceBuilder({ updateScore, markComplete }) {
  const [values, setValues] = useState({ role: '', action: '', context: '', expectation: '' });
  const [copied, setCopied] = useState(false);

  const fields = [
    { key: 'role', label: 'R — ROLE', placeholder: 'e.g., You are a senior data analyst with 15 years of healthcare experience...', color: 'var(--jse-teal)' },
    { key: 'action', label: 'A — ACTION', placeholder: 'e.g., Analyze the quarterly revenue data and identify the top 3 trends...', color: 'var(--jse-gold)' },
    { key: 'context', label: 'C — CONTEXT', placeholder: 'e.g., The audience is the C-suite. Budget discussions are next week...', color: 'var(--jse-teal)' },
    { key: 'expectation', label: 'E — EXPECTATION', placeholder: 'e.g., Format as a 300-word executive summary with bullet points. Do NOT use jargon...', color: 'var(--jse-gold)' },
  ];

  const filledCount = Object.values(values).filter(v => v.trim().length > 5).length;
  const progress = (filledCount / 4) * 100;
  const assembled = Object.entries(values).filter(([,v]) => v.trim()).map(([k,v]) => v.trim()).join('\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(assembled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (filledCount === 4) {
      if (updateScore) updateScore('race-builder', 100);
      if (markComplete) markComplete('race-builder');
    }
  };

  return (
    <div className="space-y-6" data-testid="race-builder-exercise">
      <SectionHeader eyebrow="TIER 1 — PROMPT MASTERY" title="The RACE Builder" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Build a complete prompt using the RACE framework. Fill in each field and watch your prompt assemble in real time.</p>
      <div className="flex items-center gap-3">
        <div className="jse-progress flex-1"><div className="jse-progress-fill" style={{ width: `${progress}%`, background: 'var(--jse-teal)' }} /></div>
        <span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.65rem' }}>{filledCount}/4</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="mono-label block mb-2" style={{ color: f.color, fontSize: '0.65rem' }}>{f.label}</label>
              <textarea
                value={values[f.key]}
                onChange={e => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="jse-textarea"
                rows={3}
                data-testid={`race-field-${f.key}`}
              />
            </div>
          ))}
        </div>
        <div>
          <div className="mono-label mb-3" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>ASSEMBLED PROMPT</div>
          <div className="exercise-card min-h-[300px]" style={{ background: 'var(--jse-bg)' }}>
            {assembled ? (
              <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--jse-text)', lineHeight: 1.8 }}>{assembled}</p>
            ) : (
              <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Start typing in the fields to see your prompt build here...</p>
            )}
          </div>
          {assembled && (
            <button onClick={handleCopy} className="jse-btn-teal mt-3 flex items-center gap-2" data-testid="primary-action-button">
              {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy to Clipboard</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
