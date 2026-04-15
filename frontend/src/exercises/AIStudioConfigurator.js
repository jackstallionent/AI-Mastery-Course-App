import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Copy, CheckCircle2 } from 'lucide-react';

const PLATFORMS = [
  { id: 'gpt', name: 'Custom GPT', desc: '800-char instructions, 20-file knowledge, API actions, GPT Store distribution', color: 'var(--jse-teal)', bestFor: 'Tools needing external API connections', syntax: 'markdown headers and crisp numeric constraints' },
  { id: 'claude', name: 'Claude Project', desc: '500+ line instructions, project knowledge base, 30+ Agent Skills', color: 'var(--jse-gold)', bestFor: 'Deep customization, teams, complex brand voice', syntax: 'XML tags and contract-style instructions' },
  { id: 'gemini', name: 'Gemini Gem', desc: 'Quick setup (<5 min), Google Drive integration, Workspace native', color: 'var(--jse-teal)', bestFor: 'Teams already in Google ecosystem', syntax: 'clear input labeling and explicit verification steps' },
];

export default function AIStudioConfigurator({ markComplete }) {
  const [platform, setPlatform] = useState(null);
  const [config, setConfig] = useState({ name: '', role: '', rules: '', knowledge: '', output: '' });
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    if (!platform) return '';
    const p = PLATFORMS.find(pl => pl.id === platform);
    if (platform === 'claude') {
      return `<system>\n<identity>${config.role || '[Define role]'}</identity>\n<name>${config.name || '[Assistant Name]'}</name>\n<rules>\n${config.rules || '[Define behavioral rules]'}\n</rules>\n<knowledge>\n${config.knowledge || '[Add domain knowledge]'}\n</knowledge>\n<output_format>\n${config.output || '[Define output format]'}\n</output_format>\n</system>`;
    } else if (platform === 'gpt') {
      return `# ${config.name || '[Assistant Name]'}\n\n## Role\n${config.role || '[Define role]'}\n\n## Rules (Always/Never)\n${config.rules || '[Define rules]'}\n\n## Knowledge Context\n${config.knowledge || '[Add context]'}\n\n## Output Format\n${config.output || '[Define format]'}`;
    } else {
      return `Assistant Name: ${config.name || '[Name]'}\n\nRole: ${config.role || '[Define role]'}\n\nBehavioral Rules:\n${config.rules || '[Define rules]'}\n\nKnowledge Base:\n${config.knowledge || '[Add knowledge]'}\n\nVerification Steps:\n${config.output || '[Define verification]'}`;
    }
  };

  const handleCopy = () => { navigator.clipboard.writeText(generatePrompt()); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-6" data-testid="ai-studio-exercise">
      <SectionHeader eyebrow="TIER 3 — DIRECTOR'S BUNDLE" title="AI Studio Configurator" />
      <p className="text-sm" style={{ color: 'var(--jse-muted)' }}>Choose your platform and generate a complete system prompt tailored to that platform's syntax.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PLATFORMS.map(p => (
          <button key={p.id} onClick={() => setPlatform(p.id)} className="exercise-card text-left" style={{ borderColor: platform === p.id ? p.color : 'rgba(255,255,255,0.05)' }}>
            <div className="mono-label mb-1" style={{ color: p.color, fontSize: '0.6rem' }}>{p.name.toUpperCase()}</div>
            <p className="text-xs" style={{ color: 'var(--jse-muted)' }}>{p.desc}</p>
            <div className="mt-2 text-xs" style={{ color: p.color }}>Best for: {p.bestFor}</div>
          </button>
        ))}
      </div>
      {platform && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {[{key:'name',label:'ASSISTANT NAME',ph:'e.g., Brand Voice Editor'},{key:'role',label:'ROLE & EXPERTISE',ph:'e.g., Senior content strategist...'},{key:'rules',label:'BEHAVIORAL RULES',ph:'Always: ... Never: ...'},{key:'knowledge',label:'KNOWLEDGE CONTEXT',ph:'Company: ... Audience: ...'},{key:'output',label:'OUTPUT FORMAT',ph:'Format: ... Length: ... Tone: ...'}].map(f => (
              <div key={f.key}><label className="mono-label block mb-1" style={{ color: 'var(--jse-gold)', fontSize: '0.55rem' }}>{f.label}</label><input type="text" value={config[f.key]} onChange={e => setConfig(prev => ({...prev, [f.key]: e.target.value}))} placeholder={f.ph} className="jse-input" /></div>
            ))}
          </div>
          <div>
            <div className="mono-label mb-2" style={{ color: PLATFORMS.find(p=>p.id===platform).color, fontSize: '0.6rem' }}>GENERATED {PLATFORMS.find(p=>p.id===platform).name.toUpperCase()} PROMPT</div>
            <div className="exercise-card" style={{ background: 'var(--jse-bg)' }}><pre className="text-xs whitespace-pre-wrap" style={{ color: 'var(--jse-text)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>{generatePrompt()}</pre></div>
            <button onClick={handleCopy} className="jse-btn-teal mt-3 flex items-center gap-2">{copied ? <><CheckCircle2 size={14}/> Copied!</> : <><Copy size={14}/> Copy</>}</button>
          </div>
        </div>
      )}
    </div>
  );
}
