import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

const DEFAULT_TASKS = {
  'Phase 1: Foundation (Weeks 1-2)': ['Form AI governance committee', 'Conduct Shadow AI audit', 'Draft initial AI use policy', 'Select first pilot use case', 'Set up usage monitoring'],
  'Phase 2: Pilot (Weeks 3-5)': ['Deploy first AI tool for pilot team', 'Train pilot team on responsible AI use', 'Establish metrics and KPIs', 'Begin daily usage tracking', 'Collect initial feedback'],
  'Phase 3: Scale (Weeks 6-9)': ['Expand to 3 additional teams', 'Refine AI use policy based on learnings', 'Implement automated compliance checks', 'Deploy vendor evaluation process', 'Create internal knowledge base'],
  'Phase 4: Optimize (Weeks 10-13)': ['Full organization rollout', 'Conduct first ROI assessment', 'Publish internal best practices guide', 'Schedule quarterly compliance reviews', 'Plan next phase of AI integration'],
};

export default function NinetyDayPlanner({ markComplete }) {
  const [columns, setColumns] = useState(() => {
    const cols = { todo: [], inProgress: [], done: [] };
    Object.entries(DEFAULT_TASKS).forEach(([phase, tasks]) => {
      tasks.forEach(task => cols.todo.push({ id: `${phase}-${task}`, text: task, phase }));
    });
    return cols;
  });
  const [dragItem, setDragItem] = useState(null);
  const [activeCol, setActiveCol] = useState(null);

  const handleDrop = (targetCol) => {
    if (!dragItem) return;
    setColumns(prev => {
      const newCols = {};
      Object.keys(prev).forEach(col => { newCols[col] = prev[col].filter(t => t.id !== dragItem.id); });
      newCols[targetCol] = [...newCols[targetCol], dragItem];
      return newCols;
    });
    setDragItem(null); setActiveCol(null);
  };

  const colLabels = { todo: 'TO DO', inProgress: 'IN PROGRESS', done: 'DONE' };
  const colColors = { todo: 'var(--jse-muted)', inProgress: 'var(--jse-teal)', done: 'var(--jse-gold)' };

  return (
    <div className="space-y-6" data-testid="ninety-day-planner-exercise">
      <SectionHeader eyebrow="TIER 4 — ENTERPRISE" title="90-Day Planner" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Kanban board with 4 deployment phases. Drag tasks between columns to plan your AI rollout.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([colKey, tasks]) => (
          <div key={colKey} className="kanban-column p-3" onDragOver={(e) => { e.preventDefault(); setActiveCol(colKey); }} onDragLeave={() => setActiveCol(null)} onDrop={() => handleDrop(colKey)} style={{ borderColor: activeCol === colKey ? 'var(--jse-teal)' : undefined }} data-testid={`kanban-column-${colKey}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="mono-label" style={{ color: colColors[colKey], fontSize: '0.6rem' }}>{colLabels[colKey]}</span>
              <span className="mono-label" style={{ color: 'var(--jse-muted)', fontSize: '0.55rem' }}>{tasks.length}</span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {tasks.map(task => (
                <div key={task.id} draggable onDragStart={() => setDragItem(task)} className="kanban-card" data-testid="kanban-card">
                  <div className="mono-label mb-1" style={{ color: 'var(--jse-muted)', fontSize: '0.45rem' }}>{task.phase}</div>
                  <p className="text-xs" style={{ color: 'var(--jse-text)' }}>{task.text}</p>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-xs text-center py-4" style={{ color: 'var(--jse-muted)' }}>Drop tasks here</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="exercise-card">
        <div className="mono-label mb-2" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>PROGRESS</div>
        <div className="flex items-center gap-3"><div className="jse-progress flex-1"><div className="jse-progress-fill" style={{ width: `${(columns.done.length / (columns.todo.length + columns.inProgress.length + columns.done.length)) * 100}%`, background: 'var(--jse-gold)' }} /></div><span className="mono-label" style={{ color: 'var(--jse-gold)', fontSize: '0.65rem' }}>{columns.done.length}/{columns.todo.length + columns.inProgress.length + columns.done.length}</span></div>
      </div>
    </div>
  );
}
