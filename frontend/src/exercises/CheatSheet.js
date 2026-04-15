import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { ChevronDown, ChevronRight } from 'lucide-react';

const CHEAT_SECTIONS = [
  { title: 'Prompt Architecture', items: [
    { name: 'RACE Framework', content: 'Role + Action + Context + Expectation. The foundation of every effective prompt. Always start here.' },
    { name: 'Bento Box Method', content: 'Structure complex requests into compartmentalized sections. Each box contains one specific requirement. Prevents cognitive overload for the AI.' },
    { name: 'Chain of Thought', content: 'Ask AI to "think step by step" before answering. Improves accuracy by 40%+ on complex reasoning tasks.' },
    { name: 'Negative Constraints', content: 'Tell AI what NOT to do. "Do NOT use jargon" is more powerful than "use simple language." 3-5 negative constraints minimum.' },
  ]},
  { title: 'The Contract Format', items: [
    { name: '1. Role', content: 'One line. Who the AI fundamentally is. Specific expertise, experience level, audience awareness.' },
    { name: '2. Success Criteria', content: 'What "done" looks like. The most underused element. Define what makes the output usable without editing.' },
    { name: '3. Constraints', content: 'Always do / never do rules. Include negative constraints. 3-5 minimum. These are your quality guardrails.' },
    { name: '4. Uncertainty Handling', content: 'How to behave when unsure. "If uncertain, say so explicitly. Never guess." Prevents hallucination.' },
    { name: '5. Output Format', content: 'Structure, length, tone, examples. Be relentlessly specific. "300 words, 3 sections, executive tone."' },
  ]},
  { title: 'Constraint Cascade (5 Layers)', items: [
    { name: 'Layer 1: Identity', content: 'Who the AI fundamentally is. Set once, persists forever. "You are a warm, authoritative expert..."' },
    { name: 'Layer 2: Behavioral', content: 'How the AI acts in every interaction. Always/Never rules. Persistent across conversations.' },
    { name: 'Layer 3: Knowledge', content: 'What the AI knows about your specific context. Company, audience, brand, domain expertise.' },
    { name: 'Layer 4: Task', content: 'What the AI does in this specific interaction. Apply RACE framework here.' },
    { name: 'Layer 5: Output', content: 'What the result looks like. Format, length, tone, exclusions. The final shaping layer.' },
  ]},
  { title: 'Verification Methods', items: [
    { name: 'RSIP (Iterative Improvement)', content: 'Generate → Critique (rotating criteria) → Improve → Repeat. Each pass: Accuracy, Clarity, Completeness.' },
    { name: 'Bicameral Pipeline', content: 'ORSN (creative generation) → STDIO (rigorous verification). Two separate AI personas, one for creation, one for quality control.' },
    { name: 'Council of Experts', content: '4 perspectives on any decision: Optimist, Skeptic, Strategist, Community Voice. Forces comprehensive analysis.' },
    { name: 'Fact-Check Workflow', content: 'Claim → Source Verify → Cross-Reference → Confidence Assessment → Document Result. 5 steps to truth.' },
  ]},
  { title: 'Platform Quick Reference', items: [
    { name: 'Custom GPT', content: '800-char instructions, 20-file knowledge, API actions, GPT Store. Best for: tools needing external connections.' },
    { name: 'Claude Project', content: '500+ line instructions, project knowledge, 30+ skills. Best for: deep customization, teams, brand voice.' },
    { name: 'Gemini Gem', content: 'Quick setup, Drive integration, Workspace native. Best for: Google ecosystem teams.' },
  ]},
];

export default function CheatSheet() {
  const [expanded, setExpanded] = useState({});
  const toggle = (section) => setExpanded(prev => ({ ...prev, [section]: !prev[section] }));

  return (
    <div className="space-y-6" data-testid="cheat-sheet-exercise">
      <SectionHeader eyebrow="TIER 3 — DIRECTOR'S BUNDLE" title="Director's Cheat Sheet" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Your interactive reference for every framework, method, and technique. Click to expand sections.</p>
      <div className="space-y-3">
        {CHEAT_SECTIONS.map((section, si) => (
          <div key={si} className="exercise-card">
            <button onClick={() => toggle(si)} className="w-full flex items-center justify-between">
              <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{section.title}</h3>
              {expanded[si] ? <ChevronDown size={18} style={{ color: 'var(--jse-gold)' }} /> : <ChevronRight size={18} style={{ color: 'var(--jse-muted)' }} />}
            </button>
            {expanded[si] && (
              <div className="mt-4 space-y-3">
                {section.items.map((item, ii) => (
                  <div key={ii} className="pl-3" style={{ borderLeft: '2px solid var(--jse-teal-deep)' }}>
                    <div className="mono-label mb-1" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>{item.name}</div>
                    <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
