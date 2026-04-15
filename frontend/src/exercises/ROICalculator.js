import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ROICalculator({ markComplete }) {
  const [inputs, setInputs] = useState({ aiSpend: '', hoursSaved: '', hourlyRate: '', revenueImpact: '' });
  const [calculated, setCalculated] = useState(false);

  const parse = (v) => parseFloat(v) || 0;
  const aiSpend = parse(inputs.aiSpend);
  const hoursSaved = parse(inputs.hoursSaved);
  const hourlyRate = parse(inputs.hourlyRate) || 50;
  const revenueImpact = parse(inputs.revenueImpact);

  const laborSavings = hoursSaved * hourlyRate * 12;
  const totalROI = laborSavings + revenueImpact - aiSpend;
  const roiPercent = aiSpend > 0 ? Math.round((totalROI / aiSpend) * 100) : 0;

  const chartData = [
    { name: 'AI Investment', value: aiSpend, fill: '#dc3232' },
    { name: 'Labor Savings', value: laborSavings, fill: '#00B4C4' },
    { name: 'Revenue Impact', value: revenueImpact, fill: '#C9A84C' },
    { name: 'Net ROI', value: totalROI, fill: totalROI >= 0 ? '#00B4C4' : '#dc3232' },
  ];

  const handleCalculate = () => { setCalculated(true); if (markComplete) markComplete('roi-calculator'); };

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6" data-testid="roi-calculator-exercise">
      <SectionHeader eyebrow="TIER 4 — ENTERPRISE" title="ROI Calculator" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Input your AI investment details to generate a Three-Pillar ROI analysis with visual charts.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.6rem' }}>INVESTMENT INPUTS</div>
          {[
            { key: 'aiSpend', label: 'ANNUAL AI SPEND ($)', ph: 'e.g., 12000' },
            { key: 'hoursSaved', label: 'HOURS SAVED PER MONTH', ph: 'e.g., 40' },
            { key: 'hourlyRate', label: 'AVG HOURLY RATE ($)', ph: 'e.g., 50' },
            { key: 'revenueImpact', label: 'ANNUAL REVENUE IMPACT ($)', ph: 'e.g., 25000' },
          ].map(f => (
            <div key={f.key}><label className="mono-label block mb-1" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>{f.label}</label><input type="number" value={inputs[f.key]} onChange={e => setInputs(prev => ({...prev, [f.key]: e.target.value}))} placeholder={f.ph} className="jse-input" /></div>
          ))}
          <button onClick={handleCalculate} className="jse-btn-gold w-full" disabled={!inputs.aiSpend} data-testid="primary-action-button">Calculate ROI</button>
        </div>
        <div className="space-y-4">
          {calculated && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="exercise-card text-center"><div className="mono-label mb-1" style={{ color: 'var(--jse-muted)', fontSize: '0.5rem' }}>ROI PERCENTAGE</div><div className="jse-score" style={{ color: roiPercent >= 0 ? 'var(--jse-teal)' : '#dc3232', fontSize: '1.5rem' }} data-testid="challenge-score">{roiPercent}%</div></div>
                <div className="exercise-card text-center"><div className="mono-label mb-1" style={{ color: 'var(--jse-muted)', fontSize: '0.5rem' }}>NET ROI</div><div className="jse-score" style={{ color: totalROI >= 0 ? 'var(--jse-gold)' : '#dc3232', fontSize: '1.5rem' }}>{fmt(totalROI)}</div></div>
              </div>
              <div className="exercise-card" style={{ background: 'var(--jse-bg)' }} data-testid="dashboard-chart">
                <div className="mono-label mb-3" style={{ color: 'var(--jse-gold)', fontSize: '0.6rem' }}>THREE-PILLAR ANALYSIS</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#1E242F', border: '1px solid #C9A84C', borderRadius: '8px', fontSize: '12px', color: '#C8CDD8' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-teal)' }}><div className="mono-label" style={{ color: 'var(--jse-teal)', fontSize: '0.55rem' }}>PILLAR 1: LABOR SAVINGS</div><p className="text-sm" style={{ color: 'var(--jse-text)' }}>{fmt(laborSavings)}/year ({hoursSaved}hrs/mo x {fmt(hourlyRate)}/hr x 12)</p></div>
                <div className="exercise-card" style={{ borderLeft: '3px solid var(--jse-gold)' }}><div className="mono-label" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>PILLAR 2: REVENUE IMPACT</div><p className="text-sm" style={{ color: 'var(--jse-text)' }}>{fmt(revenueImpact)}/year from AI-enabled growth</p></div>
                <div className="exercise-card" style={{ borderLeft: '3px solid #dc3232' }}><div className="mono-label" style={{ color: '#dc3232', fontSize: '0.55rem' }}>PILLAR 3: INVESTMENT COST</div><p className="text-sm" style={{ color: 'var(--jse-text)' }}>{fmt(aiSpend)}/year in AI tools and infrastructure</p></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
