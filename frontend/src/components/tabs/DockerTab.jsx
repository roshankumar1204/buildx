import { useState } from 'react';

function CodeBlock({ title, code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="text-xs font-mono text-gray-400">{title}</span>
        <button onClick={handleCopy} className="text-xs text-gray-500 hover:text-white transition-colors">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">{code}</pre>
    </div>
  );
}

export function DockerTab({ docker }) {
  if (!docker) return null;
  return (
    <div className="space-y-4">
      <CodeBlock title="backend/Dockerfile" code={docker.backend_dockerfile} />
      <CodeBlock title="frontend/Dockerfile" code={docker.frontend_dockerfile} />
      <CodeBlock title="docker-compose.yml" code={docker.docker_compose} />
    </div>
  );
}