import { RegenerateButton } from '../RegenerateButton';

export function PRDTab({ requirements, payload, onResult }) {
  if (!requirements) return null;
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{requirements.project_name}</h2>
          <p className="text-sm text-gray-400 mt-1">{requirements.summary}</p>
        </div>
        <RegenerateButton stage="requirements" payload={payload} onResult={onResult} />
      </div>
      <Section title="Actors" items={requirements.actors} />
      <Section title="Core Features" items={requirements.core_features} />
      <Section title="Entities" items={requirements.entities} />
      <Section title="Non-Functional Requirements" items={requirements.non_functional_requirements} />
    </div>
  );
}

function Section({ title, items }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
            <span className="text-violet-500 mt-1">•</span>{item}
          </li>
        ))}
      </ul>
    </div>
  );
}