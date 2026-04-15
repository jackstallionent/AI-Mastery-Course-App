import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const BROKEN_PROMPTS = [
  { id: 1, broken: 'Help me with my project about AI.', issue: 'Missing Role, vague Action, no Context, no Expectation', hints: ['Add a specific Role', 'Replace "help" with a precise action verb', 'Add audience and situation Context', 'Specify output format and constraints'], sampleFix: 'You are a technology journalist with 10 years of experience. Write a 500-word analysis of how AI is transforming small business operations for an audience of non-technical business owners. Format as 3 sections with headers. Do NOT use jargon.' },
  { id: 2, broken: 'Write something about climate change.', issue: 'No Role, vague Action ("something"), no Context, no Expectation', hints: ['Define who the AI should be', 'Specify what exactly to write', 'Add audience and purpose', 'Define format, length, and constraints'], sampleFix: 'You are an environmental scientist. Draft a 300-word policy brief on the economic impact of climate change for state legislators. Include 3 actionable recommendations. Tone: authoritative. Do NOT use emotional language.' },
  { id: 3, broken: 'Can you look at this data and tell me what you think?', issue: 'No Role, vague Action ("look at"), no specific Context, no output Expectation', hints: ['Assign an analyst role', 'Replace "look at" and "tell me what you think" with specific verbs', 'Describe the data and analysis goal', 'Specify the output structure'], sampleFix: 'You are a senior financial analyst. Analyze the Q3 revenue data I\'ll provide and identify the top 3 growth trends and 2 areas of concern. Present as a table with columns: Finding, Evidence, Recommendation. Do NOT speculate beyond the data.' },
  { id: 4, broken: 'Make a good presentation about our new product.', issue: 'No Role, vague quality ("good"), no Context about the product, no Expectation for structure', hints: ['Define the presenter\'s expertise', 'Specify the product and key features', 'Add audience and occasion', 'Define slide count, structure, and tone'], sampleFix: 'You are a product marketing director. Create a 10-slide presentation outline for our new project management SaaS tool targeting enterprise CTOs. Include: problem statement, solution overview, 3 key features, competitive advantage, pricing, and CTA. Tone: confident, data-driven. Do NOT use clip art descriptions.' },
  { id: 5, broken: 'Assist me in understanding machine learning better.', issue: 'No Role, passive Action ("assist"), no Context about current knowledge, no Expectation', hints: ['Assign a teacher role with specific expertise', 'Replace "assist" with active learning actions', 'Specify your current knowledge level', 'Define format and depth of explanation'], sampleFix: 'You are a patient computer science professor. Explain the 3 main types of machine learning (supervised, unsupervised, reinforcement) to someone with no technical background. Use everyday analogies. Format: one paragraph per type, then a summary table. Do NOT use mathematical notation.' },
];

export default function PromptDebugger({ updateScore, markComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userFix, setUserFix] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [scores, setLocalScores] = useState([]);
  const [finished, setFinished] = useState(false);

  const current = BROKEN_PROMPTS[currentIdx];

  const gradePrompt = () => {
    let score = 0;
    const lower = userFix.toLowerCase();
    if (/you are|as a|role:/.test(lower)) score += 25;
    if (/analyze|write|create|draft|explain|compare|evaluate/.test(lower)) score += 25;
    if (/audience|for |context|background|situation/.test(lower)) score += 25;
    if (/format|words|tone|do not|don't|structure/.test(lower)) score += 25;
    return score;
  };

  const handleSubmit = () => {
    const score = gradePrompt();
    setLocalScores(prev => [...prev, score]);
    setShowSample(true);
  };

  const handleNext = () => {
    if (currentIdx < BROKEN_PROMPTS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setUserFix('');
      setShowHints(false);
      setShowSample(false);
    } else {
      setFinished(true);
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      if (updateScore) updateScore('prompt-debugger', avg);
      if (avg >= 75 && markComplete) markComplete('prompt-debugger');
    }
  };

  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="space-y-6" data-testid="prompt-debugger-exercise">
      <SectionHeader eyebrow="TIER 1 — PROMPT MASTERY" title="Prompt Debugger" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Fix 5 broken prompts using the RACE framework. Your fixes are graded on whether they include all 4 elements.</p>
      {!finished ? (
        <>
          <div className="flex items-center justify-between">
            <span className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.6rem' }}>PROMPT {currentIdx + 1} OF {BROKEN_PROMPTS.length}</span>
            <span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>AVG SCORE: {avg}%</span>
          </div>
          <div className="exercise-card" style={{ borderLeft: '3px solid rgba(220,50,50,0.5)' }}>
            <div className="mono-label mb-2" style={{ color: '#dc3232', fontSize: '0.6rem' }}>BROKEN PROMPT</div>
            <p className="text-sm" style={{ color: 'var(--jse-text)' }}>"{current.broken}"</p>
            <div className="mono-label mt-2" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>ISSUE: {current.issue}</div>
          </div>
          <div>
            <label className="mono-label block mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>YOUR FIXED PROMPT</label>
            <textarea value={userFix} onChange={e => setUserFix(e.target.value)} placeholder="Rewrite this prompt using all 4 RACE elements..." className="jse-textarea" rows={5} data-testid="prompt-input" />
          </div>
          {!showHints && <button onClick={() => setShowHints(true)} className="jse-btn-secondary text-xs">Show Hints</button>}
          {showHints && (
            <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}>
              <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>HINTS</div>
              <ul className="space-y-1">{current.hints.map((h, i) => <li key={i} className="text-xs" style={{ color: 'var(--jse-text)' }}>✦ {h}</li>)}</ul>
            </div>
          )}
          {showSample && (
            <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-teal)' }}>
              <div className="mono-label mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>SAMPLE FIX (SCORE: {scores[scores.length - 1]}%)</div>
              <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{current.sampleFix}</p>
            </div>
          )}
          <div className="flex gap-3">
            {!showSample && <button onClick={handleSubmit} className="jse-btn-teal" disabled={userFix.length < 20} data-testid="primary-action-button">Submit Fix</button>}
            {showSample && <button onClick={handleNext} className="jse-btn-gold" data-testid="primary-action-button">{currentIdx < BROKEN_PROMPTS.length - 1 ? 'Next Prompt' : 'See Results'}</button>}
          </div>
        </>
      ) : (
        <div className="exercise-card text-center" style={{ border: '1px solid var(--jse-gold-dark)' }}>
          <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>FINAL AVERAGE</div>
          <div className="jse-score" style={{ color: avg >= 75 ? 'var(--jse-gold)' : 'var(--jse-teal)' }} data-testid="challenge-score">{avg}%</div>
          <button onClick={() => { setCurrentIdx(0); setUserFix(''); setShowHints(false); setShowSample(false); setLocalScores([]); setFinished(false); }} className="jse-btn-teal mt-4">Try Again</button>
        </div>
      )}
    </div>
  );
}
