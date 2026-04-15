import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Loader2, Sun, Shield, Target, Users } from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || '';
const ICONS = { sun: Sun, shield: Shield, target: Target, users: Users };

export default function CouncilOfExperts({ markComplete }) {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!question.trim() || question.length < 5) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/council`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data.data);
      if (markComplete) markComplete('council-of-experts');
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const perspectives = result ? ['optimist', 'skeptic', 'strategist', 'community'] : [];
  const colors = { optimist: 'var(--jse-gold)', skeptic: '#dc3232', strategist: 'var(--jse-teal)', community: 'var(--jse-gold-light)' };

  return (
    <div className="space-y-6" data-testid="council-of-experts-exercise">
      <SectionHeader eyebrow="TIER 2 — DEMYSTIFYING AI" title="Council of Experts" />
      <div className="flex items-center gap-2"><span className="mono-label px-2 py-0.5 rounded" style={{ background: 'rgba(0,180,196,0.15)', color: 'var(--jse-teal)', fontSize: '0.55rem' }}>LIVE AI</span><span className="text-sm" style={{ color: 'var(--jse-muted)' }}>Powered by Claude</span></div>
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Type any decision or question. The Council will analyze it from four expert perspectives and provide a balanced synthesis.</p>
      <div>
        <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g., Should our company invest in building a custom AI solution or use existing SaaS tools?" className="jse-textarea" rows={3} data-testid="prompt-input" />
        <button onClick={handleSubmit} disabled={loading || question.length < 5} className="jse-btn-teal mt-3 flex items-center gap-2" data-testid="primary-action-button">
          {loading ? <><Loader2 size={14} className="animate-spin" /> Convening the Council...</> : 'Convene the Council'}
        </button>
      </div>
      {error && <div className="exercise-card" style={{ borderLeft: '3px solid #dc3232' }}><p className="text-sm" style={{ color: '#dc3232' }}>{error}</p></div>}
      {result && (
        <div className="space-y-4 card-reveal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perspectives.map(key => {
              const p = result[key];
              if (!p) return null;
              const IconComp = ICONS[p.icon] || Users;
              return (
                <div key={key} className="exercise-card" style={{ borderLeft: `3px solid ${colors[key]}` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <IconComp size={16} style={{ color: colors[key] }} />
                    <span className="mono-label" style={{ color: colors[key], fontSize: '0.6rem' }}>{p.title?.toUpperCase() || key.toUpperCase()}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{p.perspective}</p>
                </div>
              );
            })}
          </div>
          {result.synthesis && (
            <div className="exercise-card" style={{ background: 'rgba(201,168,76,0.08)', borderColor: 'var(--jse-gold-dark)' }}>
              <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>✦ BALANCED SYNTHESIS</div>
              <p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{result.synthesis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
