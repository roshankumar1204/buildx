const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function generatePlanStream(spec, onEvent) {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spec }),
  });

  if (res.status === 429) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Rate limit exceeded. Please try again later.');
  }
  if (!res.ok) throw new Error('Generation failed');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        onEvent(JSON.parse(line));
      } catch {
        // skip malformed partial line
      }
    }
  }
}

export async function regenerateStage(stage, payload) {
  const res = await fetch(`${BASE_URL}/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage, ...payload }),
  });
  if (res.status === 429) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Rate limit exceeded. Please try again later.');
  }
  if (!res.ok) throw new Error('Regeneration failed');
  return res.json();
}