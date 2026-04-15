import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Search } from 'lucide-react';
import { GLOSSARY_FULL, GLOSSARY_CATEGORIES } from '../data/glossaryData';

export default function FullGlossary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedTerm, setExpandedTerm] = useState(null);

  const filtered = GLOSSARY_FULL.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) || item.def.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(GLOSSARY_FULL.map(g => g.category))];

  return (
    <div className="space-y-6" data-testid="full-glossary-exercise">
      <SectionHeader eyebrow="TIER 3 — DIRECTOR'S BUNDLE" title="Full Glossary" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>All {GLOSSARY_FULL.length} terms with detailed explanations and examples.</p>
      <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--jse-muted)' }} /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all terms..." className="jse-input pl-10" data-testid="glossary-search-input" /></div>
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className="px-3 py-1 rounded-lg text-xs" style={{ background: activeCategory === cat ? 'var(--jse-teal-deep)' : 'var(--jse-card)', color: activeCategory === cat ? 'var(--jse-teal)' : 'var(--jse-muted)', border: `1px solid ${activeCategory === cat ? 'var(--jse-teal-dark)' : 'rgba(255,255,255,0.05)'}`, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat === 'all' ? 'All' : GLOSSARY_CATEGORIES[cat] || cat}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(item => (
          <button key={item.term} onClick={() => setExpandedTerm(expandedTerm === item.term ? null : item.term)} className="exercise-card w-full text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.5rem' }}>{(GLOSSARY_CATEGORIES[item.category] || item.category).toUpperCase()}</span>
                <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{item.term}</span>
              </div>
              <span style={{ color: 'var(--jse-muted)' }}>{expandedTerm === item.term ? '−' : '+'}</span>
            </div>
            {expandedTerm === item.term && <p className="text-sm mt-3 pt-3" style={{ color: 'var(--jse-text)', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)' }}>{item.def}</p>}
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center py-8 text-sm" style={{ color: 'var(--jse-muted)' }}>No terms match your search.</p>}
    </div>
  );
}
