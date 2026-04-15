import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import { ChevronDown, ChevronRight } from 'lucide-react';

const DEADLINES = [
  { date: '2026-02-01', name: 'EU AI Act — Prohibited Practices', desc: 'Ban on social scoring, real-time biometric ID (with exceptions), manipulative AI systems.', checklist: ['Audit all AI systems for prohibited use cases', 'Remove any social scoring or biometric ID systems', 'Document compliance for each AI application'], category: 'EU' },
  { date: '2026-06-01', name: 'Colorado AI Act — Impact Assessments', desc: 'Developers and deployers of high-risk AI must conduct impact assessments and notify consumers.', checklist: ['Identify all high-risk AI deployments', 'Conduct AI impact assessments', 'Implement consumer notification process', 'Establish bias testing protocols'], category: 'US State' },
  { date: '2026-08-02', name: 'EU AI Act — General-Purpose AI', desc: 'Obligations for providers of general-purpose AI models including transparency and documentation.', checklist: ['Review all GP-AI model documentation', 'Ensure technical documentation is complete', 'Implement transparency measures', 'Register with EU AI Office if applicable'], category: 'EU' },
  { date: '2026-12-31', name: 'HIPAA AI Update — Healthcare AI', desc: 'Updated guidance on AI use in healthcare including diagnostic AI and patient data handling.', checklist: ['Review all healthcare AI applications', 'Update patient consent processes', 'Ensure AI diagnostic tools meet accuracy standards', 'Train healthcare staff on AI compliance'], category: 'US Federal' },
  { date: '2027-02-02', name: 'EU AI Act — High-Risk AI Systems', desc: 'Full compliance required for high-risk AI in critical infrastructure, education, employment, and law enforcement.', checklist: ['Complete risk classification for all AI systems', 'Implement required quality management systems', 'Set up post-market monitoring', 'Register in EU AI database', 'Appoint authorized representative if needed'], category: 'EU' },
  { date: '2027-06-01', name: 'Expected Federal AI Framework', desc: 'Anticipated comprehensive US federal AI regulation covering transparency, accountability, and safety.', checklist: ['Monitor legislative progress', 'Prepare compliance infrastructure', 'Join industry working groups', 'Budget for compliance resources'], category: 'US Federal' },
];

export default function ComplianceCalendar() {
  const [expanded, setExpanded] = useState(null);
  const [now] = useState(new Date());

  const getDaysUntil = (dateStr) => {
    const d = new Date(dateStr);
    return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  };

  const categoryColors = { 'EU': 'var(--jse-teal)', 'US State': 'var(--jse-gold)', 'US Federal': 'var(--jse-gold-light)' };

  return (
    <div className="space-y-6" data-testid="compliance-calendar-exercise">
      <SectionHeader eyebrow="TIER 4 — ENTERPRISE" title="Compliance Calendar" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>2026-2027 regulatory timeline with countdowns, expandable details, and action checklists.</p>
      <div className="space-y-3">
        {DEADLINES.map((d, i) => {
          const days = getDaysUntil(d.date);
          const urgent = days < 90;
          return (
            <div key={i} className="exercise-card" style={{ borderLeft: `3px solid ${urgent ? 'var(--jse-gold)' : categoryColors[d.category]}` }}>
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="mono-label" style={{ color: categoryColors[d.category], fontSize: '0.55rem' }}>{d.category}</div>
                    <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{d.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="mono-label" style={{ color: urgent ? 'var(--jse-gold)' : 'var(--jse-teal)', fontSize: '0.65rem' }}>{days > 0 ? `${days} DAYS` : 'PASSED'}</span>
                    {expanded === i ? <ChevronDown size={16} style={{ color: 'var(--jse-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--jse-muted)' }} />}
                  </div>
                </div>
                <div className="mono-label mt-1" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>DEADLINE: {new Date(d.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </button>
              {expanded === i && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-sm mb-4" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{d.desc}</p>
                  <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>ACTION CHECKLIST</div>
                  {d.checklist.map((c, ci) => (
                    <label key={ci} className="flex items-start gap-2 mb-2 cursor-pointer">
                      <input type="checkbox" className="mt-0.5 accent-[#00B4C4]" />
                      <span className="text-sm" style={{ color: 'var(--jse-text)' }}>{c}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
