const STAGES = [
  { key: 'requirements', label: 'Requirements' },
  { key: 'schema', label: 'Schema' },
  { key: 'api', label: 'API' },
  { key: 'frontend', label: 'Components' },
  { key: 'sprint', label: 'Sprint' },
  { key: 'docker', label: 'Docker' },
];

export function StageProgress({ stages }) {
  return (
    <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
      {STAGES.map((s, i) => {
        const status = stages[s.key] || 'pending';
        return (
          <div key={s.key} className="flex items-center gap-2 flex-shrink-0">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              status === 'done' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
              status === 'in-progress' ? 'border-violet-500/30 bg-violet-500/10 text-violet-400' :
              status === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
              'border-white/10 bg-white/[0.02] text-gray-500'
            }`}>
              {status === 'done' && <span>✓</span>}
              {status === 'in-progress' && <span className="w-2.5 h-2.5 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin" />}
              {status === 'error' && <span>✕</span>}
              {status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />}
              {s.label}
            </div>
            {i < STAGES.length - 1 && <div className="w-3 h-px bg-white/10" />}
          </div>
        );
      })}
    </div>
  );
}