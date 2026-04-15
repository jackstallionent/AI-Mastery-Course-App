import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const TEMP_EXAMPLES = [
  { temp: 0.0, label: 'Deterministic', output: 'The capital of France is Paris. It has been the capital since the 10th century and serves as the political, economic, and cultural center of the country.', style: 'Precise, factual, no variation. The same output every time.' },
  { temp: 0.2, label: 'Conservative', output: 'Paris is the capital of France, a city known for its rich history dating back over a millennium. It serves as the nation\'s political and cultural heart, home to iconic landmarks and institutions.', style: 'Slightly more natural, minor word choice variation. Good for professional writing.' },
  { temp: 0.5, label: 'Balanced', output: 'France\'s beating heart is Paris — a city that has shaped Western civilization for centuries. From the halls of the Louvre to the cafes of Montmartre, it remains a beacon of culture, politics, and innovation.', style: 'Creative but controlled. Good for content writing and general use.' },
  { temp: 0.7, label: 'Creative', output: 'If cities had souls, Paris would be an old philosopher sipping espresso by the Seine, watching centuries unfold like pages in a well-worn novel. It\'s not just France\'s capital — it\'s where ideas go to grow wings.', style: 'Metaphorical, distinctive voice. Good for creative writing and brainstorming.' },
  { temp: 1.0, label: 'Wild', output: 'Paris doesn\'t simply exist — it insists. It\'s the audacious wink of a gargoyle on Notre-Dame, the revolutionary whisper echoing through cobblestone arteries. Every croissant is a manifesto; every boulevard, a dare to dream larger.', style: 'Maximum creativity, unpredictable. High risk of tangents and hallucinations. Best for pure brainstorming.' },
];

export default function TemperatureDial({ markComplete }) {
  const [tempIdx, setTempIdx] = useState(2);
  const current = TEMP_EXAMPLES[tempIdx];

  return (
    <div className="space-y-6" data-testid="temperature-dial-exercise">
      <SectionHeader eyebrow="TIER 2 — DEMYSTIFYING AI" title="Temperature Dial" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>See how temperature (0.0 to 1.0) affects AI output. Same prompt, dramatically different results.</p>
      <div className="mono-label mb-1" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>PROMPT: "Tell me about the capital of France"</div>
      {/* Slider */}
      <div className="exercise-card">
        <div className="flex items-center justify-between mb-3">
          <span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>TEMPERATURE</span>
          <span className="jse-score" style={{ color: current.temp >= 0.7 ? 'var(--jse-gold)' : 'var(--jse-teal)', fontSize: '1.5rem' }}>{current.temp.toFixed(1)}</span>
        </div>
        <input type="range" min={0} max={4} step={1} value={tempIdx} onChange={e => setTempIdx(Number(e.target.value))} className="w-full accent-[#00B4C4]" data-testid="temperature-slider" />
        <div className="flex justify-between mt-1">
          <span className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.5rem' }}>PRECISE</span>
          <span className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.5rem' }}>CREATIVE</span>
        </div>
      </div>
      {/* Output */}
      <div className="exercise-card">
        <div className="flex items-center justify-between mb-3">
          <span className="mono-label" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>{current.label.toUpperCase()} (T={current.temp})</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.8, fontFamily: 'var(--font-body)' }}>{current.output}</p>
      </div>
      <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-teal)' }}>
        <div className="mono-label mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>WHAT'S HAPPENING</div>
        <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{current.style}</p>
      </div>
    </div>
  );
}
