export const TIERS = [
  {
    id: 0,
    name: 'Free Preview',
    price: 0,
    priceLabel: 'FREE',
    description: 'Experience the quality. Create the itch for more.',
    payhipUrl: null,
    color: 'var(--jse-teal)',
    includes: [],
    exercises: [
      { id: 'train-intuition', name: 'Train Your Intuition', icon: 'Brain', desc: 'Drag-and-drop: sort AI claims as TRUE or FALSE' },
      { id: 'constraint-slider', name: 'The Constraint Slider', icon: 'SlidersHorizontal', desc: 'See how constraints transform prompt quality' },
      { id: 'glossary', name: 'AI Glossary', icon: 'BookOpen', desc: '15 essential terms with flip-card reveals' },
      { id: 'spot-hallucination', name: 'Spot the Hallucination', icon: 'Search', desc: 'Find the AI fabrications hidden in paragraphs' },
    ]
  },
  {
    id: 1,
    name: 'Prompt Mastery',
    price: 29,
    priceLabel: '$29',
    description: 'Master the art of directing AI with precision frameworks.',
    payhipUrl: 'https://payhip.com/jackstallion',
    color: 'var(--jse-gold)',
    includes: [],
    exercises: [
      { id: 'race-builder', name: 'The RACE Builder', icon: 'Layers', desc: 'Build prompts using Role, Action, Context, Expectation' },
      { id: 'negative-constraints', name: 'Negative Constraint Workshop', icon: 'ShieldOff', desc: 'Add constraints to watch quality scores climb' },
      { id: 'template-library', name: 'Prompt Template Library', icon: 'FileText', desc: '10 interactive templates with fill-in variables' },
      { id: 'prompt-debugger', name: 'Prompt Debugger', icon: 'Bug', desc: 'Fix broken prompts using RACE framework' },
      { id: 'chain-builder', name: 'Chain Builder', icon: 'Link', desc: 'Build visual 4-step prompt chains' },
    ]
  },
  {
    id: 2,
    name: 'Demystifying AI',
    price: 39,
    priceLabel: '$39',
    description: 'Deep understanding of AI with live Claude-powered exercises.',
    payhipUrl: 'https://payhip.com/jackstallion',
    color: 'var(--jse-teal)',
    includes: [1],
    exercises: [
      { id: 'council-of-experts', name: 'Council of Experts', icon: 'Users', desc: 'LIVE AI: Get 4 expert perspectives on any question', live: true },
      { id: 'bias-lab', name: 'The Bias Lab', icon: 'Scale', desc: 'Examine AI responses for hidden bias patterns' },
      { id: 'fact-checker', name: 'Fact-Checker Workflow', icon: 'CheckCircle', desc: 'Build a grounding workflow step by step' },
      { id: 'progress-tracker', name: 'Module Progress Tracker', icon: 'BarChart3', desc: 'Track your journey through all 5 modules' },
      { id: 'temperature-dial', name: 'Temperature Dial', icon: 'Thermometer', desc: 'See how temperature affects AI output' },
    ]
  },
  {
    id: 3,
    name: "Director's Bundle",
    price: 150,
    priceLabel: '$150',
    description: 'Advanced AI architecture and the Bicameral Pipeline.',
    payhipUrl: 'https://payhip.com/jackstallion',
    color: 'var(--jse-gold)',
    includes: [1, 2],
    exercises: [
      { id: 'contract-builder', name: 'The Contract Builder', icon: 'FileSignature', desc: 'Build 5-section system prompts with guided tooltips' },
      { id: 'rsip-simulator', name: 'RSIP Simulator', icon: 'RefreshCw', desc: '3 iterative improvement passes with tracked changes' },
      { id: 'constraint-cascade', name: 'Constraint Cascade', icon: 'Layers', desc: '5-layer visualization from Identity to Output' },
      { id: 'ai-studio', name: 'AI Studio Configurator', icon: 'Settings', desc: 'Generate platform-specific system prompts' },
      { id: 'bicameral-pipeline', name: 'Bicameral Pipeline', icon: 'GitBranch', desc: 'LIVE AI: ORSN creative + STDIO verification', live: true },
      { id: 'context-engineer', name: 'Context Engineer', icon: 'Timer', desc: '60-second timed challenge: build a context system' },
      { id: 'cheat-sheet', name: "Director's Cheat Sheet", icon: 'ScrollText', desc: 'Interactive expandable framework reference' },
      { id: 'full-glossary', name: 'Full Glossary', icon: 'Library', desc: '25+ terms with examples and action links' },
    ]
  },
  {
    id: 4,
    name: 'Enterprise',
    price: 299,
    priceLabel: '$299',
    description: 'Complete sovereign AI strategy for teams and organizations.',
    payhipUrl: 'https://payhip.com/jackstallion',
    color: 'var(--jse-teal)',
    includes: [1, 2, 3],
    exercises: [
      { id: 'shadow-ai-auditor', name: 'Shadow AI Auditor', icon: 'ShieldAlert', desc: '10-question assessment with risk scoring' },
      { id: 'compliance-calendar', name: 'Compliance Calendar', icon: 'Calendar', desc: '2026-2027 regulatory timeline with countdowns' },
      { id: 'ninety-day-planner', name: '90-Day Planner', icon: 'Kanban', desc: 'Kanban board with 4 deployment phases' },
      { id: 'policy-generator', name: 'AI Use Policy Generator', icon: 'FileOutput', desc: '8-element wizard to generate policy documents' },
      { id: 'vendor-scorecard', name: 'Vendor Evaluation Scorecard', icon: 'ClipboardCheck', desc: 'Rate vendors on 6 criteria with auto-scoring' },
      { id: 'roi-calculator', name: 'ROI Calculator', icon: 'Calculator', desc: 'Three-Pillar ROI analysis with visual charts' },
      { id: 'compliance-quiz', name: 'Compliance Quiz', icon: 'HelpCircle', desc: '10 scenario-based regulatory questions' },
    ]
  }
];

export const getTierById = (id) => TIERS.find(t => t.id === id);

export const isTierUnlocked = (tierId, unlockedTiers) => {
  return unlockedTiers.includes(tierId);
};

export const getExerciseTier = (exerciseId) => {
  for (const tier of TIERS) {
    if (tier.exercises.find(e => e.id === exerciseId)) return tier.id;
  }
  return -1;
};
