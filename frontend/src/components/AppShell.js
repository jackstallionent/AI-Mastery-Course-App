import React, { useState } from 'react';
import { Lock, CheckCircle2, Menu, X, Sparkles, LayoutDashboard } from 'lucide-react';
import { TIERS } from '../data/tierConfig';

export default function AppShell({ children, unlockedTiers, isAdmin, completedExercises, scores, onNavigate, onDashboard }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--jse-bg)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] min-h-screen border-r border-white/5" style={{ background: 'var(--jse-bg-alt)' }}>
        <SidebarContent
          unlockedTiers={unlockedTiers}
          isAdmin={isAdmin}
          completedExercises={completedExercises}
          onNavigate={(id) => { onNavigate(id); setSidebarOpen(false); }}
          onDashboard={() => { onDashboard(); setSidebarOpen(false); }}
        />
      </aside>

      {/* Mobile Header + Drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4 border-b border-white/5" style={{ background: 'var(--jse-bg-alt)' }}>
        <button onClick={() => setSidebarOpen(true)} data-testid="mobile-nav-open-button" className="p-2 rounded-lg hover:bg-white/5">
          <Menu size={20} style={{ color: 'var(--jse-text)' }} />
        </button>
        <div className="flex-1 text-center">
          <span className="mono-label" style={{ color: 'var(--jse-gold)', fontSize: '0.65rem' }}>JSE AI MASTERY</span>
        </div>
        {isAdmin && <span className="mono-label px-2 py-0.5 rounded" style={{ background: 'var(--jse-gold)', color: 'var(--jse-bg)', fontSize: '0.55rem' }}>ADMIN</span>}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-[280px] min-h-screen overflow-y-auto" style={{ background: 'var(--jse-bg-alt)' }}>
            <button onClick={() => setSidebarOpen(false)} data-testid="mobile-nav-close-button" className="absolute top-4 right-4 p-1 rounded hover:bg-white/5">
              <X size={18} style={{ color: 'var(--jse-muted)' }} />
            </button>
            <SidebarContent
              unlockedTiers={unlockedTiers}
              isAdmin={isAdmin}
              completedExercises={completedExercises}
              onNavigate={(id) => { onNavigate(id); setSidebarOpen(false); }}
              onDashboard={() => { onDashboard(); setSidebarOpen(false); }}
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0 overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ unlockedTiers, isAdmin, completedExercises, onNavigate, onDashboard }) {
  const [expandedTier, setExpandedTier] = useState(0);

  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: 'var(--jse-gold)', color: 'var(--jse-bg)', fontFamily: 'var(--font-display)' }}>JS</div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--jse-text)', fontFamily: 'var(--font-display)' }}>AI Mastery</div>
            <div className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>JACK STALLION ENTERPRISE</div>
          </div>
        </div>
        {isAdmin && (
          <div className="mt-3 px-2 py-1 rounded text-center" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid var(--jse-gold-dark)' }}>
            <span className="mono-label" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>ADMIN MODE — ALL TIERS UNLOCKED</span>
          </div>
        )}
      </div>

      {/* Dashboard Link */}
      <div className="px-3 pt-4 pb-2">
        <button onClick={onDashboard} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors duration-150" data-testid="sidebar-dashboard-link">
          <LayoutDashboard size={16} style={{ color: 'var(--jse-teal)' }} />
          <span className="mono-label" style={{ color: 'var(--jse-text)', fontSize: '0.7rem' }}>Dashboard</span>
        </button>
      </div>

      {/* Tier Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {TIERS.map((tier) => {
          const isUnlocked = unlockedTiers.includes(tier.id);
          const isExpanded = expandedTier === tier.id;
          const tierExercisesDone = tier.exercises.filter(e => completedExercises.includes(e.id)).length;

          return (
            <div key={tier.id} className="mb-1">
              <button
                onClick={() => setExpandedTier(isExpanded ? -1 : tier.id)}
                className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/[0.03] transition-colors duration-150 group"
                data-testid="sidebar-tier-row"
              >
                <div className="flex items-center gap-2 text-left">
                  <span className="mono-label" style={{ color: isUnlocked ? 'var(--jse-gold)' : 'var(--jse-muted)', fontSize: '0.6rem' }}>
                    TIER {tier.id}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--jse-text)', fontFamily: 'var(--font-body)' }}>
                    {tier.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {tierExercisesDone > 0 && (
                    <span className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>
                      {tierExercisesDone}/{tier.exercises.length}
                    </span>
                  )}
                  {isUnlocked ? (
                    <CheckCircle2 size={14} style={{ color: 'var(--jse-gold)' }} data-testid="sidebar-tier-unlocked-icon" />
                  ) : (
                    <Lock size={14} style={{ color: 'var(--jse-muted)' }} data-testid="sidebar-tier-lock-icon" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="ml-3 pl-3 border-l border-white/5 space-y-0.5 pb-2">
                  {tier.exercises.map(ex => {
                    const done = completedExercises.includes(ex.id);
                    return (
                      <button
                        key={ex.id}
                        onClick={() => isUnlocked && onNavigate(ex.id)}
                        className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors duration-150 ${isUnlocked ? 'hover:bg-white/5 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                        data-testid={`sidebar-exercise-${ex.id}`}
                      >
                        {done ? (
                          <CheckCircle2 size={12} style={{ color: 'var(--jse-teal)' }} />
                        ) : ex.live ? (
                          <Sparkles size={12} style={{ color: 'var(--jse-gold)' }} />
                        ) : (
                          <div className="w-3 h-3 rounded-full border" style={{ borderColor: 'var(--jse-muted)' }} />
                        )}
                        <span className="text-xs" style={{ color: done ? 'var(--jse-teal)' : 'var(--jse-text)', fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>
                          {ex.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="mono-label text-center" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>
          jackstallionenterprise.com
        </div>
      </div>
    </div>
  );
}
