import { RegenerateButton } from '../RegenerateButton';

const CATEGORY_COLORS = {
  backend: 'bg-blue-500/15 text-blue-400',
  frontend: 'bg-violet-500/15 text-violet-400',
  devops: 'bg-amber-500/15 text-amber-400',
  design: 'bg-pink-500/15 text-pink-400',
};

export function SprintTab({ sprint, payload, onResult }) {
  if (!sprint) return null;
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <RegenerateButton stage="sprint" payload={payload} onResult={onResult} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {sprint.sprints.map(s => (
          <div key={s.sprint_number} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white">Sprint {s.sprint_number}</h3>
            <p className="text-xs text-gray-500 mb-3">{s.goal}</p>
            <div className="space-y-2">
              {s.tasks.map((task, i) => (
                <div key={i} className="rounded-md bg-white/[0.04] p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-200">{task.title}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0">{task.story_points} pts</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                  <span className={`inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded ${CATEGORY_COLORS[task.category] || 'bg-white/5 text-gray-500'}`}>
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}