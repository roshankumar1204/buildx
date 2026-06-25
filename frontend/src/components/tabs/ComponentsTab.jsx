import { RegenerateButton } from '../RegenerateButton';

function buildTree(components) {
  const byId = {};
  components.forEach(c => { byId[c.id] = { ...c, children: [] }; });
  const roots = [];
  components.forEach(c => {
    if (c.parent_id && byId[c.parent_id]) byId[c.parent_id].children.push(byId[c.id]);
    else roots.push(byId[c.id]);
  });
  return roots;
}

function TreeNode({ node, depth }) {
  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div className="flex items-center gap-2 py-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
          node.type === 'page' ? 'bg-violet-500/15 text-violet-400' : 'bg-white/5 text-gray-500'
        }`}>
          {node.type}
        </span>
        <span className="text-sm text-gray-200 font-medium">{node.name}</span>
        {node.props?.length > 0 && (
          <span className="text-xs text-gray-600 font-mono">({node.props.join(', ')})</span>
        )}
      </div>
      {node.description && (
        <p className="text-xs text-gray-500" style={{ marginLeft: 12 }}>{node.description}</p>
      )}
      {node.children.map(child => <TreeNode key={child.id} node={child} depth={depth + 1} />)}
    </div>
  );
}

export function ComponentsTab({ frontend, payload, onResult }) {
  if (!frontend) return null;
  const tree = buildTree(frontend.components);
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <RegenerateButton stage="frontend" payload={payload} onResult={onResult} />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        {tree.map(node => <TreeNode key={node.id} node={node} depth={0} />)}
      </div>
    </div>
  );
}