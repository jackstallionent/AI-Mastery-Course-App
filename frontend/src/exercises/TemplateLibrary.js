import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Copy, CheckCircle2 } from 'lucide-react';

const TEMPLATES = [
  { id: 1, name: 'Email Response', category: 'Daily', fields: [{ key: 'tone', label: 'Tone', placeholder: 'professional, casual, formal' }, { key: 'context', label: 'Context', placeholder: 'client complaint, follow-up, introduction' }, { key: 'length', label: 'Length', placeholder: '100 words, 3 paragraphs' }], template: 'You are a professional communicator. Write a {tone} email response regarding {context}. Keep it to {length}. Do NOT use buzzwords. Do NOT be overly apologetic.' },
  { id: 2, name: 'Blog Post Outline', category: 'Creative', fields: [{ key: 'topic', label: 'Topic', placeholder: 'AI in healthcare, remote work tips' }, { key: 'audience', label: 'Audience', placeholder: 'executives, students, developers' }, { key: 'angle', label: 'Unique Angle', placeholder: 'contrarian take, data-driven, storytelling' }], template: 'You are a content strategist. Create a detailed blog post outline about {topic} for {audience}. Take a {angle} approach. Include 5 sections with subpoints. Do NOT use generic headings.' },
  { id: 3, name: 'Data Analysis', category: 'Analytical', fields: [{ key: 'dataset', label: 'Dataset', placeholder: 'quarterly sales, survey results' }, { key: 'goal', label: 'Analysis Goal', placeholder: 'identify trends, find anomalies' }, { key: 'format', label: 'Output Format', placeholder: 'table, narrative, bullet points' }], template: 'You are a senior data analyst. Analyze {dataset} to {goal}. Present findings as {format}. Include statistical significance where relevant. Do NOT fabricate numbers.' },
  { id: 4, name: 'Meeting Summary', category: 'Daily', fields: [{ key: 'type', label: 'Meeting Type', placeholder: 'board meeting, standup, client call' }, { key: 'key_topics', label: 'Key Topics', placeholder: 'budget review, product launch' }, { key: 'recipients', label: 'Recipients', placeholder: 'team, executives, clients' }], template: 'Summarize this {type} covering {key_topics} for {recipients}. Structure: Key Decisions, Action Items (with owners and deadlines), Open Questions. Do NOT editorialize. Do NOT exceed 300 words.' },
  { id: 5, name: 'Product Description', category: 'Creative', fields: [{ key: 'product', label: 'Product', placeholder: 'SaaS tool, physical product' }, { key: 'benefit', label: 'Key Benefit', placeholder: 'saves time, increases revenue' }, { key: 'tone', label: 'Brand Tone', placeholder: 'luxury, playful, technical' }], template: 'Write a compelling product description for {product} emphasizing {benefit}. Adopt a {tone} brand voice. Include a headline, 100-word description, and 3 feature bullets. Do NOT use superlatives.' },
  { id: 6, name: 'Competitive Analysis', category: 'Analytical', fields: [{ key: 'company', label: 'Company/Product', placeholder: 'your product name' }, { key: 'competitors', label: 'Competitors', placeholder: 'competitor A, competitor B' }, { key: 'criteria', label: 'Evaluation Criteria', placeholder: 'pricing, features, market share' }], template: 'Compare {company} against {competitors} on {criteria}. Create a structured comparison matrix. Identify gaps and opportunities. Do NOT show bias toward any company.' },
  { id: 7, name: 'Training Material', category: 'Daily', fields: [{ key: 'topic', label: 'Topic', placeholder: 'onboarding, compliance, software' }, { key: 'level', label: 'Audience Level', placeholder: 'beginner, intermediate, expert' }, { key: 'format', label: 'Format', placeholder: 'step-by-step guide, FAQ, scenario-based' }], template: 'Create {format} training material about {topic} for {level} learners. Include practical examples. Use clear headings and numbered steps where appropriate. Do NOT assume prior knowledge beyond the stated level.' },
  { id: 8, name: 'Social Media Post', category: 'Creative', fields: [{ key: 'platform', label: 'Platform', placeholder: 'LinkedIn, Twitter/X, Instagram' }, { key: 'topic', label: 'Topic', placeholder: 'industry insight, company news' }, { key: 'cta', label: 'Call to Action', placeholder: 'comment, share, visit link' }], template: 'Write a {platform} post about {topic} with a clear {cta}. Match the platform\'s native tone and length expectations. Do NOT use hashtag spam. Do NOT use emojis excessively.' },
  { id: 9, name: 'Problem Solver', category: 'Analytical', fields: [{ key: 'problem', label: 'Problem', placeholder: 'declining retention, slow processes' }, { key: 'constraints', label: 'Constraints', placeholder: 'limited budget, 2-week timeline' }, { key: 'success', label: 'Success Metric', placeholder: '20% improvement, user satisfaction' }], template: 'Analyze {problem} given {constraints}. Propose 3 solutions ranked by likelihood of achieving {success}. For each: implementation steps, timeline, risks, and mitigation. Do NOT suggest solutions requiring resources beyond stated constraints.' },
  { id: 10, name: 'Executive Brief', category: 'Daily', fields: [{ key: 'topic', label: 'Topic', placeholder: 'AI strategy, market entry' }, { key: 'decision', label: 'Decision Needed', placeholder: 'approve budget, choose vendor' }, { key: 'audience', label: 'Audience', placeholder: 'CEO, board, investors' }], template: 'Create an executive brief on {topic} for {audience} to support the decision: {decision}. Structure: Situation (2 sentences), Options (3 max), Recommendation (1 clear choice), Next Steps. Do NOT exceed 400 words. Do NOT hedge.' },
];

