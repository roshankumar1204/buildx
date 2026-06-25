import { useEffect, useState } from 'react';
import { SpecInput } from './components/SpecInput';
import { ResultTabs } from './components/ResultTabs';
import { StageProgress } from './components/StageProgress';
import { CostFooter } from './components/CostFooter';
import { generatePlanStream } from './lib/api';

const EMPTY_STAGES = {
  requirements: 'pending', schema: 'pending', api: 'pending',
  frontend: 'pending', sprint: 'pending', docker: 'pending',
};

const STORAGE_KEY = 'builderx.planSnapshot.v1';

function loadSnapshot() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const snapshot = JSON.parse(raw);
    return {
      spec: typeof snapshot.spec === 'string' ? snapshot.spec : '',
      result: snapshot.result && typeof snapshot.result === 'object' ? snapshot.result : {},
      stages: snapshot.stages && typeof snapshot.stages === 'object' ? snapshot.stages : EMPTY_STAGES,
      totalTokens: Number.isFinite(snapshot.totalTokens) ? snapshot.totalTokens : 0,
      totalCost: Number.isFinite(snapshot.totalCost) ? snapshot.totalCost : 0,
    };
  } catch {
    return null;
  }
}

export default function App() {
  const snapshot = loadSnapshot();
  const [spec, setSpec] = useState(snapshot?.spec || '');
  const [result, setResult] = useState(snapshot?.result || {});
  const [stages, setStages] = useState(snapshot?.stages || EMPTY_STAGES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalTokens, setTotalTokens] = useState(snapshot?.totalTokens || 0);
  const [totalCost, setTotalCost] = useState(snapshot?.totalCost || 0);

  const clearSavedState = () => {
    setSpec('');
    setResult({});
    setStages(EMPTY_STAGES);
    setError('');
    setTotalTokens(0);
    setTotalCost(0);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const snapshotData = {
      spec,
      result,
      stages,
      totalTokens,
      totalCost,
    };

    const hasMeaningfulData =
      spec.trim() ||
      Object.keys(result).length > 0 ||
      Object.values(stages).some(stage => stage !== 'pending') ||
      totalTokens > 0 ||
      totalCost > 0;

    if (!hasMeaningfulData) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshotData));
  }, [spec, result, stages, totalTokens, totalCost]);

  const addCost = (tokens, cost) => {
    setTotalTokens(t => t + tokens);
    setTotalCost(c => c + cost);
  };

  const handleGenerate = async () => {
    if (!spec.trim()) return;
    setLoading(true);
    setError('');
    setResult({});
    setStages(EMPTY_STAGES);
    setTotalTokens(0);
    setTotalCost(0);

    try {
      await generatePlanStream(spec, (event) => {
        if (event.stage === 'error') {
          setError(event.message);
          return;
        }
        if (event.status === 'start') {
          setStages(s => ({ ...s, [event.stage]: 'in-progress' }));
        }
        if (event.status === 'done') {
          setStages(s => ({ ...s, [event.stage]: 'done' }));
          if (event.data) setResult(r => ({ ...r, [event.stage]: event.data }));
          if (typeof event.running_tokens === 'number') {
            setTotalTokens(event.running_tokens);
            setTotalCost(event.running_cost);
          }
        }
        if (event.stage === 'complete') {
          setTotalTokens(event.total_tokens);
          setTotalCost(event.total_cost);
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasAnyResult = Object.keys(result).length > 0;
  const hasSavedData = Boolean(
    spec.trim() ||
    hasAnyResult ||
    Object.values(stages).some(stage => stage !== 'pending') ||
    totalTokens > 0 ||
    totalCost > 0
  );

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
          onClear={clearSavedState}
          loading={loading}
          hasSavedData={hasSavedData}
        />

        {error && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {(loading || hasAnyResult) && (
          <div className="mt-6">
            <StageProgress stages={stages} />
            <ResultTabs result={result} setResult={setResult} spec={spec} onCost={addCost} />
            <CostFooter totalTokens={totalTokens} totalCost={totalCost} />
          </div>
        )}
      </div>
    </div>
  );
}