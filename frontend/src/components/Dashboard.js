import React from 'react';
import { TIERS } from '../data/tierConfig';
import { ArrowRight, Lock, Star, Zap, Trophy } from 'lucide-react';
import SectionHeader from './SectionHeader';

export default function Dashboard({ unlockedTiers, completedExercises, scores, onNavigate, isAdmin }) {
  const totalExercises = TIERS.reduce((sum, t) => sum + t.exercises.length, 0);
  const totalCompleted = completedExercises.length;
  const progressPercent = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;

  // Find next recommended exercise
  const getNextExercise = () => {
    for (const tier of TIERS) {
      if (!unlockedTiers.includes(tier.id)) continue;
      for (const ex of tier.exercises) {
        if (!completedExercises.includes(ex.id)) return { ...ex, tierName: tier.name };
      }
    }
    return null;
  };
  const nextExercise = getNextExercise();

  return (
    <div className="space-y-10">
      {/* Welcome Hero */}
      <div className="card-reveal">
        <div className="mono-label mb-3" style={{ color: 'var(--jse-gold)' }}>WELCOME TO</div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--jse-text)' }}>
          AI Mastery Companion
        </h1>
        <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--jse-muted)', lineHeight: 1.8 }}>
          Your interactive guide to mastering AI. From fundamentals to enterprise strategy —
          every exercise builds your intuition, sharpens your skills, and proves your mastery.
        </p>
        <div className="gold-rule" />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Star size={18} />} label="EXERCISES COMPLETED" value={`${totalCompleted}/${totalExercises}`} color="var(--jse-gold)" />
        <StatCard icon={<Zap size={18} />} label="TIERS UNLOCKED" value={`${unlockedTiers.length}/5`} color="var(--jse-teal)" />
        <StatCard icon={<Trophy size={18} />} label="PROGRESS" value={`${progressPercent}%`} color="var(--jse-gold)">
          <div className="jse-progress mt-2">
            <div className="jse-progress-fill" style={{ width: `${progressPercent}%`, background: 'var(--jse-teal)' }} />
          </div>
        </StatCard>
      </div>

      {/* Next Recommended */}
      {nextExercise && (
        <div>
          <SectionHeader eyebrow="RECOMMENDED NEXT" title="Continue Your Journey" />
          <button
            onClick={() => onNavigate(nextExercise.id)}
            className="exercise-card w-full text-left flex items-center justify-between group mt-4"
            data-testid="recommended-exercise"
          >
            <div>
              <div className="mono-label mb-1" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>{nextExercise.tierName}</div>
              <div className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{nextExercise.name}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--jse-muted)' }}>{nextExercise.desc}</div>
            </div>
            <ArrowRight size={20} style={{ color: 'var(--jse-teal)' }} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Tier Cards */}
      <div>
        <SectionHeader eyebrow="COURSE TIERS" title="Your Learning Path" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {TIERS.map((tier, i) => {
            const isUnlocked = unlockedTiers.includes(tier.id);
            const tierDone = tier.exercises.filter(e => completedExercises.includes(e.id)).length;
            return (
              <div
                key={tier.id}
                className="exercise-card card-reveal"
                style={{ animationDelay: `${i * 0.07}s` }}
                data-testid={`tier-card-${tier.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="mono-label" style={{ color: tier.color, fontSize: '0.6rem' }}>TIER {tier.id}</span>
                  <span className="mono-label" style={{ color: isUnlocked ? 'var(--jse-teal)' : 'var(--jse-gold)', fontSize: '0.65rem' }}>
                    {isUnlocked ? 'UNLOCKED' : tier.priceLabel}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{tier.name}</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--jse-muted)', lineHeight: 1.6 }}>{tier.description}</p>
                <div className="jse-progress mb-2">
                  <div className="jse-progress-fill" style={{ width: `${(tierDone / tier.exercises.length) * 100}%`, background: tier.color }} />
                </div>
                <div className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>
                  {tierDone}/{tier.exercises.length} EXERCISES
                </div>
                {isUnlocked && (
                  <div className="mt-4 space-y-1">
                    {tier.exercises.slice(0, 3).map(ex => (
                      <button
                        key={ex.id}
                        onClick={() => onNavigate(ex.id)}
                        className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        {completedExercises.includes(ex.id) ?
                          <CheckMark /> : <div className="w-2 h-2 rounded-full" style={{ background: tier.color }} />
                        }
                        <span className="text-xs" style={{ color: 'var(--jse-text)' }}>{ex.name}</span>
                      </button>
                    ))}
                    {tier.exercises.length > 3 && (
                      <div className="mono-label pl-6" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>+{tier.exercises.length - 3} MORE</div>
                    )}
                  </div>
                )}
                {!isUnlocked && (
                  <a
                    href={tier.payhipUrl || '#'}
                    target="_blank" rel="noopener noreferrer"
                    className="jse-btn-gold mt-4 w-full text-center block text-xs"
                    data-testid="paywall-unlock-button"
                  >
                    Unlock {tier.name} — {tier.priceLabel}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, children }) {
  return (
    <div className="exercise-card">
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>{label}</span>
      </div>
      <div className="jse-score" style={{ color, fontSize: '1.5rem' }}>{value}</div>
      {children}
    </div>
  );
}

function CheckMark() {
  return <div className="w-2 h-2 rounded-full" style={{ background: 'var(--jse-teal)' }} />;
}
