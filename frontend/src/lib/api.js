const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function generatePlan(spec) {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spec }),
  });
  if (!res.ok) throw new Error('Generation failed');
  return res.json();
}

export async function regenerateStage(stage, payload) {
  const res = await fetch(`${BASE_URL}/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage, ...payload }),
  });
  if (!res.ok) throw new Error('Regeneration failed');
  return res.json();
}