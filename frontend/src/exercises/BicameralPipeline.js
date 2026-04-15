import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Loader2 } from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || '';

export default function BicameralPipeline({ markComplete }) {
  const [draft, setDraft] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    if (!draft.trim() || draft.length < 10) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/bicameral/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft, context: 'professional AI education content' }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data.data);
      if (markComplete) markComplete('bicameral-pipeline');
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="space-y-6" data-testid="bicameral-pipeline-exercise">
      <SectionHeader eyebrow="TIER 3 — DIRECTOR'S BUNDLE" title="Bicameral Pipeline Simulator" />
      <div className="flex items-center gap-2"><span className="mono-label px-2 py-0.5 rounded" style={{ background: 'rgba(0,180,196,0.15)', color: 'var(--jse-teal)', fontSize: '0.55rem' }}>LIVE AI</span><span className="text-sm" style={{ color: 'var(--jse-muted)' }}>ORSN → STDIO Pipeline</span></div>
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Write content (ORSN creative engine), then the STDIO verification layer will score it 1-10 with specific feedback.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--jse-gold)' }} />
            <span className="mono-label" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>ORSN — CREATIVE ENGINE</span>
          </div>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write your content here. Be creative — ORSN doesn't self-censor. Write your first draft, ideas, angles..." className="jse-textarea" rows={8} data-testid="prompt-input" />
          <button onClick={handleVerify} disabled={loading || draft.length < 10} className="jse-btn-teal mt-3 flex items-center gap-2" data-testid="primary-action-button">
            {loading ? <><Loader2 size={14} className="animate-spin" /> Running STDIO Verification...</> : 'Run Through STDIO'}
          </button>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--jse-teal)' }} />
            <span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>STDIO — VERIFICATION LAYER</span>
          </div>
          {error && <div className="exercise-card" style={{ borderLeft: '3px solid #dc3232' }}><p className="text-sm" style={{ color: '#dc3232' }}>{error}</p></div>}
          {result ? (
            <div className="space-y-3 card-reveal">
              <div className="exercise-card text-center" style={{ borderColor: result.pass ? 'var(--jse-teal)' : 'var(--jse-gold-dark)' }}>
                <div className="mono-label mb-1" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>QUALITY SCORE</div>
                <div className="jse-score score-bump" style={{ color: result.pass ? 'var(--jse-teal)' : 'var(--jse-gold)' }} data-testid="challenge-score">{result.score}/10</div>
                <div className="mono-label mt-1" style={{ color: result.pass ? 'var(--jse-teal)' : '#dc3232', fontSize: '0.6rem' }}>{result.pass ? 'PASS — PUBLISHABLE' : 'FAIL — NEEDS REVISION'}</div>
              </div>
              {result.strengths?.length > 0 && <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-teal)' }}><div className="mono-label mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.55rem' }}>STRENGTHS</div>{result.strengths.map((s,i) => <p key={i} className="text-xs mb-1" style={{ color: 'var(--jse-text)' }}>✓ {s}</p>)}</div>}
              {result.violations?.length > 0 && <div className="exercise-card" style={{ borderLeft: '3px solid #dc3232' }}><div className="mono-label mb-2" style={{ color: '#dc3232', fontSize: '0.55rem' }}>VIOLATIONS</div>{result.violations.map((v,i) => <p key={i} className="text-xs mb-1" style={{ color: 'var(--jse-text)' }}>✗ {v}</p>)}</div>}
              {result.fixes?.length > 0 && <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}><div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>RECOMMENDED FIXES</div>{result.fixes.map((f,i) => <p key={i} className="text-xs mb-1" style={{ color: 'var(--jse-text)' }}>✦ {f}</p>)}</div>}
              {result.summary && <div className="exercise-card" style={{ background: 'rgba(201,168,76,0.08)' }}><div className="mono-label mb-1" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>SUMMARY</div><p className="text-sm" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{result.summary}</p></div>}
            </div>
          ) : (
            <div className="exercise-card text-center py-12" style={{ background: 'var(--jse-bg)' }}><p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Write content in ORSN and click "Run Through STDIO" to get your verification score</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
