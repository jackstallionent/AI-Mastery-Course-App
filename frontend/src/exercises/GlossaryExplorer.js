import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { GLOSSARY_BASIC, GLOSSARY_CATEGORIES } from '../data/glossaryData';
import { Search } from 'lucide-react';

export default function GlossaryExplorer() {
  const [search, setSearch] = useState('');
  const [flipped, setFlipped] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = GLOSSARY_BASIC.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) || item.def.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFlip = (term) => {
    setFlipped(prev => ({ ...prev, [term]: !prev[term] }));
  };

  const categories = ['all', ...new Set(GLOSSARY_BASIC.map(g => g.category))];

  return (
    <div className="space-y-6" data-testid="glossary-exercise">
      <SectionHeader eyebrow="TIER 0 — FREE PREVIEW" title="AI Glossary" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>
        15 essential AI terms. Click a card to flip and reveal the definition.
      </p>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--jse-muted)' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="jse-input pl-10"
          data-testid="glossary-search-input"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1 rounded-lg text-xs transition-colors duration-150"
            style={{
              background: activeCategory === cat ? 'var(--jse-teal-deep)' : 'var(--jse-card)',
              color: activeCategory === cat ? 'var(--jse-teal)' : 'var(--jse-muted)',
              border: `1px solid ${activeCategory === cat ? 'var(--jse-teal-dark)' : 'rgba(255,255,255,0.05)'}`,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            {cat === 'all' ? 'All' : GLOSSARY_CATEGORIES[cat] || cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.term}
            className={`flip-card ${flipped[item.term] ? 'flipped' : ''}`}
            onClick={() => toggleFlip(item.term)}
            style={{ minHeight: '160px' }}
            data-testid="glossary-flip-card"
          >
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front exercise-card flex flex-col justify-center items-center text-center p-5">
                <div className="mono-label mb-2" style={{ color: 'var(--jse-teal)', fontSize: '0.55rem' }}>
                  {GLOSSARY_CATEGORIES[item.category] || item.category}
                </div>
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--jse-text)' }}>
                  {item.term}
                </h3>
                <div className="mono-label mt-3" style={{ color: 'var(--jse-muted)', fontSize: '0.5rem' }}>TAP TO REVEAL</div>
              </div>
              {/* Back */}
              <div className="flip-card-back exercise-card flex flex-col justify-center p-5" style={{ background: 'var(--jse-elev)', borderColor: 'var(--jse-teal-dark)' }}>
                <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>{item.term.toUpperCase()}</div>
                <p className="text-xs" style={{ color: 'var(--jse-text)', lineHeight: 1.7 }}>{item.def}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-8 text-sm" style={{ color: 'var(--jse-muted)' }}>No terms match your search.</p>
      )}
    </div>
  );
}
