import React from 'react';
import { Lock } from 'lucide-react';

export default function PaywallGate({ tier }) {
  if (!tier) return null;
  return (
    <div className="max-w-2xl mx-auto py-16" data-testid="paywall-gate">
      {/* Blurred preview */}
      <div className="relative mb-8">
        <div className="paywall-blur space-y-4" data-testid="paywall-blur-preview">
          {tier.exercises.slice(0, 2).map((ex, i) => (
            <div key={i} className="exercise-card">
              <div className="h-4 w-1/3 rounded" style={{ background: 'var(--jse-elev)' }} />
              <div className="h-3 w-2/3 rounded mt-2" style={{ background: 'var(--jse-elev)' }} />
              <div className="h-3 w-1/2 rounded mt-1" style={{ background: 'var(--jse-elev)' }} />
              <div className="h-20 w-full rounded mt-3" style={{ background: 'var(--jse-elev)' }} />
            </div>
          ))}
        </div>
        <div className="paywall-overlay absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Lock size={32} style={{ color: 'var(--jse-gold)' }} className="mx-auto mb-3" />
            <div className="mono-label mb-1" style={{ color: 'var(--jse-gold)', fontSize: '0.65rem' }} data-testid="paywall-tier-name">
              TIER {tier.id} — {tier.name.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Unlock Card */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--jse-elev)', border: '1px solid var(--jse-gold-dark)' }}>
        <div className="text-center">
          <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.65rem' }}>UNLOCK ACCESS</div>
          <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{tier.name}</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--jse-muted)' }}>{tier.description}</p>
          <div className="jse-score mb-4" style={{ color: 'var(--jse-gold)' }} data-testid="paywall-tier-price">{tier.priceLabel}</div>
          <div className="mb-6">
            <div className="mono-label mb-3" style={{ color: 'var(--jse-text)', fontSize: '0.6rem' }}>INCLUDES {tier.exercises.length} EXERCISES</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {tier.exercises.map(ex => (
                <div key={ex.id} className="flex items-start gap-2 text-xs" style={{ color: 'var(--jse-text)' }}>
                  <span style={{ color: 'var(--jse-gold)' }}>✦</span>
                  <span>{ex.name}</span>
                </div>
              ))}
            </div>
          </div>
          {tier.includes && tier.includes.length > 0 && (
            <p className="text-xs mb-4" style={{ color: 'var(--jse-muted)' }}>
              Also includes all content from {tier.includes.map(id => `Tier ${id}`).join(', ')}
            </p>
          )}
          <a
            href={tier.payhipUrl || '#'}
            target="_blank" rel="noopener noreferrer"
            className="jse-btn-gold inline-block px-8 py-3"
            data-testid="paywall-unlock-button"
          >
            Unlock {tier.name} — {tier.priceLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
