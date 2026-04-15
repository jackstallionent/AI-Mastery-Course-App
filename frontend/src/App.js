import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  const [unlockedTiers, setUnlockedTiers] = useState([0]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [scores, setScores] = useState({});
  const [completedExercises, setCompletedExercises] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAdmin) {
      setUnlockedTiers([0, 1, 2, 3, 4]);
    }
  }, [isAdmin]);

  const isExerciseUnlocked = useCallback((exerciseId) => {
    const tierId = getExerciseTier(exerciseId);
    return unlockedTiers.includes(tierId);
  }, [unlockedTiers]);

  const updateScore = useCallback((exerciseId, score) => {
    setScores(prev => {
      const best = prev[exerciseId] || 0;
      return { ...prev, [exerciseId]: Math.max(best, score) };
    });
  }, []);

  const markComplete = useCallback((exerciseId) => {
    setCompletedExercises(prev =>
      prev.includes(exerciseId) ? prev : [...prev, exerciseId]
    );
  }, []);

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
  const isUnlocked = unlockedTiers.includes(tierId);

  if (!isUnlocked) {
    const tier = TIERS.find(t => t.id === tierId);
    return <PaywallGate tier={tier} />;
  }

  const Component = exerciseComponents[exerciseId];
  if (!Component) {
    return <div className="p-8 text-center" style={{ color: 'var(--jse-muted)' }}>Exercise not found</div>;
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
      <div className="noise-overlay min-h-screen" style={{ background: 'var(--jse-bg)' }}>
        <AppContent />
      </div>
    </BrowserRouter>
  );
}
