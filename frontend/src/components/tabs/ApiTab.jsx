import { RegenerateButton } from '../RegenerateButton';

const METHOD_COLORS = {
  GET: 'text-blue-400 bg-blue-500/10',
  POST: 'text-green-400 bg-green-500/10',
  PUT: 'text-amber-400 bg-amber-500/10',
  DELETE: 'text-red-400 bg-red-500/10',
};

export function ApiTab({ api, payload, onResult }) {
  if (!api) return null;
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <RegenerateButton stage="api" payload={payload} onResult={onResult} />
      </div>
      {api.endpoints.map((ep, i) => (
        <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3 mb-1.5">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${METHOD_COLORS[ep.method] || 'text-gray-400 bg-white/5'}`}>
              {ep.method}
            </span>
            <span className="text-sm font-mono text-gray-200">{ep.path}</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{ep.description}</p>
          {ep.request_fields?.length > 0 && (
            <div className="text-xs text-gray-400 mt-2">
              <span className="text-gray-600">Request: </span>
              {ep.request_fields.map(f => `${f.name}: ${f.type}`).join(', ')}
            </div>
          )}
          {ep.response_fields?.length > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              <span className="text-gray-600">Response: </span>
              {ep.response_fields.map(f => `${f.name}: ${f.type}`).join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}