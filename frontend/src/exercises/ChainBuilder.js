import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { ArrowRight } from 'lucide-react';

const CHAIN_STEPS = [
  { id: 1, name: 'Research', icon: '🔍', color: 'var(--jse-teal)', desc: 'Gather data, identify key themes, and create a structured outline from source material.', sampleOutput: 'Topic: AI Adoption\n• Key Theme 1: 88% adoption rate but only 6% success\n• Key Theme 2: Workflow redesign is the differentiator\n• Key Theme 3: Shadow AI is a growing compliance risk\nStructured outline with 5 sections prepared.' },
  { id: 2, name: 'Draft', icon: '✍️', color: 'var(--jse-gold)', desc: 'Using the research output, generate a complete first draft following the structural outline.', sampleOutput: 'First Draft (450 words):\nThe gap between AI adoption and AI success has never been wider. While 88% of organizations now use AI tools, only 6% report meaningful revenue impact...\n[Full draft following the 5-section outline from Research step]' },
  { id: 3, name: 'Edit', icon: '✂️', color: 'var(--jse-teal)', desc: 'Refine the draft for tone, clarity, and length. Apply negative constraints to eliminate common issues.', sampleOutput: 'Edited Version (380 words):\n- Removed 3 instances of jargon\n- Shortened intro by 40%\n- Added specific statistics\n- Eliminated passive voice\n- Applied brand tone guidelines\nQuality score: 8.2/10' },
  { id: 4, name: 'Repurpose', icon: '🚀', color: 'var(--jse-gold)', desc: 'Transform the edited piece into multiple formats: social posts, email snippet, and summary.', sampleOutput: 'LinkedIn Post (150 words): "88% of organizations use AI. Only 6% see real returns. The difference?..."\n\nTwitter Thread (5 tweets): "1/ The AI adoption paradox is real..."\n\nEmail Newsletter Snippet (100 words): "This week: why AI adoption isn\'t the same as AI success..."\n\nExecutive Summary (50 words): Concise version for board packet.' },
];

export default function ChainBuilder({ markComplete }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-6" data-testid="chain-builder-exercise">
      <SectionHeader eyebrow="TIER 1 — PROMPT MASTERY" title="Chain Builder" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Visualize how output flows between prompt chain steps. Click each step to see how one prompt's output feeds the next.</p>
      {/* Chain Visualization */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {CHAIN_STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <button onClick={() => setActiveStep(i)} className={`flex flex-col items-center p-4 rounded-xl transition-colors duration-200 ${activeStep === i ? 'teal-pulse' : ''}`} style={{ background: activeStep === i ? 'var(--jse-card)' : 'transparent', border: activeStep === i ? `2px solid ${step.color}` : '2px solid transparent', minWidth: '100px' }}>
              <span className="text-2xl mb-1">{step.icon}</span>
              <span className="mono-label" style={{ color: step.color, fontSize: '0.6rem' }}>STEP {step.id}</span>
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--jse-text)' }}>{step.name}</span>
            </button>
            {i < CHAIN_STEPS.length - 1 && <ArrowRight size={20} style={{ color: 'var(--jse-muted)' }} />}
          </React.Fragment>
        ))}
      </div>
      {/* Step Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="exercise-card">
          <div className="mono-label mb-2" style={{ color: CHAIN_STEPS[activeStep].color, fontSize: '0.6rem' }}>STEP {CHAIN_STEPS[activeStep].id}: {CHAIN_STEPS[activeStep].name.toUpperCase()}</div>
          <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{CHAIN_STEPS[activeStep].desc}</p>
          {activeStep > 0 && (
            <div className="mt-3 p-2 rounded-lg" style={{ background: 'rgba(0,180,196,0.08)', border: '1px solid var(--jse-teal-dark)' }}>
              <span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.55rem' }}>INPUT: Output from Step {activeStep}</span>
            </div>
          )}
        </div>
        <div className="exercise-card" style={{ background: 'var(--jse-bg)' }}>
          <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>SAMPLE OUTPUT</div>
          <pre className="text-xs whitespace-pre-wrap" style={{ color: 'var(--jse-text)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{CHAIN_STEPS[activeStep].sampleOutput}</pre>
        </div>
      </div>
      <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}>
        <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>✦ KEY INSIGHT</div>
        <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>A prompt chain is a sequence where the output of one prompt becomes the input of the next. This is how professionals scale content creation: one piece of research becomes a blog post, which becomes social media content, email newsletters, and executive summaries — all through connected prompts.</p>
      </div>
    </div>
  );
}
