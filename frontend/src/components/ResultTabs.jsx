import { useState } from 'react';
import { PRDTab } from './tabs/PRDTab';
import { SchemaTab } from './tabs/SchemaTab';
import { ApiTab } from './tabs/ApiTab';
import { ComponentsTab } from './tabs/ComponentsTab';
import { SprintTab } from './tabs/SprintTab';
import { DockerTab } from './tabs/DockerTab';

const TABS = [
  { id: 'prd', key: 'requirements', label: 'PRD' },
  { id: 'schema', key: 'schema', label: 'Schema' },
  { id: 'api', key: 'api', label: 'API' },
  { id: 'components', key: 'frontend', label: 'Components' },
  { id: 'sprint', key: 'sprint', label: 'Sprint' },
  { id: 'docker', key: 'docker', label: 'Docker' },
];

function Waiting({ label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 py-10 justify-center">
      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-violet-400 animate-spin" />
      Generating {label}...
    </div>
  );
}

export function ResultTabs({ result, setResult, spec, onCost }) {
  const [active, setActive] = useState('prd');
  const patch = (key) => (data) => setResult({ ...result, [key]: data });

  return (
    <div>
      <div className="flex gap-1 border-b border-white/10 mb-5 overflow-x-auto">
        {TABS.map(tab => {
          const ready = !!result[tab.key];
          return (
            <button
              key={tab.id}
              onClick={() => ready && setActive(tab.id)}
              disabled={!ready}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                active === tab.id ? 'border-violet-500 text-white' :
                ready ? 'border-transparent text-gray-500 hover:text-gray-300' :
                'border-transparent text-gray-700 cursor-not-allowed'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {active === 'prd' && (result.requirements
        ? <PRDTab requirements={result.requirements} payload={{ spec }} onResult={patch('requirements')} onCost={onCost} />
        : <Waiting label="requirements" />)}

      {active === 'schema' && (result.schema
        ? <SchemaTab schema={result.schema} payload={{ requirements: result.requirements }} onResult={patch('schema')} onCost={onCost} />
        : <Waiting label="schema" />)}

      {active === 'api' && (result.api
        ? <ApiTab api={result.api} payload={{ requirements: result.requirements, schema_design: result.schema }} onResult={patch('api')} onCost={onCost} />
        : <Waiting label="API" />)}

      {active === 'components' && (result.frontend
        ? <ComponentsTab frontend={result.frontend} payload={{ requirements: result.requirements, api: result.api }} onResult={patch('frontend')} onCost={onCost} />
        : <Waiting label="components" />)}

      {active === 'sprint' && (result.sprint
        ? <SprintTab sprint={result.sprint} payload={{ requirements: result.requirements, schema_design: result.schema, api: result.api, frontend: result.frontend }} onResult={patch('sprint')} onCost={onCost} />
        : <Waiting label="sprint plan" />)}

      {active === 'docker' && (result.docker
        ? <DockerTab docker={result.docker} />
        : <Waiting label="Docker files" />)}
    </div>
  );
}