export default function TemplateLibrary({ markComplete }) {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [copied, setCopied] = useState(false);

  const selectTemplate = (t) => {
    setActiveTemplate(t);
    setFieldValues({});
    setCopied(false);
  };

  const generatePrompt = () => {
    if (!activeTemplate) return '';
    let prompt = activeTemplate.template;
    activeTemplate.fields.forEach(f => { prompt = prompt.replace(`{${f.key}}`, fieldValues[f.key] || `[${f.label}]`); });
    return prompt;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [...new Set(TEMPLATES.map(t => t.category))];

  return (
    <div className="space-y-6" data-testid="template-library-exercise">
      <SectionHeader eyebrow="TIER 1 — PROMPT MASTERY" title="Prompt Template Library" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>10 interactive templates with fill-in variables. Select a template, fill in the fields, and copy the ready-to-use prompt.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat}>
              <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>{cat.toUpperCase()}</div>
              {TEMPLATES.filter(t => t.category === cat).map(t => (
                <button key={t.id} onClick={() => selectTemplate(t)} className={`w-full text-left p-3 rounded-xl mb-1 transition-colors duration-150 ${activeTemplate?.id === t.id ? '' : 'hover:bg-white/5'}`} style={{ background: activeTemplate?.id === t.id ? 'var(--jse-teal-deep)' : 'transparent', border: activeTemplate?.id === t.id ? '1px solid var(--jse-teal-dark)' : '1px solid transparent' }}>
                  <span className="text-sm" style={{ color: activeTemplate?.id === t.id ? 'var(--jse-teal)' : 'var(--jse-text)' }}>{t.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 space-y-4">
          {activeTemplate ? (
            <>
              <div className="exercise-card">
                <div className="mono-label mb-3" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>FILL IN VARIABLES</div>
                <div className="space-y-3">
                  {activeTemplate.fields.map(f => (
                    <div key={f.key}>
                      <label className="mono-label block mb-1" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>{f.label}</label>
                      <input type="text" value={fieldValues[f.key] || ''} onChange={e => setFieldValues(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="jse-input" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="exercise-card" style={{ background: 'var(--jse-bg)' }}>
                <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>GENERATED PROMPT</div>
                <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--jse-text)', lineHeight: 1.8 }}>{generatePrompt()}</p>
              </div>
              <button onClick={handleCopy} className="jse-btn-teal flex items-center gap-2" data-testid="primary-action-button">
                {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy Prompt</>}
              </button>
            </>
          ) : (
            <div className="exercise-card text-center py-12"><p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Select a template from the left to get started</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
