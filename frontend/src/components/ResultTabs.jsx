import { useState } from 'react';
import { PRDTab } from './tabs/PRDTab';
import { SchemaTab } from './tabs/SchemaTab';
import { ApiTab } from './tabs/ApiTab';
import { ComponentsTab } from './tabs/ComponentsTab';
import { SprintTab } from './tabs/SprintTab';
import { DockerTab } from './tabs/DockerTab';

const TABS = [
  { id: 'prd',        label: 'PRD' },
  { id: 'schema',     label: 'Schema' },
  { id: 'api',        label: 'API' },
  { id: 'components', label: 'Components' },
  { id: 'sprint',     label: 'Sprint' },
  { id: 'docker',     label: 'Docker' },
];

export function ResultTabs({ result, setResult, spec }) {
  const [active, setActive] = useState('prd');
  const patch = (key) => (data) => setResult({ ...result, [key]: data });

  return (
    <div>
      <div className="flex gap-1 border-b border-white/10 mb-5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              active === tab.id ? 'border-violet-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === 'prd' && (
        <PRDTab requirements={result.requirements} payload={{ spec }} onResult={patch('requirements')} />
      )}
      {active === 'schema' && (
        <SchemaTab schema={result.schema} payload={{ requirements: result.requirements }} onResult={patch('schema')} />
      )}
      {active === 'api' && (
        <ApiTab
          api={result.api}
          payload={{ requirements: result.requirements, schema_design: result.schema }}
          onResult={patch('api')}
        />
      )}
      {active === 'components' && (
        <ComponentsTab
          frontend={result.frontend}
          payload={{ requirements: result.requirements, api: result.api }}
          onResult={patch('frontend')}
        />
      )}
      {active === 'sprint' && (
        <SprintTab
          sprint={result.sprint}
          payload={{
            requirements: result.requirements,
            schema_design: result.schema,
            api: result.api,
            frontend: result.frontend,
          }}
          onResult={patch('sprint')}
        />
      )}
      {active === 'docker' && <DockerTab docker={result.docker} />}
    </div>
  );
}