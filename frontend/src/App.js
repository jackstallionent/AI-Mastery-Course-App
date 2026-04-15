import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import PaywallGate from './components/PaywallGate';
import { TIERS, getExerciseTier } from './data/tierConfig';

// Tier 0
import TrainYourIntuition from './exercises/TrainYourIntuition';
import ConstraintSlider from './exercises/ConstraintSlider';
import GlossaryExplorer from './exercises/GlossaryExplorer';
import SpotHallucination from './exercises/SpotHallucination';
// Tier 1
import RaceBuilder from './exercises/RaceBuilder';
import NegativeConstraints from './exercises/NegativeConstraints';
import TemplateLibrary from './exercises/TemplateLibrary';
import PromptDebugger from './exercises/PromptDebugger';
import ChainBuilder from './exercises/ChainBuilder';
// Tier 2
import CouncilOfExperts from './exercises/CouncilOfExperts';
import BiasLab from './exercises/BiasLab';
import FactChecker from './exercises/FactChecker';
import ModuleProgress from './exercises/ModuleProgress';
import TemperatureDial from './exercises/TemperatureDial';
// Tier 3
import ContractBuilder from './exercises/ContractBuilder';
import RSIPSimulator from './exercises/RSIPSimulator';
import ConstraintCascade from './exercises/ConstraintCascade';
import AIStudioConfigurator from './exercises/AIStudioConfigurator';
import BicameralPipeline from './exercises/BicameralPipeline';
import ContextEngineer from './exercises/ContextEngineer';
import CheatSheet from './exercises/CheatSheet';
import FullGlossary from './exercises/FullGlossary';
// Tier 4
import ShadowAIAuditor from './exercises/ShadowAIAuditor';
import ComplianceCalendar from './exercises/ComplianceCalendar';
import NinetyDayPlanner from './exercises/NinetyDayPlanner';
import PolicyGenerator from './exercises/PolicyGenerator';
import VendorScorecard from './exercises/VendorScorecard';
import ROICalculator from './exercises/ROICalculator';
import ComplianceQuiz from './exercises/ComplianceQuiz';

const exerciseComponents = {
  'train-intuition': TrainYourIntuition,
  'constraint-slider': ConstraintSlider,
  'glossary': GlossaryExplorer,
  'spot-hallucination': SpotHallucination,
  'race-builder': RaceBuilder,
  'negative-constraints': NegativeConstraints,
  'template-library': TemplateLibrary,
  'prompt-debugger': PromptDebugger,
  'chain-builder': ChainBuilder,
  'council-of-experts': CouncilOfExperts,
  'bias-lab': BiasLab,
  'fact-checker': FactChecker,
  'progress-tracker': ModuleProgress,
  'temperature-dial': TemperatureDial,
  'contract-builder': ContractBuilder,
  'rsip-simulator': RSIPSimulator,
  'constraint-cascade': ConstraintCascade,
  'ai-studio': AIStudioConfigurator,
  'bicameral-pipeline': BicameralPipeline,
  'context-engineer': ContextEngineer,
  'cheat-sheet': CheatSheet,
  'full-glossary': FullGlossary,
  'shadow-ai-auditor': ShadowAIAuditor,
  'compliance-calendar': ComplianceCalendar,
  'ninety-day-planner': NinetyDayPlanner,
  'policy-generator': PolicyGenerator,
  'vendor-scorecard': VendorScorecard,
  'roi-calculator': ROICalculator,
  'compliance-quiz': ComplianceQuiz,
};

