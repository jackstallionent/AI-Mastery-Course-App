import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const LEVELS = [
  {
    level: 0,
    score: 12,
    prompt: 'Write about AI.',
    explanation: 'Zero constraints. The AI has infinite directions to go. Output will be generic, unfocused, and essentially useless for any specific purpose.'
  },
  {
    level: 1,
    score: 34,
    prompt: 'Write a professional article about AI for business leaders.',
    explanation: 'Added audience and format. The AI now knows WHO it is writing for and WHAT format. Output improves but remains broad.'
  },
  {
    level: 2,
    score: 58,
    prompt: 'Write a 500-word professional article about AI adoption challenges for small business owners who are skeptical about technology investments.',
    explanation: 'Added length, specificity about the topic, and audience psychology. The probability space has collapsed significantly.'
  },
  {
    level: 3,
    score: 78,
    prompt: 'You are a business technology consultant with 15 years of experience. Write a 500-word article about the three biggest AI adoption challenges facing small business owners who are skeptical about technology investments. Use real statistics. Include actionable next steps. Tone: authoritative but warm.',
    explanation: 'Full RACE framework applied: Role, Action, Context, Expectation. The output is now focused, credible, and useful.'
  },
  {
    level: 4,
    score: 96,
    prompt: 'You are a business technology consultant with 15 years of experience advising companies under $10M revenue. Write a 500-word article about the three biggest AI adoption challenges facing small business owners who are skeptical about technology investments. Use real statistics from McKinsey or Gartner. Include actionable next steps with estimated costs. Tone: authoritative but warm. Do NOT use jargon. Do NOT use bullet points — use narrative prose. Do NOT mention ChatGPT by name. Structure: Hook, three challenges with solutions, call to action.',
    explanation: 'Maximum constraint satisfaction. Negative constraints eliminate common AI failures. Structural requirements ensure quality. This is what Director-level prompting looks like.'
  },
];

export default function ConstraintSlider({ updateScore, markComplete }) {
  const [activeLevel, setActiveLevel] = useState(0);
  const current = LEVELS[activeLevel];

  return (
    <div className="space-y-6" data-testid="constraint-slider-exercise">
      <SectionHeader eyebrow="TIER 0 — FREE PREVIEW" title="The Constraint Slider" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>
        Slide through 5 constraint levels and watch the quality score climb from 12 to 96.
        Each level adds more structure to the same basic prompt.
      </p>

      {/* Level Selector */}
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map((l) => (
          <button
            key={l.level}
            onClick={() => setActiveLevel(l.level)}
            className={`px-4 py-2 rounded-xl text-sm transition-colors duration-150 ${activeLevel === l.level ? '' : 'hover:bg-white/5'}`}
            style={{
              background: activeLevel === l.level ? 'var(--jse-teal)' : 'var(--jse-card)',
              color: activeLevel === l.level ? 'var(--jse-bg)' : 'var(--jse-text)',
              border: `1px solid ${activeLevel === l.level ? 'var(--jse-teal)' : 'rgba(255,255,255,0.08)'}`,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem'
            }}
            data-testid={`constraint-level-${l.level}`}
          >
            Level {l.level}
          </button>
        ))}
      </div>

      {/* Quality Score */}
      <div className="exercise-card">
        <div className="flex items-center justify-between mb-4">
          <div className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>QUALITY SCORE</div>
          <div className="jse-score score-bump" style={{ color: current.score > 70 ? 'var(--jse-gold)' : current.score > 40 ? 'var(--jse-teal)' : 'var(--jse-muted)' }} data-testid="challenge-score">
            {current.score}/100
          </div>
        </div>
        <div className="jse-progress">
          <div
            className="jse-progress-fill"
            style={{
              width: `${current.score}%`,
              background: current.score > 70 ? 'var(--jse-gold)' : current.score > 40 ? 'var(--jse-teal)' : 'var(--jse-muted)',
            }}
          />
        </div>
      </div>

      {/* Prompt Display */}
      <div className="exercise-card">
        <div className="mono-label mb-3" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>CONSTRAINT LEVEL {current.level} PROMPT</div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--jse-bg)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.8, fontFamily: 'var(--font-body)' }}>
            {current.prompt}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}>
        <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>WHAT CHANGED</div>
        <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{current.explanation}</p>
      </div>

      {/* Key Insight */}
      {activeLevel === 4 && (
        <div className="exercise-card" style={{ background: 'rgba(201,168,76,0.08)', borderColor: 'var(--jse-gold-dark)' }}>
          <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>✦ KEY INSIGHT</div>
          <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>
            "The enemy of art is the absence of limitations." More constraints = more precision.
            Specificity collapses the AI's probability space into precision. This is Constraint Satisfaction
            — the single most powerful concept in AI mastery.
          </p>
        </div>
      )}
    </div>
  );
}
