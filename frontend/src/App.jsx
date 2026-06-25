import { useEffect, useState } from 'react';
import { SpecInput } from './components/SpecInput';
import { ResultTabs } from './components/ResultTabs';
import { generatePlan } from './lib/api';

const STORAGE_KEY = 'builderx-draft-state';

function loadSavedState() {
  if (typeof window === 'undefined') return { spec: '', result: null, error: '' };

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { spec: '', result: null, error: '' };

    const parsed = JSON.parse(saved);
    return {
      spec: typeof parsed.spec === 'string' ? parsed.spec : '',
      result: parsed.result ?? null,
      error: typeof parsed.error === 'string' ? parsed.error : '',
    };
  } catch {
    return { spec: '', result: null, error: '' };
  }
}

export default function App() {
  const [savedState] = useState(() => loadSavedState());
  const [spec, setSpec] = useState(savedState.spec);
  const [result, setResult] = useState(savedState.result);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(savedState.error);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ spec, result, error })
      );
    } catch {
      // Ignore storage quota or browser privacy errors.
    }
  }, [spec, result, error]);

  const handleClear = () => {
    setSpec('');
    setResult(null);
    setError('');

    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors on clear as well.
    }
  };

  const handleGenerate = async () => {
    if (!spec.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await generatePlan(spec);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-200 flex flex-col">
      <header className="border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-semibold text-white">AI Software Architect</h1>
        <p className="text-xs text-gray-500">Turn a one-line requirement into a full engineering plan</p>
      </header>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <SpecInput
          spec={spec}
          setSpec={setSpec}
          onGenerate={handleGenerate}
          onClear={handleClear}
          loading={loading}
          hasSavedData={Boolean(spec || result || error)}
        />

        {error && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <ResultTabs result={result} setResult={setResult} spec={spec} />
          </div>
        )}
      </div>
    </div>
  );
}