function AppContent() {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  const [unlockedTiers, setUnlockedTiers] = useState([0]);
  const [scores, setScores] = useState({});
  const [completedExercises, setCompletedExercises] = useState([]);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_BACKEND_URL || '';

  // Admin mode unlocks all tiers
  useEffect(() => {
    if (isAdmin) {
      setUnlockedTiers([0, 1, 2, 3, 4]);
    } else if (user?.unlocked_tiers) {
      setUnlockedTiers(user.unlocked_tiers);
    } else {
      setUnlockedTiers([0]);
    }
  }, [isAdmin, user]);

  // Load saved progress from backend
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/progress`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.progress) {
          const savedScores = {};
          const savedCompleted = [];
          data.progress.forEach(p => {
            if (p.score) savedScores[p.exercise_id] = p.score;
            if (p.completed) savedCompleted.push(p.exercise_id);
          });
          setScores(prev => ({ ...prev, ...savedScores }));
          setCompletedExercises(prev => [...new Set([...prev, ...savedCompleted])]);
        }
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    };
    loadProgress();
  }, [isAuthenticated, getAuthHeaders, API_BASE]);

  const updateScore = useCallback((exerciseId, score) => {
    setScores(prev => {
      const best = prev[exerciseId] || 0;
      return { ...prev, [exerciseId]: Math.max(best, score) };
    });
    // Save to backend
    fetch(`${API_BASE}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ exercise_id: exerciseId, score, completed: false }),
    }).catch(console.error);
  }, [getAuthHeaders, API_BASE]);

  const markComplete = useCallback((exerciseId) => {
    setCompletedExercises(prev =>
      prev.includes(exerciseId) ? prev : [...prev, exerciseId]
    );
    // Save to backend
    fetch(`${API_BASE}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ exercise_id: exerciseId, completed: true }),
    }).catch(console.error);
  }, [getAuthHeaders, API_BASE]);

  const navigateToExercise = useCallback((exerciseId) => {
    const adminParam = isAdmin ? '?admin=true' : '';
    navigate(`/exercise/${exerciseId}${adminParam}`);
  }, [navigate, isAdmin]);

  const navigateToDashboard = useCallback(() => {
    const adminParam = isAdmin ? '?admin=true' : '';
    navigate(`/${adminParam}`);
  }, [navigate, isAdmin]);

  return (
    <AppShell
      unlockedTiers={unlockedTiers}
      isAdmin={isAdmin}
      completedExercises={completedExercises}
      scores={scores}
      onNavigate={navigateToExercise}
      onDashboard={navigateToDashboard}
    >
      <Routes>
        <Route path="/" element={
          <Dashboard
            unlockedTiers={unlockedTiers}
            completedExercises={completedExercises}
            scores={scores}
            onNavigate={navigateToExercise}
            isAdmin={isAdmin}
          />
        } />
        <Route path="/exercise/:exerciseId" element={
          <ExerciseRouter
            unlockedTiers={unlockedTiers}
            isAdmin={isAdmin}
            scores={scores}
            completedExercises={completedExercises}
            updateScore={updateScore}
            markComplete={markComplete}
          />
        } />
      </Routes>
    </AppShell>
  );
}

function ExerciseRouter({ unlockedTiers, isAdmin, scores, completedExercises, updateScore, markComplete }) {
  const { exerciseId } = require('react-router-dom').useParams();
  const tierId = getExerciseTier(exerciseId);

  // Handle invalid exercise IDs
  if (tierId === -1) {
    return (
      <div className="max-w-md mx-auto py-16 text-center" data-testid="exercise-not-found">
        <div className="text-4xl mb-4" style={{ color: 'var(--jse-gold)' }}>&#x2726;</div>
        <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Exercise Not Found</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--jse-muted)' }}>
          The exercise "{exerciseId}" doesn't exist. Head back to the dashboard to explore available exercises.
        </p>
      </div>
    );
  }

  const isUnlocked = unlockedTiers.includes(tierId);

  if (!isUnlocked) {
    const tier = TIERS.find(t => t.id === tierId);
    return <PaywallGate tier={tier} />;
  }

  const Component = exerciseComponents[exerciseId];
  if (!Component) {
    return (
      <div className="max-w-md mx-auto py-16 text-center" data-testid="exercise-not-found">
        <div className="text-4xl mb-4" style={{ color: 'var(--jse-gold)' }}>&#x2726;</div>
        <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Exercise Not Found</h2>
        <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>This exercise is not available yet.</p>
      </div>
    );
  }

  return (
    <Component
      scores={scores}
      completedExercises={completedExercises}
      updateScore={updateScore}
      markComplete={markComplete}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="noise-overlay min-h-screen" style={{ background: 'var(--jse-bg)' }}>
          <AppContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
