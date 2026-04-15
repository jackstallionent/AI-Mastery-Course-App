import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { CheckCircle2 } from 'lucide-react';

const MODULES = [
  { id: 1, name: 'Unmasking the Magic', desc: 'What AI actually is and why it matters', topics: ['AI as prediction machine', 'Constraint Satisfaction', 'Hallucinations', 'Bias discovery'], color: 'var(--jse-teal)' },
  { id: 2, name: 'The Art of the Ask', desc: 'Masterful prompt design with RACE', topics: ['RACE Framework', 'Action verbs', 'Context building', 'Expectations & constraints'], color: 'var(--jse-gold)' },
  { id: 3, name: 'Giving AI a Brain', desc: 'Memory, grounding, and workflows', topics: ['RAG & grounding', 'Knowledge bases', 'NotebookLM', 'Workflow automation'], color: 'var(--jse-teal)' },
  { id: 4, name: 'The Prismatic Lens', desc: 'Multi-perspective thinking', topics: ['Council of Experts', 'Decision frameworks', 'Productivity systems', 'Critical analysis'], color: 'var(--jse-gold)' },
  { id: 5, name: 'Protecting Your World', desc: 'AI ethics, safety, and defense', topics: ['Deepfakes & voice cloning', 'AI-powered phishing', 'Digital self-defense', 'Responsible AI use'], color: 'var(--jse-teal)' },
];

export default function ModuleProgress({ completedExercises }) {
  const [completedModules, setCompletedModules] = useState([]);
  const toggleModule = (id) => setCompletedModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  const progress = Math.round((completedModules.length / MODULES.length) * 100);

  return (
    <div className="space-y-6" data-testid="progress-tracker-exercise">
      <SectionHeader eyebrow="TIER 2 — DEMYSTIFYING AI" title="Module Progress Tracker" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Track your progress through all 5 Demystifying AI modules. Click to mark modules complete.</p>
      <div className="exercise-card flex items-center gap-4">
        <div className="jse-score" style={{ color: 'var(--jse-teal)' }}>{progress}%</div>
        <div className="flex-1"><div className="jse-progress"><div className="jse-progress-fill" style={{ width: `${progress}%`, background: 'var(--jse-teal)' }} /></div></div>
        <span className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>{completedModules.length}/{MODULES.length}</span>
      </div>
      <div className="space-y-3">
        {MODULES.map(m => {
          const done = completedModules.includes(m.id);
          return (
            <button key={m.id} onClick={() => toggleModule(m.id)} className="exercise-card w-full text-left" style={{ borderLeft: `3px solid ${done ? 'var(--jse-gold)' : m.color}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="mono-label" style={{ color: m.color, fontSize: '0.6rem' }}>MODULE {m.id}</span>
                    {done && <CheckCircle2 size={14} style={{ color: 'var(--jse-gold)' }} />}
                  </div>
                  <div className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{m.name}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--jse-muted)' }}>{m.desc}</div>
                </div>
                <div className="hidden sm:block text-right">
                  {m.topics.map((t, i) => <div key={i} className="text-xs" style={{ color: 'var(--jse-muted)', fontSize: '0.7rem' }}>{t}</div>)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
