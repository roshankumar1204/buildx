import { RegenerateButton } from '../RegenerateButton';

export function SchemaTab({ schema, payload, onResult }) {
  if (!schema) return null;
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <RegenerateButton stage="schema" payload={payload} onResult={onResult} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {schema.tables.map(table => (
          <div key={table.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-violet-400 mb-3">{table.name}</h3>
            <table className="w-full text-xs">
              <tbody>
                {table.columns.map(col => (
                  <tr key={col.name} className="border-t border-white/5">
                    <td className="py-1.5 pr-3 text-gray-300 font-mono">{col.name}</td>
                    <td className="py-1.5 pr-3 text-gray-500">{col.type}</td>
                    <td className="py-1.5 text-gray-600">{col.constraints?.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {schema.relationships?.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Relationships</h3>
          <ul className="space-y-1.5">
            {schema.relationships.map((rel, i) => (
              <li key={i} className="text-sm text-gray-300 font-mono flex items-center gap-2">
                <span>{rel.from_table}</span>
                <span className="text-gray-600 text-xs">{rel.type}</span>
                <span>{rel.to_table}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}