import React from 'react';

export default function SectionHeader({ eyebrow, title }) {
  return (
    <div className="section-header" data-testid="section-title">
      {eyebrow && <div className="eyebrow" data-testid="section-eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      <div className="gold-rule" data-testid="section-title-divider" />
    </div>
  );
}
