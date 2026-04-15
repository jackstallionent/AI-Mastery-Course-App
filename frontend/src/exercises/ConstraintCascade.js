import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const LAYERS = [
  { id: 1, name: 'Identity', color: 'var(--jse-teal)', desc: 'Who the AI fundamentally is. Set once, persists forever.', placeholder: 'e.g., You are a warm, authoritative expert in AI strategy who always speaks with precision and genuine care for the learner\'s growth...', example: 'You are a warm, authoritative expert in AI strategy with 10 years of consulting experience. You believe in practical, jargon-free education.' },
  { id: 2, name: 'Behavioral', color: 'var(--jse-gold)', desc: 'How the AI acts in every interaction. Persistent rules.', placeholder: 'e.g., Always cite sources. Never use jargon. Structure responses as: summary, detail, action step...', example: 'Always cite sources. Never use buzzwords. Structure every response as: Key Point, Evidence, Action Step. Ask clarifying questions before assumptions.' },
  { id: 3, name: 'Knowledge', color: 'var(--jse-teal)', desc: 'What the AI knows about your specific context.', placeholder: 'e.g., You know our company focuses on healthcare AI. Our clients are hospital administrators. Our brand voice is authoritative but warm...', example: 'Company: JSE (AI Education). Clients: business professionals learning AI. Brand voice: authoritative, warm, practical. Key frameworks: RACE, Contract Format, Constraint Cascade.' },
  { id: 4, name: 'Task', color: 'var(--jse-gold)', desc: 'What the AI does in this specific interaction. Apply RACE.', placeholder: 'e.g., Analyze the attached quarterly report and identify top 3 trends with evidence and recommendations...', example: 'Analyze the Q3 enrollment data and create a comparison report showing trends across all course tiers. Include growth percentages and recommendations for next quarter.' },
  { id: 5, name: 'Output', color: 'var(--jse-teal)', desc: 'What the result looks like. Format, length, tone, exclusions.', placeholder: 'e.g., Format: Executive brief. Length: 400 words max. Sections: Summary, Analysis, Recommendation. Do NOT use bullet points. Do NOT hedge...', example: 'Format: Executive brief (3 sections). Length: 400 words max. Include one data table. Do NOT use passive voice. Do NOT include disclaimers. Tone: confident, data-driven.' },
];

export default function ConstraintCascade({ markComplete }) {
  const [values, setValues] = useState({});
  const [activeLayer, setActiveLayer] = useState(0);
  const filledCount = LAYERS.filter(l => (values[l.id] || '').trim().length > 10).length;

  return (
    <div className="space-y-6" data-testid="constraint-cascade-exercise">
      <SectionHeader eyebrow="TIER 3 — DIRECTOR'S BUNDLE" title="The Constraint Cascade" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Build each of the 5 layers and watch how they compound. Each layer narrows the AI's probability space further.</p>
      <div className="flex items-center gap-3"><div className="jse-progress flex-1"><div className="jse-progress-fill" style={{ width: `${(filledCount / 5) * 100}%`, background: 'var(--jse-teal)' }} /></div><span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.65rem' }}>{filledCount}/5 LAYERS</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          {LAYERS.map((l, i) => (
            <div key={l.id} className={`cascade-layer ${activeLayer === i ? 'active' : ''}`} style={{ marginLeft: `${i * 12}px` }}>
              <button onClick={() => setActiveLayer(i)} className="w-full text-left p-3 rounded-lg transition-colors duration-150 hover:bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="mono-label" style={{ color: l.color, fontSize: '0.6rem' }}>LAYER {l.id}</span>
                  <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{l.name}</span>
                  {(values[l.id] || '').trim().length > 10 && <span style={{ color: 'var(--jse-gold)' }}>✓</span>}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--jse-muted)' }}>{l.desc}</p>
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="exercise-card">
            <div className="mono-label mb-2" style={{ color: LAYERS[activeLayer].color, fontSize: '0.6rem' }}>LAYER {LAYERS[activeLayer].id}: {LAYERS[activeLayer].name.toUpperCase()}</div>
            <p className="text-sm mb-3" style={{ color: 'var(--jse-muted)' }}>{LAYERS[activeLayer].desc}</p>
            <textarea value={values[LAYERS[activeLayer].id] || ''} onChange={e => setValues(prev => ({ ...prev, [LAYERS[activeLayer].id]: e.target.value }))} placeholder={LAYERS[activeLayer].placeholder} className="jse-textarea" rows={4} />
            <button onClick={() => setValues(prev => ({ ...prev, [LAYERS[activeLayer].id]: LAYERS[activeLayer].example }))} className="jse-btn-secondary mt-2 text-xs">Load Example</button>
          </div>
          {filledCount > 0 && (
            <div className="exercise-card" style={{ background: 'var(--jse-bg)' }}>
              <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>CASCADED CONTEXT</div>
              {LAYERS.filter(l => (values[l.id] || '').trim()).map(l => (
                <div key={l.id} className="mb-2"><span className="mono-label" style={{ color: l.color, fontSize: '0.55rem' }}>{l.name.toUpperCase()}:</span><p className="text-xs" style={{ color: 'var(--jse-text)', lineHeight: 1.6 }}>{values[l.id]}</p></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
